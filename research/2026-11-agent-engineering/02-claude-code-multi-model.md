# 02｜Claude Code 多模型分工與 Advisor

**來源優先級：** Anthropic Claude Code 官方文件 > 版本化說明 > 社群貼文。  
**狀態：** 官方功能已核對；沒有在目標帳號／Hermes 主機實測。

## 1. 社群架構的精確解讀

設計構想：
- **Sonnet 主代理：** 一般閱讀、規劃、編輯與整合。
- **Haiku 子代理：** 對 Repo 做受限搜尋、定位呼叫點、初步 Diff 審查。
- **Opus Advisor：** 需要更強推理的關鍵時刻供主代理諮詢。

這是**工作劃分策略**，不是一條命令自動安裝三種代理。

## 2. Advisor

官方支援在相容的 Claude Code 版本與環境使用：

```sh
claude --model sonnet --advisor opus
```

亦可透過 `/advisor` 或 `advisorModel` 設定。注意：
- Advisor **仍屬實驗性功能**，依模型配對、服務商／帳號限制而定。
- 由 Claude 決定何時諮詢；「規劃前、重複出錯、結束前」屬建議時機，不是硬性恰好三次。
- 官方描述 Advisor 會收到完整對話（含工具呼叫與結果）；因此不能當成新上下文的 Goldfish。
- 每次 Advisor 重新讀取對話會產生額外計費／用量；不能保證節省 Token。
- 官方文件所述的上下文不代表所有版本絕對無缺漏；若審查結果重要，仍需核對日誌和原始 Diff。

## 3. 子代理

Claude Code 官方支援在 `.claude/agents/` 放置含 YAML frontmatter 的 Markdown 自訂代理。可用 `model: haiku` 指派模型，限制 tools 和 permissions，也可以設定 `isolation: worktree`。

下列為**研究用示意**，不是已安裝設定：

```yaml
---
name: repo-search
description: Read-only repository inventory and evidence summary
model: haiku
tools: Read, Grep, Glob
---
```

對於 audit 類工作可評估 `isolation: worktree`，但 **worktree 是 Git 工作目錄隔離，不等於獨立 OS 沙盒或無權修改資料**；必須配合明確的唯讀工具與權限規則。

子代理保留自己的上下文，因此主上下文可以較乾淨；但子代理執行仍消耗使用量，不是免費並行。

## 4. 高風險誤讀

| 貼文主張 | 準確說法 |
| --- | --- |
| 一行指令就有 Sonnet + Haiku ×3 + Opus | 只會設定主模型及 Advisor；Haiku 子代理需要額外定義或調度 |
| Opus 永遠只被呼叫三次 | 無此硬上限保證，時機由模型決定 |
| Opus 簽署全部 Diff | 不應視為保證；檢視 Diff 與測試需明確流程 |
| Haiku 審查與 worktree 讓工作分支絕對不受影響 | 只在具體權限／工作樹設置正確時成立；需確認實際工具範圍 |
| 一定更省成本 | 須依使用量和返工率對照基線 |

## 5. 成本驗證方法

做至少 3 類相同輸入難度的任務，分別跑：
- A：Sonnet 單代理；
- B：Sonnet + 指定 Haiku 子代理；
- C：Sonnet + Haiku + Opus Advisor。

每組記錄：任務成功率、人工修正數、input/output/cache tokens、Advisor 呼叫次數、子代理次數、耗時和總成本。同時保留前後 Diff。沒有這些資料不應稱「節省 x%」。

## 來源

- [Claude Code：Advisor](https://code.claude.com/docs/en/advisor)
- [Claude Code：Subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Help：Power-user tips / worktrees](https://support.claude.com/en/articles/14554000-claude-code-power-user-tips)
