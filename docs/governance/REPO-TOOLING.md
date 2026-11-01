# Repo 可安裝工具選型與第二階段治理實作

**最後查證：2026-11-02（Asia/Taipei）**。本文件區分**已提交且可在 CI 運作**、**Repo 內有設定但需 Agent 宿主／外部工具**、**僅列入候選**。Repository 是研究文件庫，不是程式編譯專案；避免無目的安裝大量 MCP。

## 相容性與實測修正（2026-11-02）

- **Serena 1.5.3：** 專案 YAML 已改用該版本原始碼要求的 `languages: [python]`，而非較新版的 `language_servers`。加入固定版本／設定一致性回歸檢查；**尚未在 Hermes 或 Codex 中實際啟動 MCP**。
- **Token 計數：** 現在所有 JSONL 紀錄都必須提供 `input_token_basis`（`inclusive` 或 `exclusive`）。OpenAI Responses 快取包含在 `input_tokens` 中；Anthropic Messages 的快取讀寫另計。沒有明確語意的舊紀錄會拒絕計算。格式詳見 [Token 計數契約](TOKEN-ACCOUNTING.md)。
- **GitHub CI：** Checkout 由固定 SHA 的 v4.2.2 更新到固定 SHA 的 v5.0.1（Node.js 24）；實際測試結果以 PR Checks 為準。

## 這個 Repo 實際建立了什麼？

| 領域 | 檔案 | 執行狀態與限制 |
| --- | --- | --- |
| 知識搜尋／索引 | [scripts/research_search.py](../../scripts/research_search.py) | **已寫入：** SQLite FTS5 Trigram 索引，僅索引 Git tracked Markdown，繁中/英文子字串、內容 SHA、HEAD 一致性驗證；使用前需執行 build |
| 搜尋負向測試 | [tests/test_research_search.py](../../tests/test_research_search.py) | **已寫入：** stale index、未建索引、索引覆蓋、短字串搜尋與 escaping 的測試 |
| Agent 流程 | [.agents/skills/research-evidence/SKILL.md](../../.agents/skills/research-evidence/SKILL.md) | **已寫入：** Codex 等支援該技能目錄的客戶端可按需讀取；不是 MCP server |
| 治理 Skill | [.agents/skills/research-governance/SKILL.md](../../.agents/skills/research-governance/SKILL.md) | **已寫入：** 以 EAG-100 判斷操作與證據，仍需真正的權限執行環境 |
| GitHub Copilot | [.github/copilot-instructions.md](../../.github/copilot-instructions.md) | **已寫入：** GitHub Copilot 支援 Repo Instructions 的工作模式才會使用 |
| Serena 專案模式 | [.serena/project.yml](../../.serena/project.yml) | **已寫入：** Read-only，僅 Python symbol；不代表 Serena 已在執行 |
| Serena MCP 模板 | [.mcp.json.example](../../.mcp.json.example) | **已寫入：** Opt-in，客戶端實際支援與版本需核對；**不自動啟用** |
| Actions 安全 | [.github/workflows/research-integrity.yml](../../.github/workflows/research-integrity.yml) | **已寫入：** 增加以 SHA 固定的 zizmor-action，關閉 GHAS SARIF 上傳；需 PR CI 成功才可聲稱通過 |
| 成本核算 | [scripts/agent_usage_audit.py](../../scripts/agent_usage_audit.py) | **已寫入：** 離線 JSONL 彙總、未知費用保留 null、超標警告；**非實際模型硬限額** |

這份工具集無需向外部 API 上傳研究內容；只有 opt-in Serena 執行時需取得其套件及對應語言環境。GitHub Actions 會從 GitHub Actions Marketplace 對應上游下載已固定的 action/二進位版本；仍有供應鏈風險，故應固定 SHA 並監控上游安全公告。

## 使用方式（克隆 Repo 後）

### A. 文件搜尋（推薦主力）

