# 10｜值得研究的 GitHub 開源專案清單（經原始來源核對）

**日期：2026-11-02；排名按解決問題的效益，不是 Star 排行。** 不同專案授權／維護速度可能變動，正式導入前核對 Security Advisory、最新 Release 和 License。

## A｜基礎治理／Context（第一梯隊）

| Repo | 核心價值 | 採用建議 |
| --- | --- | --- |
| [openai/codex](https://github.com/openai/codex) | 高品質 AGENTS / Context 管理工程慣例 | **讀架構和指令規範** |
| [github/gh-aw](https://github.com/github/gh-aw) | AI 推理與受控 GitHub 寫入分離、額度閘門 | **高；但需維護及權限審核** |
| [google/elephant-goldfish-model](https://github.com/google/elephant-goldfish-model) | 規格與 fresh-context 設計審查 | **有獨立子代理時才跑完整 Review** |
| [anthropics/skills](https://github.com/anthropics/skills) | Skills 分層、按需載入的可重用專業流程 | **高；不要裝整包** |
| [open-policy-agent/conftest](https://github.com/open-policy-agent/conftest) | 用 Rego 對治理配置做確定性測試 | **高，用於受保護設定** |

## B｜查找與索引（最高性價比）

| Repo | 核心價值 | 採用建議 |
| --- | --- | --- |
| [BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep) | 快速全文、錯誤和路徑查找 | **最高：零持久索引** |
| [ast-grep/ast-grep](https://github.com/ast-grep/ast-grep) | AST 結構匹配與規則修正 | **極高：特定結構任務** |
| [oraios/serena](https://github.com/oraios/serena) | LSP、Symbol 與 references 查詢 | **高：需管啟動成本、可唯讀** |
| [sourcegraph/zoekt](https://github.com/sourcegraph/zoekt) | Trigram 跨多 Repo 高速搜尋 | **多 Repo 才用** |
| [scip-code/scip](https://github.com/scip-code/scip) | 精確 Symbol 記錄格式 | **需要呼叫關係時候選** |
| [sourcegraph/scip-typescript](https://github.com/sourcegraph/scip-typescript) | TS/JS SCIP indexer | **需核對 Node 版本與建索引記憶體** |
| [Aider-AI/aider](https://github.com/Aider-AI/aider) | Token budget 的 Repository Map | **優先借鑑方法** |
| [repomix/repomix](https://github.com/yamadashy/repomix) | 限定檔案打包與 Token Tree | **一次性檢視；不可每次全量注入** |
| [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) | Code graph + 索引 + 檢索工具 | **維持限制性候選，須重測 freshness** |

## C｜長期記憶／RAG（不是越複雜越好）

| Repo | 核心價值 | 採用建議 |
| --- | --- | --- |
| [mem0ai/mem0](https://github.com/mem0ai/mem0) | Agent 跨會話記憶與檢索 | **必須和 file search 基線比較** |
| [topoteretes/cognee](https://github.com/topoteretes/cognee) | Graph+Vector+Docs，支援本地小模型 | **有跨系統知識需求再試** |
| [getzep/graphiti](https://github.com/getzep/graphiti) | 時序有效性與來源鏈 | **多跳／歷史沿革場景** |
| [letta-ai/letta-code](https://github.com/letta-ai/letta-code) | MemFS / Agent memory | **需留意 Agent Runtime 依賴** |
| [qdrant/qdrant](https://github.com/qdrant/qdrant) | Dense / Sparse / BM25 Hybrid Search | **大量非精確語意檢索** |
| [lancedb/lancedb](https://github.com/lancedb/lancedb) | 嵌入式及向量／全文檢索 | **與 Qdrant / pgvector 擇一** |

## D｜Cost / Telemetry / Evals

| Repo | 核心價值 | 採用建議 |
| --- | --- | --- |
| [BerriAI/litellm](https://github.com/BerriAI/litellm) | 多 Provider 轉接、模型與預算路由 | **只在 API Gateway 必要時** |
| [langfuse/langfuse](https://github.com/langfuse/langfuse) | LLM Trace、Evals、Prompt/成本管理 | **有追蹤需求時** |
| [Helicone/helicone](https://github.com/Helicone/helicone) | Gateway、Trace、成本與回退 | **Langfuse / LiteLLM 的部分替代，勿重複裝** |
| [SWE-agent/mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) | 最小可重現 Coding Agent Harness | **適合研究 Agent 架構** |
| [UKGovernmentBEIS/inspect_ai](https://github.com/UKGovernmentBEIS/inspect_ai) | 可重用的 Agent Evaluation Framework | **評測管線候選** |
| [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | Prompt injection / Red Team / LLM Eval | **應用安全測試** |

## E｜供應鏈安全

| Repo | 核心價值 | 採用建議 |
| --- | --- | --- |
| [zizmorcore/zizmor](https://github.com/zizmorcore/zizmor) | GitHub Actions 安全掃描 | **高** |
| [ossf/scorecard](https://github.com/ossf/scorecard) | 開源依賴／GitHub 治理安全指標 | **高：維護候選名單** |
| [gitleaks/gitleaks](https://github.com/gitleaks/gitleaks) | Secrets leak detection | **CI 候選** |
| [semgrep/semgrep](https://github.com/semgrep/semgrep) | 靜態安全規則與查找 | **CI 候選** |

## 選型時應追問的問題

1. 有沒有解決**目前真實存在**的瓶頸？
2. 這是索引格式、搜尋引擎、Agent harness 還是完整資料庫？不能類比錯誤。
3. 維護情況、License、Security Advisory、Windows/Linux 支援如何？
4. 會多載入多少 Tool Schema、每次結果多少 Tokens？
5. 其資料是否可能 stale？能否從 Git SHA 重建？
6. 加了之後能否關閉、回退、不影響既有工程？
7. 是否有同一個任務的 A/B 和錯誤案例，而非只有作者自述「x 倍提升」？

**總結：對多數中小型 Repo，先做好 `rg + AST/LSP + 導航式 AGENTS + CI`，通常比一開始完整 GraphRAG + 三層 Agent Router 更合理。**