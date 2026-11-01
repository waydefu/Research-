# GitHub Rulesets／權限設定建議（需 GitHub 管理權限與明確批准）

**狀態：操作手冊，尚未執行。** Repo 是 private；GitHub 方案不同，Rulesets/Required Review 在私人 Repo 的可用性可能受限。先確認 GitHub 帳戶方案與實際 UI 顯示。

## 基線問題

2026-11-02 GitHub API 回報 `main protected:false`、Repo rulesets `[]`。單純把 YAML 放在 `.github/workflows/` **不會**自動使 CI 成為必過門檻。

## 建議保護方向（實際設定需用 GitHub Settings 操作）

目標：`Settings → Rules → Rulesets → New branch ruleset`（若功能可用）。

| 設定 | 推薦 | 注意 |
| --- | --- | --- |
| Target branch | `main` | 不影響工作分支 |
| Require pull request | 開 | 防止直接修改主分支 |
| Require status checks | CI 實際跑出相同名稱後再開 | 先確認 status check 名稱：`Markdown, JSON and governance integrity` |
| Require conversation resolution | 建議開 | 有 review thread 才有意義 |
| Block force pushes | 開 | 歷史安全 |
| Block deletions | 開 | 避免刪除預設分支 |
| Include administrators | 依風險模型決策 | 管理者 bypass 應記錄 |
| Require CODEOWNERS approval | **先不要開** | 單一 owner 自己不能批准自己的 PR，容易死鎖 |
| Restrict bypass actors | 建議最少且留緊急程序 | 需有實際備援 |

**重要：** 私人 Repo 的 Plan 限制、GitHub App API 權限、哪些 Required Checks 能指定，都須 UI 當場核對。此處沒有使用者授權變更帳號方案或 Repo 權限。

## 啟用後的負向驗證（不能只看畫面）

1. 未經 PR 的 `main` push 是否被 GitHub 阻擋？
2. 新 PR 的 Research Integrity Status 沒跑／FAIL，合併是否被擋？
3. PR 有未解 Review thread 時，合併是否被擋？
4. 不具權限的憑證嘗試改 `.github/` 或 Secrets 是否遭拒？
5. 沒有合格 reviewer 時是否避免造成整個 Repo 無法合併的死鎖？
6. 使用有限測試分支驗證，不做不必要的生產／正式資料操作。

## 停止條件

無權限、方案不支援、CI 未通過或無合格審核者 → 保持原設定、提出人工決策，不以改動 `AGENTS.md` 文字宣稱已保護。

## 給 Repo Owner 的待決事項

- 是否要在支援的方案下啟用 `main` 必經 PR？
- 是否有第二位合格 reviewer 可以做獨立批准？
- 當個人 Repo 無法強制 Ruleset 時，是否可接受「開發自律 + 低信任」的暫時等級，而不宣稱 Enterprise 合格？

這些尚未決策，因此本 PR 不會設定 GitHub Rulesets。