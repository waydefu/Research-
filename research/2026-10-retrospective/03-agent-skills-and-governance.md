# 03｜Agent Skills、專案治理與可重用知識

**價值：高**。Skills 適合累積工作程序，但文件不能取代工具權限控制、CI 或人工驗收。

## 重點

- [Agent Skills 開放規格](https://agentskills.io/)：可分層載入 `SKILL.md`、工具腳本、參考文件。
- [Anthropic Skills 官方範例](https://github.com/anthropics/skills)：示範資料格式與案例；**範例功能不等於所有宿主都能原樣使用**。
- `AGENTS.md`：Repo 層工作規範與範圍、驗收命令；不放易過期的技能大全。
- **權限與工具約束應由確定性程式執行**，不可只靠 Prompt 文案宣告「禁止」。

## 十月真實案例：2026novel 的 Skill 縮減與治理

十月對話／GitHub 審核紀錄：
- PR #7：`AGENTS.md` 約 573 → 190 行；工具包括 `canon_contract.py`、`prose_lexicon.py`、`prose_rhythm.py`、`style_profile.py`、`check_rule_budget.py`、`write_provenance.py`，約 **64** 條 eval 案例。
- PR #8：修復 Skill 路徑與 discovery 問題；標準化到 `.agents/skills/`，**9/9 Skill schema** 有效、約 **82** 條 eval 案例；既有 CI 曾核實通過。
- 仍未完成：真正代理如何選取 Skill 的 end-to-end、blind read 等行為驗證；不能以 schema PASS 取代真實代理測試。

> 以上是十月工作紀錄，並非本次重新驗證 GitHub PR HEAD。需要準確 commit／內容時，應重新檢查原始 Repo。

## 有用的執行模式

| 層級 | 放什麼 | 不放什麼 |
| --- | --- | --- |
| `AGENTS.md` | 不可違反的 Repo 邊界、驗收命令、授權條件 | 長篇工具百科 |
| `skills/*/SKILL.md` | 一類任務的可重複程序與觸發時機 | 包山包海的萬用大 Prompt |
| `docs/` | 架構證據、ADR、資料來源和作業說明 | 沒來源的「已驗證」說法 |
| CI／權限 Hook | 不可由 LLM 自行解除的閘門 | 模型自述的安全承諾 |

## 值得新增測試的地方

- 禁止低品質 Skill metadata；檢查路徑規格及名稱衝突。
- 防止 rename/delete 繞過路徑檢查；「無資料」要判定為 unknown 而不是 PASS。
- 審核腳本是否真的有權限做修改；標記每次執行所需批准。
- 效果用「正確 Skill 選取率、錯誤率、Token、返工」來驗收。

### 來源

- [Anthropic Skills](https://github.com/anthropics/skills)
- [Agent Skills 開放規格](https://agentskills.io/)
- [2026novel](https://github.com/waydefu/2026novel)
- [GitHub Actions](https://docs.github.com/en/actions)
