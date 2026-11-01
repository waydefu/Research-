# 09｜建議導入路線：先把 80% 問題用最少基礎設施解決

**以下是未執行的研究建議，不會自動操作其他 Repository。**

## 先做的原則

你的既有工作要求保留 `default` Profile、並發 2、停用子代理、遇到未知需求不擴大修改。研究路線在此約束下可以先從**文檔、單代理搜尋策略、驗收基準**著手，絕對不需要直接改 Hermes Profile。

## Phase 0 — 基線與真值

- 盤點現有 CI、AGENTS.md、專案決策文件、搜尋工具、模型使用量及出錯模式。
- 選 30 個真實 task 建立不帶答案的測試組；不同難度分層。
- 定義什麼叫「查找成功」「完成任務」「沒越權」「可合併」。
- 每個 task 建固定 repo SHA、預期來源、最小可用測試命令。
- 紀錄目前主代理 Token、總耗時、重試次數、人工修正數。

**Exit Gate**：有可重做 A 組結果及資料來源，沒有任何新框架部署。

## Phase 1 — 低成本、無持久索引

- 將 `AGENTS.md` 縮成導航＋硬規則，詳細架構移到 docs/INDEX.md。
- 以 `rg --files`、`rg -n`、git、AST／LSP 做精準搜尋；限制 Tool Output。
- 推薦讀取優先順序：README/ARCHITECTURE → path/symbol locator → 指定片段 → 額外 context。
- 用 scripts 處理 hashes、版本、測試選擇，避免 LLM 在確定性工作上消耗 tokens。

**Exit Gate**：A vs B 指標正確且有改善，沒有增加治理與維護成本。

## Phase 2 — 按需索引

- Repo 數量多、搜尋明顯成為瓶頸時才引入 **Zoekt**。
- 需要準確跨檔符號引用時，試 **SCIP**；若單 Repo LSP 足夠就維持 LSP。
- 每次索引附來源 Git SHA、受權限範圍、coverage，失效時退回直接搜尋。
- 對 2026-10 的 Codebase Memory MCP 做獨立重測；不預設啟用。

**Exit Gate**：與 rg/LSP 基線比較，找到更多正確證據、漏報率降低，且查找成本不顯著升高。

## Phase 3 — 有條件的知識／記憶層

- 對大量結構化文件建立 **SQLite FTS5** 或 BM25。
- 關鍵詞搜尋不足的語意任務，再試 Qdrant / LanceDB / pgvector 任一。
- 僅當「事件時間、不同版本間關係、多跳推理」有真需求才測 Graphiti。
- 任何記憶都必須有來源、有效時間、可移除機制及人類覆核。

**Exit Gate**：相同資料／模型下，在實際語意題上明顯優於檔案搜尋。

## Phase 4 — 成本、觀測與安全工作流

- 需要 API Gateway 時才測 LiteLLM，**驗證有 DB 並在超額時 fail closed**。
- 想看模型、工具、檢索耗時與錯誤率時，可接 Langfuse，先審閱資料留存與遙測。
- CI policy 加強：zizmor、Conftest、安全掃描、受保護路徑、PR 檢查。
- 檢查是否符合 gh-aw 權限與成本架構；不把 AI Workflow 當無條件自動合併器。

## Phase 5 — 多代理（最後才考慮）

- 前述方案已證明單代理能力不足，才提出經授權的多代理試點。
- 明確規範 Worker 唯讀／寫入責任、最大並發與 token/cost cap。
- 讓 Goldfish Review、Opus Advisor 各只處理真正有價值的審查，不把每個小任務做成多模型流水線。

## 回退策略

- Repo 文檔能隨 Git revert。
- 外部索引可隨時刪除重建，不當唯一資料來源。
- 知識庫/向量庫只保存衍生資料，失效則回原始來源查。
- MCP 關閉/Provider 故障時，Agent 仍可用 Git + rg + CI 完成基本任務。
- 高權限配置與 secrets 永不因切換索引而改變。

### 優先級與成本直覺（待實測）

| 技術 | 導入價值 | 複雜度 | 先後 |
| --- | --- | --- | --- |
| AGENTS 精簡 + docs 路由 + CI 硬閘門 | 極高 | 低 | 最先 |
| rg / AST / Serena 受限查詢 | 極高 | 低–中 | 最先 |
| 指標 / 成本追蹤 | 極高 | 中 | 同步 |
| Zoekt / SCIP | 有條件很高 | 中 | 有跨 Repo 需求 |
| SQLite FTS5 | 高 | 低–中 | 文件多時 |
| Graphiti / Cognee | 有條件 | 高 | 後期 |
| 多代理 / Provider Router | 有條件 | 高 | 最後 |

**總結：最少的工具數、最清晰的授權、最可靠的來源與實驗結果，通常是第一步。**