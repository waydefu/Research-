# Research — AI 工程技術研究庫

這是以**可追溯來源、可驗證結論與實際採用評估**為核心的個人研究 Repository。

> 最新研究：**2026-11｜AI Coding 代理工程** — EGM、Claude Code 多模型協作／Advisor、Imagine 視覺化、Jev（JEV）決策路由。

## 可直接放進 Repo 的 Agent 工具（EAG-100 Phase 2）

**[工具清單與啟用條件](docs/governance/REPO-TOOLING.md)**：研究資料專用的離線 SQLite FTS5 搜尋、AGENTS Skills、Copilot 指南、Serena 唯讀專案配置、可選 MCP 範本、CI 安全掃描，以及離線 Agent Token 成本彙總。

- 搜尋：`python3 scripts/research_search.py build` → `python3 scripts/research_search.py search "關鍵字" --limit 5`；變更資料後必須重建索引。
- 安全：Repo-local zizmor CI（需 PR 實際通過才算驗收）。
- 成本：`python3 scripts/agent_usage_audit.py usage.jsonl`（**只做事後核算，不是模型配額強制**）。
- MCP：`.serena/project.yml` 可設定唯讀；`.mcp.json.example` **不會自動安裝或啟動**。

## EAG-100 治理實施（2026-11-02，獨立 PR）

**[研究庫治理中心](docs/governance/README.md)**：已提出唯讀文件完整性 CI、PR／Issue 模板、CODEOWNERS，以及現況風險與 GitHub Rulesets 操作手冊。

- [目前稽核基線](docs/governance/BASELINE-2026-11-02.md)：主分支缺乏保護，P0 有尚未解決的缺口。
- [GitHub 管理設定待決](docs/governance/RULESETS.md)：必經 PR、Required Status Checks，需要 Repo Owner 另行確認並設定。
- [威脅模型](docs/governance/THREAT-MODEL.md) · [回退手冊](docs/governance/OPERATIONS.md)。
- **目前只是工作分支中的提案，尚未合併，也未完成 EAG-100 驗收。**

## 2026 年 11 月：AI Agent 專案治理、搜尋索引與額度最佳化（新研究）

**[完整研究：Agent Repository Operations](research/2026-11-agent-repository-operations/README.md)** — 通用於 GitHub 專案，研究 Agent 治理、資料庫與精確搜尋、MCP、Token 成本、長期記憶、權限、安全、CI、評測和分階段導入。

- [EAG-100｜企業級 Agent 治理 100 分規範（20 項控制＋5 個 P0 閘門）](research/2026-11-agent-repository-operations/EAG-100.md) · [可直接使用的稽核表](research/2026-11-agent-repository-operations/EAG-100-AUDIT-TEMPLATE.md)
- [治理：AGENTS.md、權限、人工批准、PR Gate](research/2026-11-agent-repository-operations/01-governance-and-authority.md)
- [搜尋：rg、ast-grep、Serena、SCIP、Zoekt](research/2026-11-agent-repository-operations/02-search-routing.md)
- [索引：增量同步、來源 SHA、索引新鮮度](research/2026-11-agent-repository-operations/03-index-database-design.md)
- [省額度：Tool Search、Cache、模型路由、硬預算](research/2026-11-agent-repository-operations/04-cost-context-and-routing.md)
- [記憶：Mem0、Cognee、Graphiti、FTS5 與實驗](research/2026-11-agent-repository-operations/05-memory-and-rag.md)
- [Agent 流程：單主控、工具隔離、停止與回退](research/2026-11-agent-repository-operations/06-agent-workflows.md)
- [安全 CI：GitHub gh-aw、Conftest、zizmor](research/2026-11-agent-repository-operations/07-security-and-ci.md)
- [A/B 指標：Recall@k、p95、總 Token、正確率](research/2026-11-agent-repository-operations/08-evaluation-and-benchmarks.md)
- [導入路線：Phase 0–5，必要時才增加資料庫或代理](research/2026-11-agent-repository-operations/09-implementation-roadmap.md)
- [GitHub 開源方案精選](research/2026-11-agent-repository-operations/10-github-project-catalog.md) · [37 項原始來源](research/2026-11-agent-repository-operations/SOURCES.md)

