# 11｜AI Coding 時代的 JavaScript Framework 成本：Agent Token、時間、LOC 與 Runtime

**查證日期：2026-11-03（Asia/Taipei）**  
**主要來源：** Nolan Lawson〈[The AI cost of JavaScript frameworks](https://nolanlawson.com/2026/10/28/the-ai-cost-of-javascript-frameworks/)〉（2026-10-28）  
**Benchmark harness：** [nolanlawson/agent-framework-benchmark](https://github.com/nolanlawson/agent-framework-benchmark)  
**定位：** Agent Engineering × Web Framework Selection × Cost Engineering

## 核心結論

這份研究最值得保留的不是「哪個框架第一名」，而是它提出了一個可量測的新選型維度：

> **Framework 不只會影響 runtime、DX 與 bundle，也會影響 Coding Agent 完成同一工作所需的 Token、時間、程式碼量、工具查找與返工。**

因此本 Repo 將框架選型增加一個正式維度：

```text
Framework Decision
├─ Product fit
├─ Runtime performance
├─ Accessibility
├─ Deployment / operations
├─ Human maintainability
└─ Agent cost
   ├─ tokens
   ├─ wall time
   ├─ tool / docs usage
   ├─ retries / rework
   └─ generated code size
```

這不是把「AI 最省 Token」凌駕於產品需求，而是把它納入總工程成本。

---

## 1. Benchmark 到底測了什麼

作者設計同一個中小型 Pokédex Web App，讓 Coding Agent 使用不同 JavaScript framework / meta-framework 實作。

主要控制：

- 同一份產品規格。
- 同一套 acceptance / conformance tests。
- 同一行任務 prompt，僅替換 framework 名稱。
- Claude Opus 5.5。
- high effort。
- 每次在新的 Podman container 裡執行。
- framework 可獲得其官方文件建議的 MCP / Skills / Claude Code plugin。
- Agent 不會被告知 Lighthouse 是評分項目。
- 原則上每框架跑 5 次，使用中位數；Angular 部分品質／LOC 指標只有 3 個可測 app。
- Lighthouse 再於獨立 container 以 mobile profile 量測。

Benchmark repo 提供可重跑指令：

```bash
node bench/run.mjs --frameworks=all --iterations=5 --effort=high
```

Agent 完成後，只有它產生的 `app/` 會被複製到乾淨 container 重新跑 `npm test`，避免 Agent 修改測試或留下背景程序影響結果。

這個隔離方式很值得借鑑。

---

## 2. 2026-10-28 實驗快照

以下是作者文章中的中位數；**不是本 Repo 重跑結果**。

| Framework | API 成本 / run | Token / run | Agent 時間 | LOC |
| --- | ---: | ---: | ---: | ---: |
| Hono + htmx | $2.67 | 4.26M | 8.6 min | 1,370 |
| Astro | $2.76 | 4.13M | **8.2 min** | 1,461 |
| Nuxt | $2.82 | **3.85M** | 9.0 min | 1,415 |
| Vanilla + Vite | $2.98 | 5.00M | 10.1 min | 1,492 |
| Next.js | $3.14 | 4.99M | 10.9 min | 1,539 |
| Qwik | $3.27 | 5.64M | 10.7 min | 1,744 |
| TanStack Start | $3.54 | 7.07M | 10.3 min | 1,697 |
| SolidStart | $3.79 | 7.13M | 11.2 min | 1,630 |
| React Router | $3.81 | 7.58M | 12.5 min | 1,564 |
| SvelteKit | $4.28 | 8.53M | 10.8 min | 1,611 |
| Gracile + Lit | $4.65 | 9.04M | 12.1 min | 1,717 |
| Angular | $4.97 | 9.76M | 17.2 min | 2,009 |

### 不能誤讀

這個表不能推出：

- Astro 永遠最適合所有 Web App。
- Angular 永遠讓 Agent 最差。
- Vanilla JS 永遠不划算。
- MCP / Skills 普遍有害。
- Token 越低的框架品質一定越高。

它只代表**這個 workload、這個時間點、這個 Agent / model / tooling ecosystem** 的結果。

---

## 3. Runtime 端的觀察

這個 workload 偏 content-heavy，因此 HTML-first / server-first 架構在 page-load 指標有先天優勢。

作者的首頁中位數包含：

| Framework | Client JS | TBT | LCP |
| --- | ---: | ---: | ---: |
| Astro | 0 KiB | 0 ms | 810 ms |
| Hono + htmx | 18 KiB | 0 ms | 978 ms |
| SvelteKit | 36 KiB | 0 ms | 1,130 ms |
| Nuxt | 84 KiB | 40 ms | 1,727 ms |
| React Router | 115 KiB | 17 ms | 1,729 ms |
| TanStack Start | 118 KiB | 1 ms | 2,028 ms |
| Next.js | 142 KiB | 71 ms | 2,090 ms |
| Angular | 93 KiB | 103 ms | 1,954 ms |

作者自己明確指出：

- App 比較像 Wikipedia，不像 Figma / Gmail。
- 主要量測 page load，沒有充分量測載入後複雜互動。
- Lighthouse / Core Web Vitals 對 MPA / server-rendered HTML 比較有利。
- API server 與 app server 都在本機，server-side API call 沒有人工 latency。

因此這些數字是**架構／workload 相依證據**，不是通用排名。

---

## 4. Vanilla 沒有自動勝出的意義

Vanilla + Vite 並沒有在 Agent 成本上擊敗所有 framework。

一個合理的工程解讀是：

> **好的 Framework 也能替 Agent 壓縮解法搜尋空間。**

如果框架把 routing、資料載入、元件邊界、server/client 慣例說得夠清楚，Agent 不需要每次自行設計整套 architecture。

所以「抽象越少 = AI 一定越容易寫」不成立。

這對我們的 Agent 治理很重要：

- **太多抽象**會增加 API / 文件 / tool lookup。
- **太少約束**也可能增加設計決策與返工。
- 最佳點是「足夠明確、足夠小、能被 Agent 正確檢索」。

---

## 5. MCP / Skills 的真正訊號

作者替多個 framework 預裝官方建議的 AI tooling，但 Agent 是否真的使用差異很大。

文章記錄例如：

- Astro MCP：2 / 5 runs。
- Next.js：skill files 1 / 5、AGENTS.md 2 / 5。
- Nuxt MCP：0 / 5。
- React Router skill：5 / 5。
- Svelte plugin MCP：5 / 5。
- Hono skill：5 / 5。

這裡最重要的不是哪一套工具「最好」，而是：

> **Installed ≠ discovered ≠ used ≠ useful。**

所以我們評估 MCP / Skills 時，至少要分成四個指標：

1. Discovery rate。
2. Use rate。
3. Task-success delta。
4. Cost delta。

只看「Agent 有呼叫 MCP」完全不夠。

### 新框架 / 新版本的文件成本

SvelteKit 在作者實驗中每次都讀 migration guide，作者推測與版本太新、模型訓練資料不足有關。

這揭示一個很實際的 Agent 成本：

```text
Framework freshness
      ↓
training-data gap
      ↓
docs / migration lookup
      ↓
more context + more tool calls
      ↓
higher token / latency
```

因此「最新版」可能同時帶來 runtime / feature 優勢與 Agent knowledge gap。

---

## 6. 對本 Repo 的 Agent Cost 定義

本 Repo 後續在技術選型 A/B 中，建議使用：

```text
Agent Engineering Cost
= model token cost
+ wall-clock time
+ tool / retrieval overhead
+ failed attempts / rework
+ review / repair cost
+ future context cost
```

其中 future context cost 可用以下 proxy 追蹤：

- source LOC。
- dependency count。
- config surface。
- generated boilerplate。
- framework-specific conventions。
- 需要固定載入的 AGENTS / Skills 文件量。

**這是研究建議，不是假裝有一個已被證明的單一數學公式。**

---

## 7. 對 EAG-100 / Agent 治理的直接改動

### 原本只問

- 省多少 Token？
- 查找快多少？
- 任務通過率多少？
- 工具有沒有 stale？

### 現在再加

- 同一產品需求，在不同 stack 下 Agent 成本差多少？
- MCP / Skill 的 discovery / use rate 是多少？
- 啟用工具後真正的 cost-per-success 有沒有下降？
- codebase LOC / config surface 是否讓後續修改成本上升？
- framework 升版後，是否因 training-data gap 大量讀 migration docs？
- 首次建立與第 N 次維護的成本是否不同？

這讓「Framework 選型」與「Agent 額度治理」正式接起來。

---

## 8. 建議的本 Repo Framework A/B

如果未來要真的驗證 Research Showcase / 一般 Web 專案，不應直接照抄 Pokédex workload。

應至少拆成三種 workload：

### A. Content-heavy
例如研究站、文件站、品牌展示。

候選：
- Astro
- Nuxt
- Next.js

量：
- Token
- time
- LOC
- client JS
- LCP / INP
- build
- accessibility

### B. App-heavy
例如登入後 dashboard / 管理介面。

候選：
- Next.js
- React Router
- TanStack Start
- SvelteKit

增加：
- client navigation latency
- state changes
- mutation flows
- optimistic UI
- long-session memory

### C. Creative / WebGPU
例如 Research Showcase。

固定同一份：
- DOM content shell
- Three.js scene
- scroll choreography
- adaptive quality
- mobile fallback

量：
- Agent implementation cost
- renderer bugs
- bundle
- frame time
- main-thread work
- fallback correctness
- total LOC

只有這樣才能回答「哪個 stack 最適合**我們**」。

---

## 9. 最低實驗規格

若要聲稱某 framework 對 Agent 更省，至少：

1. 相同模型與 effort。
2. 相同產品 spec。
3. 相同 acceptance tests。
4. 每個 variant ≥ 3 runs；最好 5+。
5. sandbox / clean repo。
6. 記錄完整 transcript。
7. 記錄 input / output / cache token。
8. 記錄 wall time。
9. 記錄 tool / MCP / Skill calls。
10. 記錄 final test success。
11. 記錄 repair / retry 次數。
12. 記錄 source LOC。
13. Runtime benchmark 分開跑。
14. 報 median + variance，不只挑最好的一次。
15. 框架、工具、模型版本全部留存。

---

## 10. 對目前 Astro 選型的影響

這份 benchmark **增加了 Astro 用於 content-heavy Research Showcase shell 的支持證據**：

- Agent 建置時間在該 workload 很低。
- Token 成本較低。
- 產生的 client JS 很少。
- page-load 指標很好。

但它**不是**我們選 Astro 的最終證明。

Research Showcase 還有：

- Three.js / WebGPU。
- 電影式 scroll。
- GPU adaptive quality。
- mobile degradation。
- 內容索引與研究全文。

因此 Astro 仍應被理解為：

> **Content / App Shell 候選，而不是 3D Renderer。**

真正的 Showcase stack 是否最佳，仍需我們自己的 Creative / WebGPU workload A/B。

---

## 11. 研究價值評級

| 項目 | 評價 |
| --- | --- |
| Agent 成本方法論 | **A+** |
| Framework 普遍排名證據 | **C** |
| Content-heavy Web 選型參考 | **A-** |
| MCP / Skill 評測啟發 | **A** |
| 可重現性 | **A-**，有 harness / results / containers，但 ecosystem 版本會漂移 |
| 直接套用到 Research Showcase | **B**，需另做 WebGPU workload |

## 來源與證據邊界

- Nolan Lawson：〈[The AI cost of JavaScript frameworks](https://nolanlawson.com/2026/10/28/the-ai-cost-of-javascript-frameworks/)〉。
- [nolanlawson/agent-framework-benchmark](https://github.com/nolanlawson/agent-framework-benchmark)：同 spec、containers、acceptance tests、Lighthouse、Token / time / LOC 記錄方法。
- [Benchmark results](https://github.com/nolanlawson/agent-framework-benchmark-results)：作者文章對應的原始執行結果。
- Benchmark repo `package.json` 宣告 `Apache-2.0`；GitHub repository metadata 在本次查證沒有偵測到 license object，正式重用程式碼前仍應檢查完整授權檔與版本。

**本 Repo 尚未重跑此 benchmark。本文中的框架數字皆為作者 2026-10-28 報告的外部實驗結果。**
