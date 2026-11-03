# 01｜Colibri：超大型 MoE 的 VRAM / RAM / NVMe 分層推論

**查證日期：2026-11-03（Asia/Taipei）**  
**上游：** [JustVugg/colibri](https://github.com/JustVugg/colibri)  
**最新正式版：** v2.1.0（2026-10-31）  
**授權：** Apache-2.0  
**上游狀態快照：** 約 46.7k stars；C 語言；仍在活躍更新。  
**定位：** Local AI → Inference Runtime → Heterogeneous Memory → Sparse MoE / Expert Streaming

## 一句話結論

Colibri 的真正價值不是「744B 模型只吃 9.9GB RAM」，而是：

> **利用 MoE 每個 token 只啟用少部分 experts 的特性，把 dense / 熱資料放在 RAM 或 VRAM，把大量 routed experts 留在 NVMe，按 router 決策載入並快取。**

它把 **VRAM → RAM → NVMe** 當成一套分層模型記憶體。

這是一條和「整個量化模型盡量常駐 RAM / VRAM」不同的本地推論路線。

---

## 1. 社群宣傳中最容易誤解的地方

上游 README 的 GLM-5.2 啟動示例確實顯示：

```text
GLM-5.2 · 744B MoE · int4 · streaming CPU
ready in 32s · resident 9.9 GB
```

但這**不能解讀成「744B 完整模型只需要 9.9GB RAM」**。

同一份上游 README 的目前硬體表對 GLM-5.2 寫的是：

- 模型：744B MoE
- 下載：約 **429 GB**
- RAM：**16 GB 最低 / 24 GB measured**
- GPU：可選，支援 CUDA / Vulkan
- 25 GB laptop 的 cold decode：上游列約 **0.05–0.1 tok/s**

所以：

> **9.9GB 是示例中的 resident footprint，不是模型總大小，也不是官方對 GLM-5.2 的完整 RAM 建議。**

上游寫的「至少 8GB RAM」是 **Colibri 整體 quickstart 的最低門檻**，對應可選的較小模型；不代表 8GB 適合 GLM-5.2 744B。

---

## 2. 為什麼 744B 可以不全放 RAM

上游說明 GLM-5.2：

- 總參數約 744B。
- 每個 token 實際使用約 **40B** 參數。
- 其中每個 token 之間會變動、需要由 router 選擇的 routed experts 約涉及 **11GB** 資料。

因此推論時不需要每次把 744B 所有參數全部讀進快速記憶體。

Colibri 把模型拆成不同 residency：

### Hot：VRAM
- 最常用 experts。
- dense matrices / dense layers（依 backend 與模型）。
- GPU 可執行的 prompt、attention、GEMM 等工作。

### Warm：RAM
- expert cache。
- GPU 放不下但常用的 experts。
- dense / KV / workspace 等 CPU 路徑需要的資料。

### Cold：Disk / NVMe
- 不常用 routed experts。
- 只有 router 選到時才讀取。

上游 `coli plan` 會把這三層直接稱為 **hot / warm / cold backing tiers**。

---

## 3. 核心技術

### 3.1 Expert streaming

routed experts 不必全部常駐。

缺失 expert 可從模型檔 / GGUF 讀取，再參與當層計算。

這讓「模型大於 RAM」成為可能，但代價是：

- storage latency
- storage bandwidth
- page cache 行為
- expert hit rate
- CPU/GPU 與 I/O overlap

都可能進入關鍵路徑。

### 3.2 Learning cache

Colibri 會記錄實際 workload 的 expert routing history，建立 `.coli_usage`。

上游目前會：

- 依使用歷史自動 pin 熱 experts。
- 依 RAM budget 調整 expert cache。
- 在 safe request boundaries 做 live placement。
- 可用 LFRU 類策略淘汰較冷 experts。

因此同一台機器的速度不只是「SSD 幾 GB/s」，也跟**你的 workload 是否能讓 expert cache 命中**有關。

### 3.3 Router-aware prefetch

上游提供 `PILOT=1` router-lookahead disk prefetch。

目的：

> 在計算目前部分工作時，提前把後面可能用到的 experts 從磁碟讀上來。

這和單純 OS readahead 不同，因為它利用了 MoE router 的語義。

### 3.4 Async expert I/O

預設 async expert-load pool 可讓 `pread` 與 matmul 重疊。

上游文件也提供：

- `PIPE`
- `PIPE_WORKERS`
- Linux `URING`
- `DIRECT=1` / O_DIRECT

這些都是在嘗試降低「磁碟讀 expert」真正暴露在前景 decode latency 裡的時間。

### 3.5 Multi-disk streaming

`COLI_MODEL_MIRROR` 可以讓多個獨立磁碟提供同一模型 shard 的副本。

重點不是把任意兩顆 SSD 一加就線性翻倍，而是：

- 啟動時量測頻寬。
- 依磁碟能力做 bandwidth-weighted routing。
- mirror 驗證大小與 safetensors header。
- mirror 讀取失敗會退回 primary。
- partial mirror 可只放最熱 shard。

上游特別警告：**更多 storage bandwidth 不一定直接等於更多 tok/s**，因為 compute、cache residency、PCIe / controller sharing 都可能成為瓶頸。

### 3.6 GPU / CPU 混合 placement

目前上游支援：

- CPU
- Vulkan
- NVIDIA CUDA
- Apple Silicon 的部分 Metal 路徑

v2.1.0 進一步把 routed-expert tier 做到 CUDA / Vulkan，讓：

- VRAM resident experts
- RAM experts
- disk experts

可以在同一模型中分層。

### 3.7 GGUF native execution

v2.1.0 的一個重要變化是：各 engine 可直接讀已發布的 GGUF，不要求再做第二次量化。

上游強調：

- IQ1_S ～ Q8_0
- F16 / BF16
- MXFP4
- Dynamic UD quants

可按原發布 block format 執行。

這對研究很重要，因為「expert streaming」和「再次改模型精度」可以分開討論。

---

## 4. Lossless placement 與 Lossy optimization 要分開

Colibri 的預設 quality / balanced policy 會保留 checkpoint quantization 與 router decisions。

也就是說：

> **把同一份 expert 從 NVMe 搬到 RAM / VRAM，只改執行位置，不應改模型數學語義。**

但上游同時提供顯式 lossy knobs，例如：

- `--topk`
- `--topp`

其中 adaptive expert top-p 可少讀磁碟，但官方文件明確標成 **lossy** 並會警告。

因此研究或 benchmark 時不能把：

- placement optimization
- quantization
- router pruning

混在一起比較。

---

## 5. 目前上游公開的代表性規模

以下只是 **上游 README / release 的特定機器測量**，不是本 Repo 實測：

| 模型 / 情境 | 上游目前資訊 | 判讀 |
| --- | --- | --- |
| Qwen3.6-35B-A3B | 23GB download；10/20GB RAM | 適合較一般本地硬體 |
| DeepSeek V4 Flash 284B | 167GB；16/32GB RAM | 明顯開始依賴 expert streaming |
| GLM-5.2 744B | 429GB；16/24GB RAM | 9.9GB resident demo ≠ 總需求 |
| Inkling 975B | 514GB | dense conversion 後 RAM 可顯著下降 |
| MiMo-V2.6 Pro 1.02T | 564GB | 上游列 54/64GB RAM |
| Kimi K3 2.8T | 1.56TB | 容量可行，不代表互動速度可接受 |

v2.1.0 release 還展示了一台：

- i5-13500
- 62GB RAM
- RTX PRO 4000 Blackwell SFF 24GB

在「模型大於 RAM」時由兩顆 NVMe 補 backing store 的測量。

其中 GLM-5.2 UD-IQ1_S 202GB GGUF 的上游 Vulkan decode 約 **0.633–0.658 tok/s**；Kimi K3 594GB GGUF 約 **0.349 tok/s**。

**結論：能跑 ≠ 好用。**

---

## 6. 跟 llama.cpp 類型的差異

這不是說 llama.cpp 不能 offload，而是兩個專案的主要優化焦點不同。

### 傳統本地 GGUF 路線

```text
模型量化
  ↓
盡量放 RAM / VRAM
  ↓
CPU / GPU layers offload
  ↓
decode
```

瓶頸通常聚焦：

- RAM / VRAM capacity
- memory bandwidth
- GEMM / GEMV
- KV cache
- GPU offload

### Colibri 的超大型 sparse MoE 路線

```text
MoE router
  ↓
active experts
  ↓
VRAM hit?
 ├─ yes → GPU
 └─ no
     ↓
   RAM hit?
   ├─ yes → CPU/GPU staging
   └─ no
       ↓
      NVMe read
       ↓
      cache / pin / promote
```

它把 **storage hierarchy** 直接放進 token decode architecture。

---

## 7. 什麼情況值得用

### 很適合

- 想研究 100B～T 級 sparse MoE，但買不起對應 VRAM / RAM。
- 有高速 NVMe，而且願意接受低 tok/s。
- 研究 expert routing locality。
- 做 heterogeneous memory / cache / prefetch / I/O scheduling。
- 想把同一模型放在 CPU + GPU + RAM + disk 多層執行。

### 不適合

- 只想最快跑 7B / 14B / 30B。
- 需要即時聊天且 SSD / RAM 很有限。
- 模型是 dense model，沒有 MoE sparsity 可利用。
- 只看到「744B」就認為它一定比小模型更值得日常使用。
- 儲存只有 SATA HDD 或慢 SSD，卻期待流暢 decode。

---

## 8. 對手機本地 AI 的意義

Colibri 的**架構思想**對手機很值得研究：

- UFS / RAM / GPU memory hierarchy
- expert locality
- cache-aware routing
- prefetch
- sparse activation

但截至本次查證，上游 quickstart 的正式平台是：

- Windows
- Linux
- macOS

README 沒有把 Android / Termux 列成正式支援路徑。

因此不能直接把 Colibri 當成 POCO / Android 現成推論引擎。

如果未來要把同一思路搬到手機，更合理的研究問題是：

> **能否把 UFS 當 cold expert backing store，同時控制功耗、I/O 壽命、熱節流與 Android memory pressure？**

這需要獨立 PoC，不能由桌機 benchmark 推導。

---

## 9. 本技術庫採用評級

| 項目 | 評級 | 理由 |
| --- | --- | --- |
| 研究價值 | **A** | 超大型 MoE 的 storage-aware inference 很有代表性 |
| 架構創新參考 | **A** | expert cache / tiering / prefetch / multi-disk / GPU tier 值得拆解 |
| 一般日常本地聊天 | **B / C** | 大模型 streaming 速度高度依賴 cache、RAM、SSD、GPU |
| 小模型推論替代 | **C** | 不是它最有優勢的問題 |
| 手機直接採用 | **待驗證** | Android 非目前 README 正式 quickstart 平台 |

---

## 10. 若未來真的測，最低 Benchmark Gate

至少固定：

1. 同一模型 / GGUF / quant。
2. 同一 prompt + output tokens。
3. cold cache / warm cache 分開。
4. expert cache budget 固定。
5. NVMe 型號、filesystem、queue depth。
6. RAM / VRAM placement。
7. CPU threads / affinity。
8. TTFT。
9. prompt tok/s。
10. decode tok/s。
11. p50 / p95 token latency。
12. disk GB/s 與 foreground-visible wait。
13. expert hit rate。
14. peak RSS / VRAM。
15. 功耗與溫度。

且至少做：

- baseline
- +RAM cache
- +VRAM tier
- +prefetch
- +async I/O
- +multi-disk

分開測，不能一次全開然後說某個 feature 有效。

---

## 11. 最值得留下的技術思想

如果只保留五個：

1. **Sparse MoE 不要求全部參數常駐。**
2. **Hot / Warm / Cold model residency。**
3. **Router-aware prefetch。**
4. **Learning expert cache + dynamic placement。**
5. **把 storage benchmark 納入 inference planner，而不是只看模型大小。**

這五點比「744B on 10GB RAM」的宣傳語更值得放進技術庫。

## 原始來源

- [JustVugg/colibri](https://github.com/JustVugg/colibri)
- [README](https://github.com/JustVugg/colibri/blob/main/README.md)
- [v2.1.0 release](https://github.com/JustVugg/colibri/releases/tag/v2.1.0)
- [Apache-2.0 LICENSE](https://github.com/JustVugg/colibri/blob/main/LICENSE)
- [Tuning & runtime knobs](https://github.com/JustVugg/colibri/blob/main/docs/tuning.md)
- [Multi-disk streaming](https://github.com/JustVugg/colibri/blob/main/docs/multidisk.md)

**證據界線：** 本條目核對上游 repository metadata、README、v2.1.0 release、LICENSE 與技術文件；沒有在本 Repo 安裝、下載模型或重跑 benchmark。Stars、模型支援與速度數字都是 2026-11-03 的時間快照。
