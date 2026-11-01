# SOURCES｜代理治理／查找／索引／Token 成本研究

**核對日：2026-11-02（Asia/Taipei）**。以專案原始碼與官方文檔為主。下列附連結、用途與採用界線；**存在 GitHub 不代表在指定環境測過或已安裝**。

## 代理治理／Prompt/Context（官方優先）

1. [OpenAI Harness Engineering](https://openai.com/index/harness-engineering/) — 大型 Repo 的文件地圖、規範、工具與測試。
2. [Codex Best Practices](https://learn.chatgpt.com/docs/learn/best-practices) — Goal/Context/Constraints/Done when、AGENTS、Skills。
3. [Codex Source: AGENTS.md](https://github.com/openai/codex/blob/main/AGENTS.md) — 上下文長度與工程規則（會隨版本變動）。
4. [Anthropic：Context 管理](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context) — Tool Search、Programmatic Tool Calling、Cache、Context Editing。
5. [Anthropic：成本優化](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence) — Prompt Cache、token hygiene、有效成本。
6. [Anthropic：CLAUDE.md／Skills／Hooks／Subagents](https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more) — 載入上下文時機、工具管理與授權。
7. [GitHub Agentic Workflows](https://github.com/github/gh-aw) / [安全與成本文檔](https://github.github.com/gh-aw/) — Safe Outputs、Sandbox、寫入和用量限制。
8. [EGM](https://github.com/google/elephant-goldfish-model) — 設計規格／獨立審查；需真正的 fresh-context subagent。
9. [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) — 最小 Agent Harness；不直接代表你 Repo 的可靠性。

## 精準查找／索引

10. [ripgrep](https://github.com/BurntSushi/ripgrep) — 零持久索引的跨平台檔案內容搜尋。
11. [ast-grep](https://github.com/ast-grep/ast-grep) — AST 模式搜尋／重寫。
12. [Serena](https://github.com/oraios/serena) — LSP symbol-level retrieval。
13. [SCIP](https://github.com/scip-code/scip) — Code Intelligence Index Protocol。
14. [scip-typescript](https://github.com/sourcegraph/scip-typescript) — JavaScript/TypeScript 的 SCIP indexer；支援的 Node 版本以專案公告為準。
15. [Zoekt](https://github.com/sourcegraph/zoekt) — Trigram-based cross-repository code search。
16. [Sourcegraph：Precise Code Navigation](https://sourcegraph.com/docs/code-navigation/precise-code-navigation) — SCIP 與動態回退索引的差異。
17. [Aider Repo Map](https://aider.chat/docs/repomap.html) — Token budget、依圖排序相關符號；讀策略不等於原生整合。
18. [Repomix](https://github.com/yamadashy/repomix) / [Token Count Tree](https://repomix.com/guide/usage) — Repo 打包、Token 熱點與 Secret 掃描需求。
19. [Codebase Memory MCP](https://github.com/DeusData/codebase-memory-mcp) — 圖譜、背景索引、跨檔追蹤；自家性能宣稱須與 2026-10 舊測試分開。

## 知識與長期記憶

20. [SQLite FTS5](https://www.sqlite.org/fts5.html) — 低維運的全文檢索。
21. [Qdrant Hybrid Queries](https://qdrant.tech/documentation/hybrid-queries/) — Dense／Sparse／BM25 等查詢組合。
22. [Mem0](https://github.com/mem0ai/mem0) — 代理記憶系統。
23. [Cognee](https://github.com/topoteretes/cognee) — GraphRAG／文件與本地小模型。
24. [Graphiti](https://github.com/getzep/graphiti) — 時序、溯源、增量知識圖譜。
25. [Letta Code](https://github.com/letta-ai/letta-code) — Agent Memory/MemFS。
26. [Datapace Memory Benchmark](https://github.com/datapace-ai/agent-memory-benchmark) — 2026-09 pilot：10 問題／一 seed；**不能概括成通用冠軍**。
27. [Agent Memory Bench](https://github.com/hamza-dev-tech/agent-memory-bench) — 419 turns／120 probes；評測設計不同，不可和 vendor 宣傳直接相減。

## 額度、Observability、安全與評測

28. [LiteLLM](https://github.com/BerriAI/litellm) / [Budget Docs](https://docs.litellm.ai/docs/proxy/users) — 額度／虛擬 Key／率限制；**缺必要 DB 可能 fail open**。
29. [Langfuse](https://github.com/langfuse/langfuse) — LLM/Agent Tracing、Eval、Prompt 管理。
30. [Helicone](https://github.com/Helicone/helicone) — Gateway/Telemetry 替代／組合選項。
31. [OpenTelemetry](https://opentelemetry.io/docs/) — Trace 規格與觀測。
32. [zizmor](https://github.com/zizmorcore/zizmor) — GitHub Actions 安全檢查。
33. [Conftest](https://github.com/open-policy-agent/conftest) — Policy-as-Code。
34. [OpenSSF Scorecard](https://github.com/ossf/scorecard) — 供應鏈安全評比。
35. [promptfoo](https://github.com/promptfoo/promptfoo) — Prompt Injection／Agent Red Team。
36. [Inspect AI](https://inspect.aisi.org.uk/) / [Original Repo](https://github.com/UKGovernmentBEIS/inspect_ai) — 模型與 Agent 評測。
37. [Anthropic Managed Agent 安全](https://platform.claude.com/docs/en/managed-agents/secure-deployment) — 將 GitHub 文件、MCP 結果、外部資料視作不可信輸入。

## 研究限制與已知反例

- 沒有把所有 GitHub 專案逐一安裝，也沒有在同一硬體和模型上做 Benchmark。
- 供應商提供的 token-saving、latency、Recall 或 SWE-bench 數值僅代表該來源宣稱的實驗條件，不等於個人環境的預期收益。
- [十月歷史 A/B](../2026-10-retrospective/02-code-intelligence-benchmarks.md) 曾錄到 Codebase Memory MCP 21/21 freshness FAIL；本次檢視上游功能不等於證明已修。
- 測試資料庫的時間與 branch、權限隔離及工作樹狀態，不可以從語意索引的「找到答案」反推出真實一致性。
- 資安工具未檢查到問題 ≠ 0 風險；限制寫入權限與人工批准始終必要。