**狀態：** 官方文件與原始碼研究完成；不是已在其他 Repo 進行安裝或效能實測。十月 Codebase Memory MCP 的 freshness 21/21 FAIL 保留為未解驗證 Gate。

## 2026 年 11 月：通用 Web 工程與現代程式技術（新研究）

**[通用 Web 工程完整專題](research/2026-11-universal-web-engine/README.md)** — 不限定小說、AKM 或任何特定網站；涵蓋從 Next.js 到 WebGPU 的完整架構決策。

- [框架比較：Next.js、Nuxt、SvelteKit、Astro、TanStack Start、React Router](research/2026-11-universal-web-engine/01-framework-selection.md)
- [Next.js 16 深入研究與十月安全修補](research/2026-11-universal-web-engine/02-nextjs-deep-dive.md)
- [前端 UI、樣式、狀態、互動](research/2026-11-universal-web-engine/03-frontend-ui-and-state.md)
- [後端／API／資料庫／Auth](research/2026-11-universal-web-engine/04-backend-data-and-auth.md)
- [TypeScript／Node／Vite／Turbopack／DX](research/2026-11-universal-web-engine/05-runtime-build-and-dx.md)
- [WebGPU／3D／資產與相容回退](research/2026-11-universal-web-engine/06-graphics-and-compatibility.md)
- [效能／可及性、CWV、真機測試](research/2026-11-universal-web-engine/07-performance-and-accessibility.md)
- [安全、測試、CI/CD 與部署](research/2026-11-universal-web-engine/08-security-testing-and-deployment.md)
- [三種參考技術棧與遷移方案](research/2026-11-universal-web-engine/09-reference-stacks-and-migration.md)
- [官方來源與證據等級](research/2026-11-universal-web-engine/SOURCES.md)

**狀態：** 官方資料已核對，**尚未跑同條件實機 Benchmarks**，不宣稱任何框架已驗收或被安裝到其他 Repo。

## 2026-11｜世界級 Creative Web：UI/UX × 電影級特效 × 跨端性能（獨立研究分支）

本次是既有 [通用 Web 工程研究](research/2026-11-universal-web-engine/README.md) 的 **10–15 深化篇**，非網站實作：28 件作品（第二輪逐案驗證界線）、70 個 GitHub 候選、18 項核心技術精選，並整理成渲染架構和真正可執行的 PoC 驗收規格。

- [10｜設計工作室與 28 個案例：設計語言、導航與美術規則](research/2026-11-universal-web-engine/10-creative-direction-and-reference-sites.md)
- [11｜WebGL/WebGPU、GLSL/WGSL、PBR、Fluid、Motion 與 Rendering Pipeline](research/2026-11-universal-web-engine/11-motion-graphics-and-rendering.md)
- [12｜70 個 GitHub 開源候選、Top 18 授權／版本／維護／相容調查](research/2026-11-universal-web-engine/12-github-creative-ecosystem.md)
- [13｜Design Tokens、反 AI 模板規範、跨裝置性能、三套 Creative Stack、Top 20 五維分數](research/2026-11-universal-web-engine/13-design-performance-and-architecture.md)
- [14｜十種代表特效：原創偽碼、瓶頸、降級，以及五個 PoC 驗收](research/2026-11-universal-web-engine/14-effects-recipes-and-poc-validation.md)
- [15｜55 個來源條目、證據等級、限制與導入先後順序](research/2026-11-universal-web-engine/15-creative-web-evidence-and-adoption.md)

**證據限制：** 非 28 個站逐頁操作、非跨裝置實機 Benchmark；GitHub API 授權 metadata 不代替 LICENSE 法律審查；無 FPS、Bundle 體積、功耗數據時明確保留 Unknown。**已建立規格，不代表安裝、部署或通過 EAG-100。**

## 2026 年 10 月：有價值的 AI 工程研究精選（新增）

**[開啟十月精選研究目錄](research/2026-10-retrospective/README.md)**

