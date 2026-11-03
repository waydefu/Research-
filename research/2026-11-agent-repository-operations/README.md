# 2026/11｜頂級 GitHub 專案的 AI Agent 治理、搜尋、索引、記憶與成本工程

**研究日：2026-11-02（Asia/Taipei）**  
**範圍：通用 GitHub Repository；適用 Codex / Claude Code / Hermes / OpenCode 等代理環境，但不是全部功能都能跨宿主直接互通。**  
**狀態：官方與上游文件研究、架構設計已完成；沒有安裝新工具、改動其他 Repo、執行同環境性能實測。**

## 核心結論

**最有效的 Agent 不一定擁有最多子代理、最多 MCP 或最大的記憶庫。真正有效的是「用最低必要成本，把可驗證且新鮮的證據送進模型，並將執行權限留在確定性系統」。**

最佳順序：

1. **權限與任務邊界**：人類決策、最小權限、工作樹／PR、固定 CI Gate。
2. **精確查詢優先**：檔案樹/精準 grep → AST／LSP → Repo 索引 → 知識／語意檢索，不把所有檔案送進模型。
3. **索引新鮮度**：任何答案要附來源的 repo、branch、commit SHA、路徑、行號、索引版本與完整性註記。
4. **上下文控制**：短 AGENTS.md、按需 Skills、工具動態發現、結果長度上限、必要時 Prompt Cache。
5. **成本與品質並看**：記錄包含子代理、工具與修復重工在內的總成本；用任務通過率及資訊查找的 Recall@k 驗收。
6. **記憶按需求選型**：先用文件與全文搜尋；向量／圖譜是回答複雜語意與歷史關係的可選層，不應預設採用。

## 研究導航

| 專題 | 內容 |
| --- | --- |
| [EAG-100｜企業級治理評分規範](EAG-100.md) | 100 分、20 項控制、五項 P0 一票否決、成熟度門檻 |
| [EAG-100 稽核模板](EAG-100-AUDIT-TEMPLATE.md) | 記錄證據、測試結果、分數、未解風險與改善行動 |
| [01｜治理和權限](01-governance-and-authority.md) | Repo 規則、PR、人工批准、CI、權限矩陣 |
| [02｜查找任何資訊的路由](02-search-routing.md) | 精確搜尋、AST、LSP、SCIP、Zoekt、混合檢索 |
| [03｜可維護索引資料庫設計](03-index-database-design.md) | Schema、增量索引、版本、來源與新鮮度 |
| [04｜Token、時間與額度成本](04-cost-context-and-routing.md) | Cache、工具檢索、輸出截斷、模型與預算 |
| [05｜長期記憶和 RAG](05-memory-and-rag.md) | Mem0、Cognee、Graphiti、SQLite/FTS 與測試證據 |
| [06｜Agent 工作流與上下文](06-agent-workflows.md) | 單主控、可選子代理、狀態機、停止條件 |
| [07｜安全與 CI](07-security-and-ci.md) | gh-aw、權限、外部輸入、zizmor、Conftest |
| [08｜驗收基準與實驗](08-evaluation-and-benchmarks.md) | 完整 A/B、追蹤資料與採用 Gate |
| [09｜分階段導入路線](09-implementation-roadmap.md) | 不改現況的最小可行方案、升級與回退 |
| [10｜開源專案精選](10-github-project-catalog.md) | 推薦 GitHub Repo 與用途、採用條件 |
| [11｜AI Framework Agent Cost](11-ai-framework-agent-cost.md) | Framework 對 Token、時間、LOC、工具使用與 Runtime 的成本影響 |
| [來源總表](SOURCES.md) | 官方來源、原始碼、研究限制 |
| [索引證據契約範例](examples/search-result-contract.json) | 可被程式驗證的檢索結果結構 |

## 重要的既有證據

使用者於 2026-10 記錄：Codebase Memory MCP 曾以 12 題 A/B 測試發現 Input tokens -3.0%、Output tokens +15.7%、耗時 -1.2%；並有 freshness oracle **21/21 FAIL**。這些是十月歷史紀錄，**沒有在本次重新執行**，因此不能拿新版上游自我宣稱的性能提升當成對原問題的修復證據。見 [原始回顧](../2026-10-retrospective/02-code-intelligence-benchmarks.md)。

## 與其他研究相連

- [EGM、Advisor、Jev](../2026-11-agent-engineering/README.md)：模型角色與設計審查，不能代替治理。
- [現代 Web 工程](../2026-11-universal-web-engine/README.md)：框架／部署／Web 專案技術選型。

> 所有「推薦」均屬研究結論；不代表已獲許可在任何開發環境中安裝、運行或合併。