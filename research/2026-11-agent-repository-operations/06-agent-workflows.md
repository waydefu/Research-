# 06｜高效率 Agent Harness：單主控、有限併行、可恢復工作流

## 核心設計

**Agent 能力不等於必須增加 Agent 數量。** 模型越強，過度堆疊 Roles、冗長 Prompt、重複審查可能越浪費；OpenAI 曾專門建議縮短 AGENTS／Skills，並把搜尋路由做成精準按需。  
https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

## 推薦調度

```text
Human Requirement & Authorization
           │
        Main Agent
           │
   ┌───────┴────────┐
   ▼                ▼
Deterministic     Read-only Search
Tools / CI        (no write permission)
   │                │
   └───────┬────────┘
           ▼
   Evidence / Diff Review
           │
   Human Approval Gate
           │
      Merge / Release
```

如宿主支援且**經另外授權**，才可啟用 fresh-context Reviewers、輕量查找代理和隔離 worktrees。多個 Agent 最好處理**彼此獨立**的任務，避免同時編輯同檔與上下文競爭。

## 任務流程（推薦）

- **Locate**：根據 Issue/需求找對應檔案及最小片段。
- **Verify**：查 API 與需求是否有來源，記錄假設和未知。
- **Plan**：跨模組/敏感工作才寫詳細設計，明確範圍。
- **Execute**：限定分支、寫入區域、工具 allowlist。
- **Test**：選擇與受影響模組相符的測試，再跑必要整體關卡。
- **Review**：Diff 與原規格比對，必要時獨立審查（EGM），但不假裝審查完成。
- **Approve / Merge**：合併或部署要按人類批准與 Repo 規則。

## 降低幻覺與重試風暴

- 工具輸出必須帶可驗證的 source ref、版本和錯誤狀態。
- 查不到時回報「unknown」，不從空索引推論不存在。
- 同一錯誤反覆出現時，先檢查測試／環境／假設；不無限重試。
- 單獨的輕量路由器只做**建議**，不能改權限。
- 暫停與恢復必須能從任務紀錄繼續，防止重複寫入或重複部署。

## 與十月 Hermes 的關係

十月後期已訂工作原則：只用 `default`、總並發上限 2、停用子代理工作流、父子不並跑。**本研究沒有修改該設定**；以上是通用架構，不是 Hermes 可直接使用的驗證安裝檔。

將來如果測 Claude Advisor／Goldfish：
- Advisor 擁有主對話背景；Goldfish 必須 fresh context，兩者不是同個審查。
- 若現有宿主不支援真獨立子代理，Goldfish 不得用主代理冒充。
- 若子代理會額外耗費高價模型 Token，必須量測完整成本再決定是否採用。

## 值得看的 Harness 原始碼

- [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent)：極簡 agent loop、可追蹤線性歷史、不同隔離環境；官方 SWE-agent 目前建議優先考慮 mini 版。
- [SWE-agent](https://github.com/SWE-agent/SWE-agent)：具可自訂工具、歷史處理的研究框架。
- [GitHub Agentic Workflows](https://github.com/github/gh-aw)：將推理與實際 GitHub 寫入解耦。
- [OpenAI Codex](https://github.com/openai/codex)：AGENTS 與 Context 管理原則。
- [EGM](https://github.com/google/elephant-goldfish-model)：設計／審查流程。

## 重要不等價

- Worktree ≠ Sandbox，且不能阻止 agent 使用高權限共享 token。
- 多模型分工 ≠ 更省額度的保證。
- Prompt 要求唯讀 ≠ 工具真的唯讀。
- 評測排行榜高 ≠ 目標 Repo 真實場景也優秀。

### 來源
https://github.com/SWE-agent/mini-swe-agent
https://github.com/github/gh-aw
https://github.com/google/elephant-goldfish-model
https://openai.com/index/harness-engineering/
https://github.com/openai/codex