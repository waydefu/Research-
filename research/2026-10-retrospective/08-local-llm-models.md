# 08｜本地 LLM、模型比較與成本導向部署

**研究脈絡：** 十月曾測試手機本地推論、OpenCode 模型服務、Coding 模型和雲端代理工作品質。  
**證據邊界：** 個人環境速度 ≠ 同型號平均，也不能直接代表模型基準評測。

## 最值得保存的個人環境

- 手機：**POCO F8 Ultra**，曾在 Android／Termux／Ubuntu PRoot 研究本地 LLM。
- **Ornith 1.5 9B**：紀錄生成速度約 **6～10 tokens/s**（先前對話提供），是特定模型量化、推論後端、溫度與背景負載下的觀察，未提供完整統一測試方法。
- 其他關聯：Ornith 9B、Mellum 2.1、Muse、MiniMax M3.1 Flash、OpenCode Zen、Qwen3 Q4_K_M、llama.cpp／Adreno OpenCL／Hexagon NPU。
- 雲端：曾比較 Opus 5.5、Sonnet 5.5、Codex（Sol／Luna）在工程任務、寫作、成本上的表現；**主觀感受要與可重現基準分開記錄**。

## 研究分類

| 類別 | 技術／方向 | 真正要量測 |
| --- | --- | --- |
| 推論引擎 | [llama.cpp](https://github.com/ggml-org/llama.cpp) | 熱啟動、prefill、decode t/s、RAM、GPU offload |
| 本地推論 | GGUF 量化（Q4、Q5、Q8 等） | 品質損失、記憶體、速度，不單看檔案大小 |
| 手機加速 | CPU／GPU／NPU 後端 | 正確驅動、delegate 使用、功耗及熱節流 |
| 開發工具 | [OpenCode](https://github.com/anomalyco/opencode) | 模型路由、價格、工具與使用配額 |
| 雲端模型 | Claude／Codex／MiniMax 等 | 同一任務的通過率、返工、總成本 |

## 建議建立同條件實測

用同一組短中長 prompt、相同輸出 token 上限、相同 context、每輪記錄：
1. 首 Token 時間（TTFT）／長文本 t/s。
2. 峰值 RAM、電量消耗、裝置溫度、是否降頻。
3. 簡單推理、JSON、程式任務通過率。
4. 模型檔、量化、引擎版本、thread、GPU layers／backend。
5. 和雲端模型用**同一任務**比較成本與驗收結果。

## 重要結論

- 主模型慢，不代表是純生成速度問題；可能是上下文長、工具鏈、推理策略或回合數。
- 不應以單次主觀體驗就宣稱「某模型全面勝過某模型」。
- 低價／免費模型也有額度、授權、隱私與使用條款；需先確認再自動化部署。

## 2026-11 延伸研究

本篇保留十月本地 LLM 歷史摘要；新的超大型 sparse MoE / storage-aware inference 研究獨立放在：

- [Local AI Inference 技術庫](../2026-11-local-ai-inference/README.md)
- [Colibri：VRAM / RAM / NVMe 分層、Expert Streaming 與 Cache](../2026-11-local-ai-inference/01-colibri-moe-streaming.md)

這兩條路線不要混為一談：一般 GGUF / llama.cpp 重點多為模型常駐與 CPU/GPU offload；Colibri 的核心問題是 **MoE routed experts 如何在 VRAM / RAM / disk 間分層**。

**本文件只是研究摘要，未變更手機或 Hermes 設定。**

### 來源

- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [OpenCode](https://github.com/anomalyco/opencode)
- [Hugging Face GGUF 文件](https://huggingface.co/docs/hub/gguf)