\`\`\`bash
python3 scripts/research_search.py build
python3 scripts/research_search.py verify
python3 scripts/research_search.py search "治理" --limit 5
python3 scripts/research_search.py search "Token" --limit 8
\`\`\`

索引存於 \`.cache/research-index.sqlite\`，被 Git 排除，不放雲端、不依賴 embedding、無 Token 費用。每次查詢比較 HEAD、所有追蹤 Markdown 的內容 hash、索引覆蓋數；不一致時**拒絕回傳舊結果**，需明確重建。查詢結果只顯示每檔首個命中片段、路徑、行號與 SHA；**不等於完整 Symbol 或程式呼叫圖**。

SQLite 需內建 FTS5 的 Trigram tokenizer；不支援時回報錯誤並用 \`rg -n\` 等零依賴工具，**不暗中下載套件**。

### B. 成本彙總（真實數據需先取得）

\`\`\`bash
python3 scripts/agent_usage_audit.py my-local-usage.jsonl --warn-above-tokens 100000
\`\`\`

每行是一個 model call，必填 task ID、model、\`input_token_basis\`（inclusive / exclusive）、input/output/cache read/cache write tokens、tool calls、duration、success 與 \`cost_usd\`（未知用 \`null\`）；不需要 prompt、對話或 API Key。**不會攔截 Provider，不能阻止實際訂閱配額超額。** 只適合離線測量與品質成本比。

### C. 可選 Serena MCP（不要當成自動啟用）

1. 本 Repo 已提交 [.serena/project.yml](../../.serena/project.yml)：\`read_only: true\`、\`languages: [python]\`，因為主要資料是 Markdown，Serena 對 Python 腳本的 symbol 查找才有意義。
2. 已提交 [.mcp.json.example](../../.mcp.json.example)，不會自動啟動；**只有在已信任此 Repo、符合安全界線、願意安裝 uv／Python 3.13、客戶端支援 portable \`.mcp.json\` 時**才自行複製為 \`.mcp.json\`。
3. 範例以官方 PyPI package \`serena-agent==1.5.3\` 固定版本，啟動時使用 \`--project-from-cwd\`。如套件版本不存在或客戶端不支援，需改用 Serena 上游正式文件對應版，不能假裝測過。
4. Claude Code、Codex、Hermes、OpenCode／VS Code 的 MCP schema 和信任策略不一致；**不要把一份 JSON 當成所有 Agent 的通用自動安裝器**。
5. 本 Repo 沒有啟用全域 MCP、改寫 Hermes default Profile、安裝 Language Server 或測量 Serena Token 收益。

## 其他類型的頂級 GitHub 專案（依需要分層導入）

| 類別 | 專案 | 是否可 Repo-scoped | 目前採用 |
| --- | --- | --- | --- |
| Code symbol | [Serena](https://github.com/oraios/serena) | 專案配置＋客戶端安裝 | **可選唯讀模板** |
| 版本化文件 | [Context7](https://github.com/upstash/context7) | 支援客戶端設置，部分可 repo-scoped | 後續候選；按需查官方文件 |
| Browser QA | [Playwright MCP](https://github.com/microsoft/playwright-mcp) | MCP client config，可限用途 | 未裝：研究庫不是 Web UI |
| AST 搜尋 | [ast-grep](https://github.com/ast-grep/ast-grep) | CLI/config | 未裝：Python 腳本少，效益有限 |
| 單 Repo 搜尋 | [ripgrep](https://github.com/BurntSushi/ripgrep) | 原生 CLI，不必隨 Repo 打包 | 建議基線 |
| 多 Repo 搜尋 | [Zoekt](https://github.com/sourcegraph/zoekt) | 需另建服務與索引 | 未裝：本 Repo 太小 |
| Symbol Index | [SCIP](https://github.com/scip-code/scip) | Format+Indexers | 未裝：主要 Markdown |
| 向量知識庫 | [Qdrant](https://github.com/qdrant/qdrant) | 需服務／儲存 | 未裝：先驗證本地 FTS5 |
| 時序圖譜 | [Graphiti](https://github.com/getzep/graphiti) | 需圖資料庫＋模型 | 未裝：額外成本高 |
| GitHub Actions SAST | [zizmor](https://github.com/zizmorcore/zizmor) | GitHub Actions action | **已加入本 PR 的 CI** |
| Secrets 檢查 | [TruffleHog](https://github.com/trufflesecurity/trufflehog) | CLI / Action | 候選，先查 private repo 及 CI 計費 |
| 靜態安全規則 | [Semgrep](https://github.com/semgrep/semgrep) | CLI/CI | 未裝：腳本少，需客製 policy |
| Policy-as-code | [Conftest](https://github.com/open-policy-agent/conftest) | CLI/CI | 候選：當 YAML 控制變複雜再導入 |
| 依賴治理 | [Renovate](https://github.com/renovatebot/renovate) | Repo config + GitHub App | 未裝：現況幾乎無依賴 |
| GitHub 依賴審查 | [dependency-review-action](https://github.com/actions/dependency-review-action) | GitHub Actions | 此私人 Repo 需確認 GHAS 授權，**未裝** |
| Observability | [Langfuse](https://github.com/langfuse/langfuse) | Agent／Gateway 另接 SDK | 未裝：此 Repo 無 Agent API Gateway |
| Token Gateway | [LiteLLM](https://github.com/BerriAI/litellm) | 獨立 API Proxy | 未裝；不等同訂閱制額度 |
| Agent 安全工作流 | [gh-aw](https://github.com/github/gh-aw) | Repo Action/配置＋授權 | 候選：需設計 Safe Outputs |
| Evaluation | [promptfoo](https://github.com/promptfoo/promptfoo) | CLI / config | 候選：真正可調用 Agent 才有意義 |

## 相容性與成本決策

- **目前最適合 Research-**：標準庫 FTS5、按需 Skills、Copilot 指南、低權限 CI、固定版本安全掃描、離線 Token 報表。
- **適合有大型程式碼的 Repo**：Serena LSP／ast-grep／SCIP，比 Markdown index 更有意義。
- **適合大量文檔、多 Repo、跨版本複雜檢索**：Zoekt／FTS5＋Vector／Graphiti，但要有實際 Recall@k、index freshness 與總維護成本證據。
- **不推薦整包安裝**：MCP tool schemas、多種 agent、三套索引會疊加模型輸入成本與故障面，可能比原本慢。
- **所有工具候選**只是供評估；採用要通過 EAG-100，保持權限和資料新鮮度邊界。

## 原始來源

- [Serena 專案設定](https://github.com/oraios/serena/blob/main/.serena/project.yml)
- [Serena MCP 啟動參數](https://github.com/oraios/serena/blob/main/docs/02-usage/020_running.md)
- [Serena Server Manifest](https://github.com/oraios/serena/blob/main/server.json)
- [VS Code MCP 配置](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
- [GitHub Copilot Repo Instructions](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide)
- [OpenAI Skills 原理](https://developers.openai.com/plugins/concepts/skills)
- [zizmor-action 官方 Quickstart](https://github.com/zizmorcore/zizmor-action)
- [GitHub dependency-review-action 私有庫限制](https://github.com/actions/dependency-review-action)
- [SQLite FTS5](https://www.sqlite.org/fts5.html)
- [TruffleHog 官方 action](https://github.com/trufflesecurity/trufflehog)

本文件不作 GitHub Repo 以外的安裝、權限／訂閱變更，亦不聲稱在 Hermes、Codex 等宿主實際成功啟動 MCP。
