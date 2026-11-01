# 03｜索引資料庫：小而準、增量同步、可證明新鮮度

## 適合頂級 Repo 的「多層索引」

```text
Git Repository（唯一程式碼真值）
   │ git commit / tree digest
   ▼
Ingest：ignore rules → parser → symbol extractor → metadata
   ├─ Exact / BM25：檔名、路徑、錯誤字串、文件
   ├─ Symbols：定義、references、imports、exports、SCIP/LSP
   ├─ Optional Vector：概念與非精確語意
   └─ Optional Temporal Graph：決策沿革、跨服務關係
   ▼
Query Router → Top-K + Evidence Contract → Agent
   ▲
Freshness Gate：branch + commit SHA + per-file hash + coverage + last indexed
```

**先考慮零服務／本機選項：** repo 下的 Markdown/ADR 是真值；單 Repo 直接 rg / LSP；少量文件可以先使用 SQLite FTS5（需自行做來源 metadata）；多 Repo 才考慮 Zoekt 服務。不是一開始就需要獨立向量 DB、圖譜 DB、Redis。

## 每一筆索引都應附的欄位

| 欄位 | 用途 |
| --- | --- |
| `source.repo` + `branch` + `commit_sha` | 確認到底索引哪個版本 |
| `path`、`range`、`symbol_id` | 可以返回原始碼再次驗證 |
| `sha256/content_digest` | 檢查內容是否改變 |
| `indexer` + `index_version` | 追蹤 parser／embedding／schema 演進 |
| `indexed_at`、`last_verified_at` | 何時建立、何時驗證 |
| `coverage/status` + `missing_paths` | 區分完整結果與已知盲區 |
| `source_priority`、`sensitivity` | 官方／第三方、可信與權限過濾 |
| `citation/path:lines` | 使模型輸出具有可回溯證據 |

範例 JSON： [examples/search-result-contract.json](examples/search-result-contract.json)。

## 正確的增量更新

1. Git push / commit / worktree change 觸發索引更新；新舊索引使用**不同 generation**。
2. 只更新被修改的檔案與**受影響的跨檔符號引用**；刪除檔案要刪除舊 posting，不只追加新索引。
3. 背景建立新 generation；完成 coverage/freshness 檢查後**原子切換**。失敗保留前一份可用索引，但**明示 stale**。
4. Worktree / 分支應有各自版本標籤，別用 main 的索引回答 feature branch 的程式碼問題。
5. Query 前比對 Repo HEAD / dirty status / index source SHA。若不一致：重新同步，或退回 rg/LSP 即時查找。
6. 除非實測必要，**不要把所有次要分支、node_modules、bin、lockfile、build output 都納入完整語意索引**。
7. 任何「零命中」必須輸出索引健康度；對刪除、重構、安全影響等高風險題目執行原始碼二次驗證。

## 用什麼資料庫？

| 資料規模與問題 | 最小可用方案 | 何時升級 |
| --- | --- | --- |
| 單 Repo 原始碼 | rg + LSP + Git metadata | 符號精度或多 Repo 需求 |
| 少量文件／ADR | SQLite FTS5 / BM25 + metadata | 語意召回仍不足 |
| 許多 Repo 原始碼 | Zoekt + Ctags + 可選 SCIP | 需要跨 Repo 圖分析 |
| 非精確語意與大量文件 | Qdrant / LanceDB / pgvector 任選其一 | 用本地 embedding / 維運可承受時 |
| 複雜時序關係 | Graphiti + Neo4j/FalkorDB 等 | 多跳、時間變動用例顯著勝過檔案搜尋 |

「資料庫越多越準」是錯誤命題；每層會增加索引失效、維護、安全和查找路由成本。

## 特別注意 Codebase Memory MCP

[官方專案](https://github.com/DeusData/codebase-memory-mcp) 在 2026 說明新增背景同步、`check_index_coverage`、圖譜與文件連結，並發表自己測得的 10 倍 Token 下降等工作負載。**這並不能推翻**我們十月歷史測試的 freshness oracle 21/21 FAIL。沒有在**同樣的測資、同樣的更新模式**重新驗證前，維持 `KEEP_WITH_LIMITS`。見 [歷史 A/B](../2026-10-retrospective/02-code-intelligence-benchmarks.md)。

## 安全要求

- 敏感資料**先 ACL 過濾再召回**；不要先把 secrets 檢索出來再依靠模型自我忽略。
- 索引不要吞所有 repo 中的 `.env`、私鑰、密碼、token。
- 按 Tenant / User / Repo 權限分區；保護快取、資料庫備份與刪除流程。
- 向量化後的內容**仍可能具敏感性**，不可因為是 embedding 就視為已脫敏。

### 來源
- https://github.com/sourcegraph/zoekt
- https://github.com/scip-code/scip
- https://www.sqlite.org/fts5.html
- https://qdrant.tech/documentation/hybrid-queries/
- https://github.com/getzep/graphiti
- https://github.com/DeusData/codebase-memory-mcp