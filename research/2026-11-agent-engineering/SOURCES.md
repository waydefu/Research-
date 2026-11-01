# 原始來源索引

**核對日：2026-11-02（Asia/Taipei）。** 以下是後續更新時應優先重查的來源。請以網頁當下最新版與對應的 commit / tag 為準。

## A. EGM（原始專案／官方文件）

1. [Google EGM：GitHub](https://github.com/google/elephant-goldfish-model) — 插件身份、Skills、安裝與限制。
2. [EGM 官方首頁](https://egm.dev/) — 官方介紹與入口。
3. [EGM Getting Started](https://github.com/google/elephant-goldfish-model/blob/main/docs/getting_started.md) — 使用流程。
4. [EGM Harnesses](https://github.com/google/elephant-goldfish-model/blob/main/docs/harnesses.md) — 各宿主整合、subagent 限制。
5. [EGM Codex 指引](https://github.com/google/elephant-goldfish-model/blob/main/docs/codex.md) — 安裝、根目錄、驗證及環境差異。
6. [EGM TESTING](https://github.com/google/elephant-goldfish-model/blob/main/TESTING.md) — 單元測試與端到端測試差異。

## B. Anthropic Claude Code（官方）

7. [Claude Code Advisor](https://code.claude.com/docs/en/advisor) — 實驗性、設定、呼叫行為、限制。
8. [Claude Code 子代理](https://code.claude.com/docs/en/sub-agents) — agents 目錄、模型指定、工具與權限。
9. [Claude Code Power-user tips](https://support.claude.com/en/articles/14554000-claude-code-power-user-tips) — Worktree 與自訂 agents。
10. [Claude API Advisor Tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool) — 原始 API 設計與使用建議。

## C. Imagine / Custom Visuals

11. [Anthropic：Claude builds interactive visuals](https://claude.com/resources/articles/claude-builds-visuals) — 官方產品介紹。
12. [Claude Help：Custom visuals in chat and Cowork](https://support.claude.com/en/articles/13979539-custom-visuals-in-chat-and-cowork) — 功能、限制、適用環境。
13. [Claude Help：Can Claude produce images?](https://support.claude.com/en/articles/9002504-can-claude-produce-images) — SVG/HTML 圖解與影像生成的差別。
14. [Imagine 設計指令公開轉載](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/visualize.md) — **非 Anthropic 官方公開說明；僅用來比對截圖中的詞句，不作為官方保證**。

## D. Jev / 社群整合

15. [Jev AI typed decision 介紹](https://github.com/jev-ai/typesafe-ai-jev) — 產品概念與 typed decision。
16. [TypeSafe 官方文件](https://docs.typesafe.ai/) — 實際模型和 API 最終以此為準。
17. [weiping/jev-claude-code](https://github.com/weiping/jev-claude-code) — 非官方 Claude Code 整合、shadow mode 與 hook。
18. [TypeSafeAI/jev-harness](https://github.com/TypeSafeAI/jev-harness) — 社群測試與路由範例，不能代表官方效能。

## E. 既有專案實例（研究關聯）

19. [waydefu/delta](https://github.com/waydefu/delta) — AKM 改槍網站研究原型。
20. [DELTA LAB EGM 專案整合 PR #15](https://github.com/waydefu/delta/pull/15) — 先前提交的 Repo 級設定實例；**不構成本機 EGM 驗收成功**。

## 來源等級

- **原始 / 官方**：A、B，以及 C11–13。
- **社群 / 轉載**：C14、D17–18。
- **專案原始但不是供應商正式保證**：D15。
- **使用者既有工程範例**：E。

任何快速變動的模型名稱、版本、價錢或工具旗標都需在實際安裝當日重新確認。
