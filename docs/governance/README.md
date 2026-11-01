# Research-｜治理控制中心

**治理依據：** [EAG-100 v1.0](../../research/2026-11-agent-repository-operations/EAG-100.md)。這是自訂治理量表，不是正式第三方認證。治理文件及 CI 提案**不等同 GitHub Ruleset 已生效**。

## 文件

- [初次稽核基線（2026-11-02）](BASELINE-2026-11-02.md)：實際查看到的安全缺口、P0 狀態及證據不足之處。
- [GitHub Rulesets 建議](RULESETS.md)：需要管理權限／人類確認的操作，不會自動執行。
- [威脅模型](THREAT-MODEL.md)：Repo、Agent、CI、索引與資料邊界。
- [營運與回退手冊](OPERATIONS.md)：錯誤來源、更正、停止與復原方式。
- [EAG-100 稽核模板](../../research/2026-11-agent-repository-operations/EAG-100-AUDIT-TEMPLATE.md)：逐項補齊證據。
- [研究完整性腳本](../../scripts/check_repository.py)：僅標準庫，離線驗證 Markdown/JSON/量表一致性。

## 工作順序

1. 研究治理基線，不冒充完成驗收。
2. 在工作分支開 PR，檢查唯讀 CI 的實際結果。
3. 需要的話，經授權另行設定 GitHub Ruleset（本 Repo 尚未強制）。
4. 每次權限或 CI 變更後重新驗證 P0。
5. 所有 EAG 得分須提供控制項對應的實際證據與負向測試。

**現況（此 PR）：** 已提議建立基本治理 CI，不能因此宣稱 EAG-100 滿分；GitHub Settings、Hermes、Codex 與其他 Repo 都沒有被更動。
