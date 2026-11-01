# Research — AI 工程技術研究庫

這是以**可追溯來源、可驗證結論與實際採用評估**為核心的個人研究 Repository。

> 最新研究：**2026-11｜AI Coding 代理工程** — EGM、Claude Code 多模型協作／Advisor、Imagine 視覺化、Jev（JEV）決策路由。

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
