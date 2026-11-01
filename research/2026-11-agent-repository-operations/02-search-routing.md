# 02｜讓 Agent 迅速找到任意資訊：查詢路由與搜尋分層

**關鍵：不要一開始就 embeddings／大模型摘要，更不要將整個 repo 丟進上下文。** 不同查詢有不同最合適的工具。

## 搜尋路由決策表

| 使用者問法／搜尋目的 | 第一選擇 | 無法解答才升級 |
| --- | --- | --- |
| 記得路徑或檔名 | `rg --files` / git ls-files / 文件目錄 | 索引目錄 |
| 具體文字、錯誤訊息、ID | [ripgrep](https://github.com/BurntSushi/ripgrep) / git grep | 跨 Repo 使用 Zoekt |
| 類似語法或指定程式模式 | [ast-grep](https://github.com/ast-grep/ast-grep) | Tree-sitter AST / LSP |
| 查某個 function 定義／呼叫者 | [Serena](https://github.com/oraios/serena) LSP | [SCIP](https://github.com/scip-code/scip) 精確索引 / 原始碼交叉檢查 |
| 幾十、上百個 Repo 全文查詢 | [Zoekt](https://github.com/sourcegraph/zoekt) trigram index | 非索引分支回退 git grep |
| 查 API 最新規格、產品手冊 | 官方文件、版本化 docs / Context7 | 受控外網查證 |
| 不知道原詞的概念問題 | 標題/FTS/BM25 → semantic embedding | hybrid rerank／Graph retrieval |
| 多年份、跨系統事實如何演變 | 文件引用 + timestamp/version | Graphiti 時序圖譜（若資料量值得） |
| 一次性打包供人或模型審閱 | [Repomix](https://github.com/repomix/repomix) 限定目錄 + token tree | **不得長期每次全量注入** |

## 如何控制一次搜尋的 Tokens

先 `rg --files` 和 `rg -n` 定位；返回**top N** 命中、路徑、行號和周邊最小必要行數；再精準閱讀相鄰原始碼或 Symbol Body；不要直接全檔輸出到 Tool Result。

一條理想的檢索結果：`path:line | symbol | source SHA | 摘要短句 | 可信度／不完整警示`。

**正確率先於省 Token：** 若索引可能漏掉動態呼叫、反射、框架路由、生成程式碼，必須標 `partial` 並用原始碼二次檢查。空列表 ≠ 沒有任何呼叫點。

## 搜尋引擎深入比較

- **ripgrep**：零索引依賴、跨平台；適合單 Repo 的日常精確查找。最小成本、首選基線。
- **ast-grep**：基於 Tree-sitter 的 AST 結構查找/替換；適合「形狀相同、文字不同」的程式模式。
- **Serena**：LSP 語義 Symbol 層級，可對引用、宣告、修改做細粒度定位。需要觀察語言伺服器啟動成本。
- **SCIP + scip-typescript**：保留型別／符號索引，讓定義與參照查找更精確；建索引需 TS 專案相容環境且可能耗記憶體。**SCIP 是索引格式，不是自帶一整套搜尋 UI。**
- **Zoekt**：Trigram 索引，適合跨 Repo 大量文字／Regexp 搜尋；索引、同步、儲存與權限 ACL 都需要額外管理。
- **Aider Repository Map**：用 Tree-sitter 與圖重要性挑選相關符號，受 `--map-tokens` 預算控制；作為**策略參考**，不是既有 Codex 可直接注入的一個開關。
- **Repomix**：輸出檔案可供一次性閱讀，支援 `--token-count-tree`。不適合每輪全量讀取。

## 兩種最容易出錯的優化

1. **把所有內容切 chunk、做向量再搜**：錯誤訊息、Symbol 或 commit 雜訊往往需要 literal exact match；向量不保證找得到完整呼叫點。
2. **把索引查詢的 0 命中當成不存在**：若索引不是目前 branch/commit、生成檔未包含、語言 Server 尚未 ready，答案可能是假陰性。

## 多 Repo 查找最小方案

`git/rg → ast-grep → LSP →（跨 Repo 才）Zoekt →（需要）SCIP →（真的語意性才）BM25+Vector`。

量測**首次命中時間、找到正確檔案率、Source Verified rate、漏報、總輸出 Token**，而不是只看單次 query latency。

### 來源
- https://github.com/BurntSushi/ripgrep
- https://github.com/ast-grep/ast-grep
- https://github.com/oraios/serena
- https://github.com/scip-code/scip
- https://github.com/sourcegraph/scip-typescript
- https://github.com/sourcegraph/zoekt
- https://aider.chat/docs/repomap.html
- https://repomix.com/guide/usage