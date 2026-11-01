# 01｜Agent 調度、模型分工與治理

**整理：2026-11-02｜十月研究**  
**依據：十月 Hermes 設定討論與工程治理紀錄；不同日期的設定不能混為一談。**

## 研究方向

- **Hermes Agent**：父代理/工作者分工、故障回退、Profile、權限 Hook、工具啟動成本。
- **Opus／Sonnet／Haiku 與 Codex 分工**：高階推理 vs 一般 Coding vs 簡單搜尋／彙整；成本優化不等於平行越多越好。
- **監控與可觀測性候選**：AgentHUD、agent-monitor-hs、abtop、claude-code-dashboard、claude-monitor、cctop — 曾比較用途，個別倉庫及精確功能需再次核對，不當成已安裝。
- **協調器候選**：Puppetmaster、`oh-my-hermes`、`codex_workflow` 等，當時是參考工作流，不是目前的正式執行器。
- **Git/PR 為多代理協作邊界**：單一分支負責人、各自 Diff、CI 檢查、人工核准；研究過 Owner-offline / Work Stealing，但不能因此跳過審批。

## 十月設定演變（避免用早期設定覆蓋較新的決策）

| 時期 | 記錄 | 性質 |
| --- | --- | --- |
| 10/04 左右 | 曾考慮 Codex-only、Sol 父／Luna 子、最多 5 個子代理、深度 1，`coding-swarm` 與多 Profile 仍在實驗 | **歷史方案，不再是目前規則** |
| 10/08 | Serena + Context7 按需、RepoMap 停用，Codebase Memory 限制性候選 | 實驗結論 |
| 10/20 後 | 僅 `default` Profile、總並發上限 2、禁止未授權的子代理工作流；父與子不一起執行 | **後期有效工作規則** |
| 10/27 | 未明確授權不得自行擴大需求、修改與執行 | **工作邊界** |

## 可直接吸收的工程原則

1. **控制面與資料面分離：** LLM 決策是建議；工具 allowlist、權限 Hook、CI 是確定性執行閘門。
2. **Fail closed：** 從便宜模型／輔助工具失敗時，不得悄悄提升為更昂貴、權限更大的模型或操作。
3. **單一主控**：避免多代理同時修改同一檔；輸出最小必要 evidence，採用 PR 审查。
4. **上下文節流**：先精準查找、再擴大閱讀；摘要保留原檔路徑與行號。
5. **觀測**：記錄總 Token、使用費、工具呼叫、耗時、失敗率、隱性 fallback。

## 有價值但仍屬候選的相關概念

- **Tuskira AI Agent Gateway**：自架代理的 MCP／工具存取政策、憑證隔離、可觀測性；十月研究為 PoC 選項，**不是正式部署建議**。
- **Agent Teams／多模型路由器**：正式採用前先用相同任務建立基線。
- **Jev**：小型型別化分支決策，請看 [11 月專題](../2026-11-agent-engineering/04-jev.md)。

## 回到研究庫的用途

適合當「決定新工具要不要裝」的第一層守則。**不要把歷史上曾討論的並行 5 組、子代理解除限制誤寫成現況**。

### 來源

- [Claude Code 子代理官方說明](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Advisor](https://code.claude.com/docs/en/advisor)
- [Anthropic Agent Skills](https://github.com/anthropics/skills)
- [GitHub Actions](https://docs.github.com/en/actions)
