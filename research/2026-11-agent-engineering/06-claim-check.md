# 06｜Threads 社群貼文與 Imagine 截圖：主張核查

**查證日：** 2026-11-02。來源中的功能、模型名稱、方案權限可能變動。社群帖文與截圖由使用者提供，未核實貼文作者身分或「Anthropic 剛分享」說法。

## 1. 多模型貼文

| 原文主張（概意） | 判定 | 證據與限制 |
| --- | --- | --- |
| Claude Code 可以使用 `--advisor opus` | **已證實** | [Claude Code 官方 Advisor 文件](https://code.claude.com/docs/en/advisor) |
| `claude --model sonnet --advisor opus` 會啟動三個 Haiku agent | **不正確** | 這條指令設定主模型與 Advisor；自訂子代理另設 |
| 可以在 `.claude/agents/` 建 `search`／`grep`／`audit` | **已證實（功能）** | [官方子代理文件](https://code.claude.com/docs/en/sub-agents)；這三個名稱是自行定義範例 |
| Haiku 適合唯讀 Repo 搜尋 | **研究建議** | 子代理可指定 `model: haiku` 與 tool 限制；品質／成本需實測 |
| `isolation: worktree` 可以隔離代理 Git 工作樹 | **已證實（有條件）** | [官方 Tips](https://support.claude.com/en/articles/14554000-claude-code-power-user-tips)；不等於權限沙盒 |
| Opus 只在三個時刻介入 | **非硬性行為** | 官方說時機由模型決定，不能保證恰好 3 次 |
| Opus 每次都會替 Diff 簽署 | **未證實** | Advisor 是建議工具，非安全批准或簽章機制 |
| Advisor 不會增加 Token / 一定更便宜 | **不正確／無保證** | 官方說它會產生額外使用量；總成本取決於減少的返工與呼叫 |
| Jev 在毫秒內處理路由，所以整套流程較省 | **未實測** | Jev 是概率式 typed decision；需量測 API 呼叫、延遲與錯誤率 |
| Jev 是 Claude Code 原生功能 | **不正確** | Jev 需要第三方整合，例如 [weiping/jev-claude-code](https://github.com/weiping/jev-claude-code) |
| 這些建議由 Anthropic 官方以貼文中的整套配方發布 | **未證實** | 有些元件有官方文檔，但無法因此證實整篇貼文是官方指南 |

## 2. Imagine 截圖

| 截圖元素 | 判定 | 說明 |
| --- | --- | --- |
| Claude 能生成互動圖表、SVG/HTML 圖解 | **已證實** | Anthropic 官方 Custom Visuals 公告 |
| Imagine 有 `diagram`, `mockup`, `interactive`, `chart`, `art` 模組文字 | **截圖可見** | 不代表它們是對外的獨立插件入口 |
| 純平面、字數限制、雙主題 CSS 變數 | **截圖可見** | 是特定工具的設計規則，非跨平台標準 |
| 任何環境都可以呼叫 `sendPrompt()` | **不正確** | 依特定宿主提供，普通 Web 頁不具備 |
| 可直接把 Imagine 安裝進 GitHub Repo | **未證實** | Claude Custom Visuals 是聊天內功能，未證實通用 SDK |

## 3. EGM 交叉查證

| 說法 | 判定 | 備註 |
| --- | --- | --- |
| EGM 是 Google 帳號下開源專案 | **已證實** | GitHub `google/elephant-goldfish-model` |
| EGM 是新的 AI 基礎模型 | **不正確** | 它是規格驅動開發的工具與代理流程 |
| Goldfish 無子代理也能直接執行 | **不正確** | 官方要求新上下文子代理；缺少時停止 |
| 裝到 Repo 就能保證在 Hermes 自動啟用 | **未證實** | 需確認宿主與專案設定格式 |
| EGM 可直接證明零 Bug / 零偏差 | **不正確** | 人工批准與測試仍不可省略 |

## 4. 研究可信度邊界

- **已證實：** 原始專案／官方文件能明確支持。
- **有條件成立：** 功能存在但依版本、設定、權限、環境。
- **研究建議：** 合理的方案設計，並非官方承諾。
- **未證實：** 缺乏可重現的測試或足夠可靠的來源。
- **不正確：** 與原始文件、可檢查的執行條件明顯衝突。

真正要上線，仍需要實際 CLI 版本、操作日誌與一致的對照實驗。
