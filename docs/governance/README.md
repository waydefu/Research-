# Research-｜治理控制中心

**治理依據：** [EAG-100 v1.0](../../research/2026-11-agent-repository-operations/EAG-100.md)，研究自訂量表，非官方企業認證。

## GitHub 事實（2026-11-02 已查證）

- main branch: protected = true，Repo Ruleset [main-eag-100](https://github.com/waydefu/Research-/rules/26319641) Active，目標 `refs/heads/main`。
- PR 必經、Required Job `Markdown, JSON and governance integrity`、禁止分支刪除及 Force Push 已由 GitHub API 回傳。
- PR #1 已合併，原版 Research Integrity CI 已成功。
- **仍缺乏**：Agent 沙盒、權限提升負向測試、真正模型額度硬上限、不可竄改稽核與回退演練的完整證據，因此不得稱 EAG-100 合格。

## 文件導覽

- [初次稽核基線（歷史快照）](BASELINE-2026-11-02.md)：當時 `main` 未保護，**不是目前狀態**。
- [GitHub Rulesets 操作與管理考量](RULESETS.md)：需持續確認啟用與維護策略。
- [Repo 工具選型／安裝狀態](REPO-TOOLING.md)：Serena MCP、搜尋索引、Skills、CI、安全／額度及未導入選項。
- [威脅模型](THREAT-MODEL.md)：外部輸入、CI、權限與索引。
- [營運與回退手冊](OPERATIONS.md)：故障／事故與復原規範。
- [EAG-100 稽核模板](../../research/2026-11-agent-repository-operations/EAG-100-AUDIT-TEMPLATE.md)：必須有當期證據才能得分。
- [研究完整性腳本](../../scripts/check_repository.py) · [Markdown 全文索引工具](../../scripts/research_search.py) · [Agent 使用量檢視](../../scripts/agent_usage_audit.py)。

## 操作紀律

1. Repo 工具設定不代表其他 Agent 客戶端真的安裝成功；MCP 必須逐宿主單獨驗證。
2. 新增的 GitHub Actions 步驟以 PR 實際 Check 結果為準；CI 通過也不等於安全無漏洞。
3. 保持 GitHub Ruleset／Hermes／外部專案設定不變，除非另行明確授權。
4. 即使 Github 目前已有 Branch Protection，仍需要全面 P0 證據才能完整評分。
