# 07｜Agent 安全、CI 與供應鏈硬閘門

## 2026 值得仔細看：GitHub Agentic Workflows

[github/gh-aw](https://github.com/github/gh-aw) 的設計方向是「Read → Propose → Check → Apply」。Agent 預設在唯讀沙盒運作，寫入由**獨立 Safe Outputs job** 驗證與執行、用範圍受限的權限，輔以憑證隔離、輸入過濾、網路 allowlist、靜態編譯驗證和用量上限。**不能視為零風險或自動取代原有 CI**。

重要版本提醒：官方 README 記載 `>=0.83.3, <0.85.4` 曾有安全問題並撤回；版本必須固定、查公告，禁止盲目採用舊範例。

## 具體防線

| 風險 | 防線 | 工具候選 |
| --- | --- | --- |
| Prompt Injection（Issue/PR/外部網頁/README） | 外部內容當資料、非指令；高權限操作拆獨立 Job | gh-aw、獨立權限 Hook |
| 不受控 Shell/網路 | 工具白名單、最小權限工作空間、網路出口限制 | OS sandbox、gh-aw agent firewall |
| CI 權限升級／惡意 Action | YAML lint + 靜態安全掃描、SHA pin、Protected Branch | [zizmor](https://github.com/zizmorcore/zizmor)、[OpenSSF Scorecard](https://github.com/ossf/scorecard) |
| 規則被繞過 | Policy as Code，拒絕改敏感路徑 | [Conftest](https://github.com/open-policy-agent/conftest) |
| Agent 對抗攻擊 | Prompt injection、越權、資料外傳測試 | [promptfoo](https://github.com/promptfoo/promptfoo) |
| 程式 Bug／回歸 | typecheck / lint / unit / E2E / contract | 既有 CI、Playwright |
| Sensitive memory | index ACL、敏感資料過濾、資料保留／刪除 | repository source boundaries |
| 憑證外流 | token scopes、短效憑證、禁止工具看到原始 token | credential broker、OIDC |

## 不可信內容的危險

[Anthropic 官方安全指南](https://platform.claude.com/docs/en/managed-agents/secure-deployment) 明確將網頁、搜尋結果、GitHub 檔案、MCP 回傳、使用者上傳檔案視為可能不可信輸入。如果代理同時擁有 Bash、寫入工具或 Credentials，需採用最小權限及操作確認。

GitHub Repo 下的 `AGENTS.md`、`CLAUDE.md`、Skills 也可能被植入指示；使用未知 Repo 時不應讓它默默取得更高層權限。

## GitHub Actions 建議 Gate（概念）

```text
Pull Request
 ├── protected paths / CODEOWNERS policy
 ├── version-pinned dependencies and Actions
 ├── typecheck + lint + format
 ├── unit + contract + integration tests
 ├── zizmor + Gitleaks + SCA/SAST
 ├── E2E / smoke / accessibility when relevant
 ├── diff + evidence report
 └── human approval → merge/release (scope-limited token)
```

分支保護、Rulesets、Required Reviews 和部署環境 approvals 應由 GitHub 層面強制。

## 成本與安全如何一起控制

- 每個 Agent run 限定**回合、Token/費用、工具超時、每日額度**；上限需要實際驗證是否 fail closed。
- gh-aw 有 `max-ai-credits`、`max-daily-ai-credits` 與 `max-turns` 等支援；值、預設和幣別以當前文件為準。
- 降低代理權限通常可以避免重大返工成本，但不代表一定會縮短單次執行時間。
- 事故保留 audit trail 和最小必要 trace，不要記錄 Secret/Personal Data 原文。

### 來源
https://github.com/github/gh-aw
https://github.github.com/gh-aw/
https://github.com/zizmorcore/zizmor
https://github.com/open-policy-agent/conftest
https://github.com/ossf/scorecard
https://github.com/promptfoo/promptfoo
https://platform.claude.com/docs/en/managed-agents/secure-deployment