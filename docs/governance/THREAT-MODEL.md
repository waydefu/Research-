# Research- 威脅模型與控制邊界（v2｜2026-11-04）

> 本 Repo 是**公開 GitHub 研究庫**，並透過 GitHub Pages 提供靜態 Sanctum 首頁、歷史 V2 與 Astro V3 閱讀館。歷史 v1 初期把它描述成私人、無正式網站的研究庫，不再能代表部署事實。最新 GitHub 狀態見 [當前狀態](../../site/CURRENT-STATUS.md)。

## 資產、信任邊界與主要風險

| 入口／資產 | 威脅 | 現有控制／界線 | 待驗證 |
| --- | --- | --- | --- |
| GitHub PR 與 Ruleset | 測試未完成或未審改動進 main | PR 必經、不可 force push、Active Ruleset 指定 Research integrity Required | 網站 E2E 的強制性、Review 討論串與第二人核准 |
| Markdown／Agent／來源 | Prompt injection、舊研究被錯當即時操作授權、意外敏感資料 | 原文是低信任資料，Git SHA 與日期保留，公開正文有獨立編輯層 | 47 篇未逐項人工核證、負向注入測試、敏感詞治理 |
| Pagefind／原文索引 | 過期 PR 被當最新技術、搜尋結果污染 | 已編輯 40 篇公共正文排除歷史原文 Pagefind，THREAT-MODEL 不進站內 | 雙層搜尋 #54 合併前不能宣稱原始全量搜尋合格 |
| GitHub Pages／第三方示範 | 外部嵌入追蹤、CSP 拒絕、瀏覽器安全 | 純靜態輸出、iframe 手動載入／關閉卸載、sandbox／no-referrer／受限來源網域 | 真實第三方 CSP、來源信任、權利／追蹤測試 |
| npm／Astro／GitHub Actions | 依賴漏洞、build-time 供應鏈攻擊、PR runner 低信任程式 | npm lockfile、SHA pinned Actions、唯讀權限、不在 PR 直接部署 | 2026-11-04 實際 npm audit 報 Astro critical／sharp high，需升級並回歸 |
| 原創圖／字體／外部資產 | 授權誤認或示意圖冒充原作 | 87 張由本地程式產生的 SVG、字體來源 Git Blob Hash 驗證 | 人工美術及第三方使用個案授權 |
| 行動版與可及性 | 熱、掉幀、文字遮擋、無 JS 不可讀 | Chromium 多尺寸、axe、reduced-motion、無 JS 回歸 | Android/iOS 真機、Safari、CWV 與長時間性能 |

## 安全結論與限制

- 本站目前沒有伺服端帳號或使用者登入 API，不應虛構帳戶驗證漏洞；必須關注的是公開內容、第三方 iframe、前端注入、建置供應鏈與 PR 權限。
- PR runner 在 GitHub 環境執行不可信變更；唯讀 token、固定 Actions SHA、無 PR Secret 只是緩解，**不是**完全網路隔離或供應鏈免疫。
- `CODEOWNERS` 不等於強制 Review；目前 ruleset 核准人數是 0，不能宣稱雙人批准。EAG-100 不是外部企業安全認證。
- `npm audit` 的通報不自動等於已確認可從網路利用；本專案是靜態預渲染，仍須核對實際可達路徑。高／嚴重通報未處理前也不能宣稱安全 Gate PASS。
- GitHub Repo **公開**。不把 THREAT-MODEL 輸出到網站並不等於該檔具備私有 ACL；任何密碼、token 或個資都不得存入公開原文。
- 真機、外站權限、依賴和動態規則需按同一 Git SHA 實際取證；無證據列 UNKNOWN。修補優先：依賴 critical/high + 網站必過 Gate → 搜尋分層／文件新鮮度 → G0 物理裝置與視覺簽核。

復原與事故處理見 [OPERATIONS.md](OPERATIONS.md)。

---

## 歷史 v1（保存，不代表現況）

### Research- 威脅模型與控制邊界（v1 歷史）

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
