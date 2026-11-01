# 02｜MCP／程式庫索引：Serena、RepoMap、Codebase Memory MCP

**價值：極高；必須保留失敗與限制。**  
**資料來源：十月對話中的實驗摘要與明確決策；原始儀表板、log 和 test fixtures 尚未附入本 Repo，故屬「歷史實測紀錄，未獨立重跑」。**

## 比較的工具

| 工具 | 主要特色 | 十月決策 |
| --- | --- | --- |
| [Serena](https://github.com/oraios/serena) | LSP symbol 定位、references、語意導覽，支援 MCP | **KEEP_WITH_LIMITS：唯讀為優先** |
| RepoMap | 建立程式庫結構圖／呼叫圖（具體實作、來源須再確認） | **停用**，量測額外成本大 |
| [Codebase Memory MCP](https://github.com/DeusData/codebase-memory-mcp) | 持久化程式庫圖與跨檔案追蹤 | **KEEP_WITH_LIMITS，候選啟用旗標 `enabled:false`** |
| [Context7](https://github.com/upstash/context7) | 以 MCP 取得函式庫新版 API 文件 | **按需使用** |
| Graft、Agency Agents | 分別偏向知識／工作治理及專業代理角色集合 | 候選，不直接整合 |

## 重要測試 1：Serena／RepoMap（三組）

10/04 對話所留的**近似 input token**：

| 組別 | 約略 input tokens | 觀察 |
| --- | ---: | --- |
| Native | 約 106K | 比較基準 |
| Serena | 約 209K | 額外工具與上下文成本需留意 |
| Serena + RepoMap | 約 343K | 成本更高，未觀察到穩定的品質收益 |

**解讀限制：** 上表不是嚴格相同任務、同模型、同工具輸出格式下的一次性證明；缺少原始逐題 log，不得直接轉成通用倍數或性能承諾。

## 重要測試 2：Codebase Memory MCP（10/09）

| 指標 | 歷史記錄 | 解讀 |
| --- | ---: | --- |
| Active soak | **7,200.29 秒** | 壓測運行時間，不代表查找正確 |
| Lifecycle | **21/21 PASS** | 啟停循環穩定 |
| Errors / orphan processes | **0 / 0** | 生命周期層面沒有觀察到故障 |
| Freshness oracle | **21/21 FAIL** | `metadata_changed` 問題，**阻止正式啟用** |
| 12 任務 A/B：執行時間 | **−1.2%** | 近乎持平 |
| 12 任務 A/B：Input tokens | **−3.0%** | 微量下降 |
| 12 任務 A/B：API calls | **−6.7%** | 略少 |
| 12 任務 A/B：Output tokens | **+15.7%** | 反而增加 |
| Whole-file reads | **+3** | 未證明一定能減少整檔讀取 |

以上為**十月紀錄的比較結果**，不是今天重跑，也不代表目前版本。沒有完整 denominator／confounders 就不能換算統計顯著性。

## 為何停用而非直接裝上

- 索引新鮮度（stale metadata）可能讓代理引用過期內容。
- `trace_path`／`CALLS` 未能可靠覆蓋所有呼叫點；曾有 `lib/route.js:568` 查找漏報。
- 必須標示 `complete_callers=false`、`there_are_no_callers=false`；**不得用空結果推論呼叫點不存在**。
- 若無法證明索引 freshness，需由原始碼／LSP／精準 grep 交叉查證。

## 重新驗證的 Gate

1. 固定 Codebase Memory、編輯器、模型、程式庫 SHA、測試樣本。
2. 先讓 freshness oracle 在 `metadata_changed` 和 `sleep/resume` 情境通過。
3. 對呼叫點完整性設負面案例，不得憑缺漏結果作刪除決策。
4. 對照 Native、Serena、Serena + CBM，重做 12+ 相同任務。
5. 量測**全部 Token**、耗時、正確率、漏報率與人工返工量。
6. 在所有 Gate 通過前，維持 **`KEEP_WITH_LIMITS`、`enabled:false`**。

### 原始來源

- [Serena 原始專案](https://github.com/oraios/serena)
- [Codebase Memory MCP 原始專案](https://github.com/DeusData/codebase-memory-mcp)
- [Context7 原始專案](https://github.com/upstash/context7)
- [Graft（研究候選）](https://github.com/trailhq/Graft)
- [Agency Agents（研究候選）](https://github.com/msitarzewski/agency-agents)
