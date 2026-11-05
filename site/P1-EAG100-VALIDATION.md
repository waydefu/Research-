# EAG-100 P1｜可執行控制與仍需人工證明的安全 Gate

> 本檔案是針對 2026-11-05 現存工作流程的**靜態機械式控制驗證**，不是 EAG-100 20 項全 PASS，也不是外部合規認證。

## 已有工程約束（本包以回歸測試保護）

1. `Research integrity` 透過無路徑過濾的 `pull_request` always-reporting 狀態送出固定 job 名稱 `Markdown, JSON and governance integrity`。
2. 此 Required job 使用 read-only `contents: read`，執行 Python 文件完整性、zizmor、npm audit high/critical、Astro check、build、SHA provenance 與 Playwright E2E。若其中一步失敗，該 job 不可 PASS。
3. Pages 工作流程可針對受影響路徑觸發，但不是單靠它作全 PR Required Gate。部署需要 build 完成、僅 main push、`pages:write`／OIDC 只授給受限制的 deploy job。
4. `site/tests/governance-workflow-controls.test.mjs` 包含不改 Repo 的**負向配置樣本**：模擬 Required workflow paths filter、關閉 npm audit、寫入權限、無 main 部署限制、privileged pull_request_target，要求測試檢出。

這些是**讀取檔案後的靜態測試**，不是向 GitHub 送出權限攻擊或真正故障注入。Actions／Ruleset 仍由 GitHub 平台決定是否實際 enforce。

## 仍缺少／依外部條件才能做的 Gate

| 項目 | 實際證據 | 本包狀態 |
| --- | --- | --- |
| Main Ruleset Live Enforcement | GitHub Settings、API 與不同路徑／狀態的受控 PR | **未重新執行完整平台負向測試** |
| PR 必須有人獨立核准／Review thread resolution | 具權限的獨立 Reviewer、Owner 設定 | **需管理權限／人員**；單人 Repo 不可盲目鎖死 |
| Secrets／Push protection | Repo Settings、授權與測試範圍 | **未知** |
| 身分、Token Hard Cap | 模型服務提供者的硬預算 + 拒絕測試 | **未驗**；離線 JSONL 統計不等於限額 |
| GitHub Actions 完整 supply chain | zizmor 已有，但新外部 Action／依賴授權仍須逐項審核 | **持續工作** |
| 從損壞部署回退 | 正式靜態 artifact 的 SHA、復原流程與目視驗證 | **尚未實際演練** |
| 外部輸入越權／prompt injection | read-only token、隔離沙盒、拒絕工具操作之負向測試 | **尚未具完整證據** |
| 完整 EAG-100 20 controls／5 P0 閘門 | 逐條引用執行紀錄與 Owner signoff | **未完成；不可標示 100 分** |

## 建議操作順序

1. 保持現有 Required Job 名稱不變，新 PR 的 docs-only／site／research 都必須跑出非 Pending 結果；本包在 CI 裡驗證工作流程結構。
2. Owner 若有權限，讀取 Ruleset 最新設定與實際 reviewer 方案。禁止直接啟用無可用 Reviewer 的強制核准。
3. 以**獨立測試 PR**執行可安全回退的負向驗證；有實際 failure evidence 後再改管理配置。
4. 先完成 G0 真機、設計及來源授權，再逐步將實際效能、部署回退和 Agent 權限拒絕證據連回 EAG-100 稽核表。

**安全邊界：** 本包只新增 Node 測試與修正過時的 Astro 版本敘述，不變更 Github workflow、Ruleset、模型配置、金鑰、部署或原始研究。
