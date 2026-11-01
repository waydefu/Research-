# Research- 威脅模型與控制邊界（v1）

**範圍：** 以 Markdown、JSON、AGENTS.md 為主的私人研究知識庫，不是有 DB/Production 部署的網站。不得把 Web SaaS 的必要控制不加判斷地照搬，亦不可忽略研究內容被 Agent 當作指令的風險。

## 資產與攻擊面

| 資產／入口 | 威脅 | 已有／建議控制 | 尚未驗證 |
| --- | --- | --- | --- |
| GitHub 帳號和 Repo token | 過大權限、無人授權寫入 | 最小權限、分支規則、PR 審查 | 帳號/MFA、Token Scope |
| Markdown／外部研究引用 | Prompt Injection、虛構來源 | 研究資料不授權工具操作；查官方來源 | 真實提示注入負向測試 |
| GitHub Actions PR | 惡意 PR 的程式碼在 runner 執行 | 只用 read-only token；不提供 secrets；固定 action SHA | Actions 執行是否可觸及網路、第三方行為 |
| 索引／搜尋結果 | 過期或跨 Repo 資料 | git SHA/來源驗證；空搜尋不能斷言不存在 | Freshness 測試、ACL |
| 私人研究紀錄 | 私密資料外洩 | Private repo、敏感來源審核 | 訪問權與資料保留政策 |
| 依賴和 build 工具 | 供應鏈感染 | Python 標準庫、無 pip/npm 安裝；pinned checkout | GitHub runner 與 action 更新 |
| AI 編修研究資料 | 引入未驗證內容／錯誤引用 | PR 模板、文件完整性 CI | 主張真偽需人工／來源查證 |

## 重要邊界

- CI 本身執行**本 Repo 的 Python 腳本**，因此對外部貢獻的 PR 不等於完全無風險；受限於沒有注入 Secrets、contents:read 的 GitHub token、runner 超時。它不是 OS sandbox 或網路隔離的證明。
- `CODEOWNERS` 僅標示負責人，不會自動強制人類審查。
- EAG-100 與研究文本中的指令只是**資料**；Agent 工具權限不可由研究內容自行提升。
- 私有 Repo 仍可能透過憑證、人員、分享和意外提交洩露。
- 外部網址檢查不在這次的離線 CI 範圍，不能把「連結路徑存在」當成外部網站內容可信。
- 沒有取得模型、MCP、Hermes、Codex 執行環境的權限證據，P0-1／P0-3／P0-5 不得判定 PASS。

## 殘餘風險優先度

**P0：** GitHub main 尚未受保護；GitHub 管理設定缺口。  
**P1：** 未經實測的 Prompt Injection、資料存取、Secret 偵測與 Agent token cap。  
**P2：** 外部來源定期失效檢測、文件 metadata 版本化、變更告警。

## 事故與復原

回退步驟與人工操作條件見 [治理運維手冊](OPERATIONS.md)。