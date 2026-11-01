# 01｜GitHub 專案的 Agent 治理與授權設計

## 治理的目的

避免 AI Agent 在不知道上下文的情況下，隨意增加功能、刪除資料、修改權限、重寫架構、觸發部署或產生不可驗證的完成聲明。更少的返工通常比多一個代理更划算。

OpenAI 在 [Harness Engineering](https://openai.com/index/harness-engineering/) 提出「給代理專案地圖，而不是一千頁說明書」；[Codex 最佳實務](https://learn.chatgpt.com/docs/learn/best-practices) 推薦清楚區分 Goal／Context／Constraints／Done when，並將 AGENTS.md 保持簡潔與可查找。

## 推薦 Repo 結構（概念，非必須複製）

```text
repo/
├── AGENTS.md                     # 一頁內的權限、定位、測試命令
├── docs/
│   ├── ARCHITECTURE.md            # 可驗證架構入口
│   ├── decisions/                 # ADR／已批准與撤回決策
│   ├── runbooks/                  # 發布、回退、事故應變
│   ├── designs/                   # 規格與驗收條件
│   └── INDEX.md                   # 語義路由（指向文件，不全文注入）
├── .github/
│   ├── CODEOWNERS                 # 責任歸屬
│   ├── pull_request_template.md
│   └── workflows/                 # 明確 CI / policy gates
├── src/   tests/
└── .agents/skills/                # 只有通過審查才放入的任務技能
```

**主 AGENTS.md 不應寫成百科全書。** 只保存不變的安全邊界、核心導航、標準命令。細節放子目錄的 instructions / skills / docs。

## 權限矩陣（建議的預設）

| 動作 | 搜尋代理 | 主程式代理 | CI | 人類批准 |
| --- | --- | --- | --- | --- |
| 讀既有可信程式碼／文件 | 在授權範圍內 | 在授權範圍內 | 只讀工作副本 | 不必逐次 |
| 讀外部網站／陌生 PR | 視作**不可信資料** | 視作**不可信資料** | 限制網路 | 按風險 |
| 編輯工作分支的已核准範圍 | 禁止 | 按任務授權 | 禁止代碼改寫 | 風險高時需要 |
| 改認證、Secret、治理政策、CI | 禁止 | 預設阻擋 | 只檢查 | **明確批准** |
| 合併、Release、Production Deploy | 禁止 | 預設阻擋 | 提供證據 | **明確批准** |
| 大量刪除、資料庫 Migration | 禁止 | 預設阻擋 | 模擬／測試 | **明確批准** |

**Prompt 不等於權限。** 真正要在工具 allowlist、作業系統權限、GitHub token scopes、Branch Protections、policy-as-code 執行阻擋；所謂唯讀代理必須連工具／掛載都唯讀。

## 工作規則與任務狀態

`Requested → Scoped → Researched → Plan Reviewed → Implementation → Tests → PR Review → Approved → Merged`；任一階段未證明完成則停在該階段。

- **Issue/任務模板**：目標、涉及檔案、不可修改區、參考來源、完成條件、失敗回退。
- **Design Review**：架構或敏感變更先規格再獨立審查（可參考 EGM，非必要每次都跑）。
- **PR**：只描述實際執行的檢查及結果；附 diff、失敗案例與未解風險。
- **CI 綠燈**：僅證明現有檢查通過，並非零漏洞。
- **防止大 PR**：分階段可回退的 coherent change，比一次重寫所有檔案更易 review。

## 供應鏈與文件治理

- 使用固定版本的第三方 GitHub Actions／Skills／套件；陌生 installer 不直接執行。
- 文件必須有 owner、last_verified、source_commit 或發布日期，避免過期架構圖誤導 Agent。
- Agent 對陌生 Repo 的 AGENTS/CLAUDE/SKILL 檔案要當成風險輸入；不能授權其覆蓋原本更高層指令。
- 由 CI 對路徑／受保護檔案做確定性改動檢查，不接受 AI 自我宣告已守規範。

### 來源
- https://openai.com/index/harness-engineering/
- https://learn.chatgpt.com/docs/learn/best-practices
- https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more
- https://github.com/github/gh-aw
- https://github.com/open-policy-agent/conftest