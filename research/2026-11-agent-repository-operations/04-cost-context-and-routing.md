# 04｜降低 Token／額度／時間成本：先量測，再節流

**目標函數：** `總成本 / 實際通過任務數`、`完成時間 / 有效任務`、`查找證據的正確率`。不要只追求每次呼叫最少 Token，而是減少**失敗、重做、不必要工具往返**。

## 成本分解

```text
Total Agent Cost
= Main model input/output/cache writes/cache reads
+ Subagent / Advisor model usage
+ Search/embedding/reranking/model routing
+ Tool invocation + CI/Compute/DB/RAM/Network
+ Failed retries + debugging + rework
```

**訂閱制額度 vs API 計費不同。** 貨幣、Token、回合限制、速率限制與排程配額不是同一單位；本研究不假設 Hermes 或 Claude 訂閱可直接接入 LiteLLM 的成本模型。

## Anthropic 官方已確認的上下文優化

來源：https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context

| 作法 | 省哪裡 | 注意事項 |
| --- | --- | --- |
| **Tool Search** | 20+ Tools 的 schema 常駐上下文 | 多一次搜尋工具的回合；小工具集可能得不償失 |
| **Programmatic Tool Calling** | 讓中間 Tool Results 不逐一塞入對話 | 工具執行不能繞過權限；中間資料仍需可稽核 |
| **Prompt Caching** | 重複 prefix 的 API 計費 | **不會直接縮短上下文**；需穩定 prefix、cache TTL |
| **Context Editing** | 刪除不再有用的舊 Tool Result | 可能失去關鍵證據；短任務不一定划算 |

官方也指出 prompt caching 常是先做的優化；2026 模型的 cache read 計費依模型變動，必須看最新定價與實際命中率，不能照貼網路節省百分比。

## 推薦的操作順序

1. **Tool Hygiene**：移除重複功能的 MCP；只按需註冊，限制返回 bytes/lines/rows。先確保正確性。
2. **Repo Context Routing**：AGENTS.md 是導航，不是拷貝整個架構。問題明確時先定位。
3. **用腳本做確定性工作**：列檔案、lint、格式、算 hash、比較 JSON 等不用 LLM 再思考。
4. **最小片段**：只送有用的 `path + line + symbol + snippet`，避免每輪全量 README。
5. **分層模型**：簡單分類／摘要可用輕量模型，但要計入副代理啟動、延遲與漏報。
6. **按錯誤類型升級**：找不到依賴就升級查索引；同一設計問題反覆失敗才升強模型／獨立審查。
7. **重試有上限**：同一工具/錯誤類型的重試次數與時間要有限制，不讓代理無限循環。
8. **跨任務共用 cache**：cache key 必須帶 provider/model/schema/version/commit/ACL；無效時失效。
9. **輸出限額**：大型 diff、log、test output 先用確定性摘要，提供原始 artifact 供後查。
10. **最後核對**：總成本與「修完是否可用」一起驗收。

## LiteLLM：不是一裝就有硬預算

[LiteLLM Gateway](https://github.com/BerriAI/litellm) 能做 provider routing、虛擬 Keys、使用量、預算和速率限額。但 [官方 Budgets 文件](https://docs.litellm.ai/docs/proxy/users) 明確註明：**預算依資料庫儲存的花費強制執行；沒配置必要的 PostgreSQL 資料庫時，有些 budget 配置會 fail open**。任何硬上限都必須做超額拒絕測試。

推薦對需要 API Gateway 的自架應用才評估；若使用封閉 Claude Code/Codex 方案，應先查是否允許攔截 provider、原生額度語義與合規限制。

## 真正能省錢的任務路由

| 任務 | 最低合理手段 | 不值得做的事 |
| --- | --- | --- |
| 文字／符號搜尋 | rg / LSP / AST / Zoekt | 直接叫 Opus 閱讀全部 Repo |
| 查文件更新日 | HTTP headers + 發行版 diff | 每次重啟完整 GraphRAG |
| 依規則選擇測試 | 靜態 dependency graph／CI config | 讓模型猜哪幾個測試足夠 |
| 版號、SHA、JSON 計算 | 確定性程式 | 再呼叫 LLM 計算 |
| 設計取捨 | 主代理 + 可選高階顧問 | 所有工作都使用多個貴模型 |
| 未經驗證的刪檔／部署 | 人類批准 | 輕量模型自動批准 |

## 必須記錄的成本表

- Input, output, cache-read, cache-write tokens（如 provider 回報）。
- 主代理／子代理／顧問各自 token；Model+Reasoning Effort+Provider。
- Tool count、工具等待時間、重試、總 E2E 延遲。
- CI CPU 分鐘、索引 build 時間／容量、Embedding 用量。
- 任務成功率、漏報、手動修正、重新打開 Issue 比例。
- 每個任務的「總成本／成功一次」、「p95 Completion time」、「成本上限是否真的阻擋」。

**研究建議：** 先拿日常 20–30 題 A/B，不要單憑單次感覺加整套多代理架構。

### 來源
https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context
https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence
https://github.com/BerriAI/litellm
https://docs.litellm.ai/docs/proxy/users
https://github.com/langfuse/langfuse