# Research— ｜ AI 工程技術研究庫

以**可追溯來源、可驗證結論與實際採用評估**為核心的個人研究庫，並附帶公開網站 **THE OBSERVATORY**：把這些研究整理成繁體中文、可搜尋、保留原始出處的閱讀體驗。

- 🌐 網站：<https://waydefu.github.io/Research-/>（首頁 Sanctum；典藏館 `/v3/library/`；全文搜尋 `/v3/search/`）
- 📍 目前進度與未解事項：[site/CURRENT-STATUS.md](site/CURRENT-STATUS.md)
- 📚 所有說明文件的狀態分類：[site/DOCS-INDEX.md](site/DOCS-INDEX.md)

> 本庫**公開**。研究是證據整理，不是安裝指引：文件提到某工具，不代表本庫已安裝、啟用或通過驗收。

## 從哪裡開始

| 我想… | 去這裡 |
| --- | --- |
| 讀研究內容 | 從下方[研究主題](#研究主題)選一個，或到網站的典藏館 |
| 搜尋某個關鍵字 | 網站全文搜尋，或本地 `python3 scripts/research_search.py build` 後 `search "關鍵字" --limit 5`（資料變更後必須重建索引） |
| 新增一篇研究 | [site/RESEARCH-CURATION.md](site/RESEARCH-CURATION.md) 的「新增研究 PR｜必過收錄流程」 |
| 修改網站 | [site/README.md](site/README.md) → [site/REPO-MAP.md](site/REPO-MAP.md) |
| 了解 Agent 該遵守什麼 | [AGENTS.md](AGENTS.md)、[site/AGENTS.md](site/AGENTS.md) |
| 看治理與風險 | [docs/governance/README.md](docs/governance/README.md) |

## 研究主題

| 主題 | 入口 | 內容與證據界線 |
| --- | --- | --- |
| **AI Coding 代理工程**（2026-11） | [總覽](research/2026-11-agent-engineering/README.md)、[EGM](research/2026-11-agent-engineering/01-egm.md)、[Claude Code 多模型／Advisor](research/2026-11-agent-engineering/02-claude-code-multi-model.md)、[Imagine](research/2026-11-agent-engineering/03-imagine.md)、[Jev 決策路由](research/2026-11-agent-engineering/04-jev.md)、[整合方案](research/2026-11-agent-engineering/05-integration.md)、[說法查證表](research/2026-11-agent-engineering/06-claim-check.md)、[Music Skill 可編輯代理作曲](research/2026-11-agent-engineering/07-music-skill-editable-agent-composition.md) | 官方資料與社群說法分開標記；Token 節省、模型品質為預估，非實測 |
| **Agent Repository Operations**（2026-11） | [完整研究](research/2026-11-agent-repository-operations/README.md)、[EAG-100 治理規範](research/2026-11-agent-repository-operations/EAG-100.md)、[稽核表](research/2026-11-agent-repository-operations/EAG-100-AUDIT-TEMPLATE.md)、[來源](research/2026-11-agent-repository-operations/SOURCES.md) | 治理、搜尋路由、索引、省額度、記憶、流程、安全 CI、評測與導入路線。官方文件與原始碼研究完成；**不是**在其他 Repo 的安裝或效能實測 |
| **Local AI Inference／超大型 MoE**（2026-11） | [技術庫](research/2026-11-local-ai-inference/README.md)、[Colibri 分層推論](research/2026-11-local-ai-inference/01-colibri-moe-streaming.md) | 已核對 v2.1.0、授權與上游 benchmark；**「resident 9.9GB」不等於 744B 模型只需 9.9GB RAM**；本庫未安裝、未下載模型、未重跑測試 |
| **通用 Web 工程與 Creative Web**（2026-11） | [專題](research/2026-11-universal-web-engine/README.md)、[框架比較](research/2026-11-universal-web-engine/01-framework-selection.md)、[創意方向與 28 案例](research/2026-11-universal-web-engine/10-creative-direction-and-reference-sites.md)、[渲染天花板驗收](research/2026-11-universal-web-engine/29-rendering-ceiling-benchmark-and-adoption-gates.md)、[繁中字體排版](research/2026-11-universal-web-engine/35-ui-typography-readability-and-cjk.md)、[來源](research/2026-11-universal-web-engine/SOURCES.md) | 35 篇，涵蓋框架、前後端、WebGPU／Three.js、效能與可及性、案例研究。官方資料已核對，**尚未跑同條件實機 benchmark**；GitHub 授權 metadata 不代替 LICENSE 法律審查 |
| **2026-10 精選回顧** | [目錄](research/2026-10-retrospective/README.md) | 11 篇：代理協作、MCP 與程式碼索引 A/B、Skills、UI Skills、動畫／3D、安全 CI、音訊 DSP、本機 LLM、影片自動化、候選工具、導入優先序。**Codebase Memory MCP 的 freshness 21/21 FAIL 是未解的驗證 Gate** |
| **資訊系統工程** | [系統分析與設計](research/2026-11-systems-analysis-design/README.md) | SDLC、商業可行性、WBS、排程與風險 |
| **資訊安全** | [原則、實體保護與數位身分](research/2026-11-information-security/README.md) | CIA、威脅分析、資料復原、身分驗證與安全指引；原始參考 PDF 不在公開 Repo 散布 |

## 研究紀律

1. **來源優先**：官方文件、原始碼、可重現測試優先；社群貼文只是線索。
2. **結論分級**：已證實／有條件成立／尚待驗證／不正確。分清「官方功能」「第三方插件」「研究建議」「已執行的實測」。
3. **不把預估當量測**：Token 成本、節省比例、模型品質、FPS、相容性在沒有實測時一律標未知。
4. **原始檔不可變**：`research/` 底下的原始研究不改動；網站的導讀、標題與圖片是獨立的編輯層。
5. **不自動外溢**：研究不會自動安裝到其他 Repo，也不會修改本機的 Hermes、Claude Code、Codex 設定。

## 本庫的 Agent 工具與治理

- **工具清單與啟用條件**：[docs/governance/REPO-TOOLING.md](docs/governance/REPO-TOOLING.md) — 離線 SQLite FTS5 搜尋、AGENTS Skills、Copilot 指南、Serena 唯讀設定、可選 MCP 範本、CI 安全掃描、離線 Token 成本彙總。
- **治理**：[EAG-100](research/2026-11-agent-repository-operations/EAG-100.md) 是自訂研究量表，**不是官方企業認證**；整體驗收尚未完成。[Rulesets 手冊](docs/governance/RULESETS.md)、[威脅模型](docs/governance/THREAT-MODEL.md)、[回退手冊](docs/governance/OPERATIONS.md)。
- **成本核算**：`python3 scripts/agent_usage_audit.py usage.jsonl`——只做事後核算，**不是模型配額強制**。
- **MCP**：`.mcp.json.example` 不會自動安裝或啟動；`.serena/project.yml` 可設定為唯讀。
- **CI**：`Research integrity`（文件完整性、全文索引、zizmor、網站建置與 e2e）與 `Publish Research Showcase`（單一 Pages 站點）；以 PR 實際結果為準。

## 本地驗證

```sh
python3 scripts/check_repository.py                      # Markdown 連結、JSON、EAG 控制、文件索引
python3 -m unittest discover -s tests -p 'test_*.py'
cd site && npm ci && npm run check && npm run build && npm run provenance && npm run e2e
```

## 更新紀錄

- 2026-11-06：重整本檔結構（依用途而非日期排列），所有原有研究入口保留；新增文件狀態索引與現況快照；即時 3D 觀測所美術統一。
- 2026-11-02：新增十月研究精選（代理／MCP 實測／Skills／UI／安全／音訊／本地 LLM／影片），保留原有十一月專題；未變更任何外部專案。

研究建立日期：**2026-11-02（Asia/Taipei）**。技術功能與模型版本會變動，重新採用前請複核來源。