這次整理保留十月聊過的高價值技術、實際 A/B 測試、失敗案例及採用邊界。涵蓋 11 篇主題報告（不含索引）：

- [代理協作、Hermes 治理](research/2026-10-retrospective/01-agent-orchestration.md)
- [MCP／程式碼索引與 Codebase Memory MCP A/B](research/2026-10-retrospective/02-code-intelligence-benchmarks.md)
- [Agent Skills 與工程治理案例](research/2026-10-retrospective/03-agent-skills-and-governance.md)
- [UI/UX Skills：Impeccable、GOATED UI、UI UX Pro Max](research/2026-10-retrospective/04-ui-design-skills.md)
- [Web 動畫、Shader、3D 技術](research/2026-10-retrospective/05-web-motion-3d.md)
- [安全、CI、認證／權限](research/2026-10-retrospective/06-secure-agent-cicd.md)
- [AURORA 音訊 DSP 與 HRTF](research/2026-10-retrospective/07-audio-dsp.md)
- [手機本地 LLM、模型與效能](research/2026-10-retrospective/08-local-llm-models.md)
- [OpenFilm／Remotion／影片自動化](research/2026-10-retrospective/09-video-automation.md)
- [候選工具與排除理由](research/2026-10-retrospective/10-candidate-backlog.md)
- [研究成果實際導入優先順序](research/2026-10-retrospective/11-adoption-roadmap.md)

> 重要：十月的歷史實測與本次查證分開標記。尤其 **Codebase Memory MCP 的 freshness 21/21 FAIL**，不能只憑其它 PASS 就放行正式啟用；候選工具也不表示已安裝或已通過驗收。

## 課程研究｜資訊安全 Ch1–Ch3

- [資訊安全三章摘要、CIA／實體安全／身分鑑別與現代實務查核](research/2026-11-information-security/README.md) — 基於課程 PDF 的整理；NIST/OWASP 的密碼指引另列 [教材與現行建議差異](research/2026-11-information-security/04-textbook-vs-current-practice.md)。原始 PDF 不公開上傳。

## 課程研究｜系統分析與設計 Ch1–Ch3

- [系統分析與設計三章摘要、課程概念對照與來源頁碼](research/2026-11-systems-analysis-design/README.md) — Ch1 資訊系統／SDLC、Ch2 商業個案／可行性、Ch3 專案管理／風險。使用者提供的教材轉述，非外部查證或產業標準；原始 PDF 未公開上傳。

## 研究入口

- [總覽與研究結論](research/2026-11-agent-engineering/README.md)
- [01｜Google Elephant–Goldfish Model（EGM）](research/2026-11-agent-engineering/01-egm.md)
- [02｜Claude Code：主代理、子代理與 Advisor](research/2026-11-agent-engineering/02-claude-code-multi-model.md)
- [03｜Imagine 視覺化方法](research/2026-11-agent-engineering/03-imagine.md)
- [04｜Jev 決策模型與路由](research/2026-11-agent-engineering/04-jev.md)
- [05｜整合方案、效益與限制](research/2026-11-agent-engineering/05-integration.md)
- [06｜社群貼文說法查證表](research/2026-11-agent-engineering/06-claim-check.md)
- [來源索引](research/2026-11-agent-engineering/SOURCES.md)

## 研究紀律

1. 優先使用官方文件、原始程式庫和可重現測試；社群貼文作為線索，不是最終證據。
2. 每項結論註記 **已證實 / 有條件成立 / 尚待驗證 / 不正確**。
3. 分清楚「官方功能」、「第三方插件」、「研究建議」、「已執行的實測」。
4. 不將預估 Token 成本、節省比例、模型品質、相容性當成已測量結果。
5. 研究資料不會自動安裝到其他 Repo，也不會修改本機 Hermes、Claude Code、Codex 設定。

研究建立日期：**2026-11-02（Asia/Taipei）**。技術功能與模型版本會變動，重新採用前請複核來源。

## 更新紀錄

- 2026-11-02：新增十月研究精選（代理／MCP 實測／Skills／UI／安全／音訊／本地 LLM／影片），保留原有十一月專題；未變更任何外部專案。
