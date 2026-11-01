# 08｜驗收方案：讓「省 Token、查找快、品質高」都有證據

**不能用供應商跑分取代自己的任務測試。** 這是通用實驗規劃；下面門檻是**初始驗收目標（待同意與測試調整）**，不是實測結果。

## 四組對照

| 組別 | 使用工具 | 目的 |
| --- | --- | --- |
| A（基線） | 現有 Agent + git / rg / 限制範圍的原始碼讀取 | 不增服務的真實成本 |
| B（精準） | A + ast-grep / 受限 Serena LSP | 確認 symbol 查找是否比全檔讀取好 |
| C（跨 Repo） | B + Zoekt + （選配）SCIP | 驗證多 Repo 查找、索引新鮮度 |
| D（知識） | C + FTS5 / BM25 / Vector（按需） | 回答架構文件與概念問題 |
| E（圖譜試驗） | D + Graphiti / Cognee（**條件**） | 多跳與歷史變動問題是否明顯提高正確性 |

A/B/C 不必全部同時安裝；隔離沙盒或另開實驗環境，既有 Hermes 預設保持不變。

## 題目分組（建議至少 30 題）

- 6 題：精確路徑／錯誤字串／設定檔查找。
- 6 題：function 定義、實際 callers、imports。
- 6 題：跨檔案、多模組、變更影響分析。
- 6 題：文件規格、第三方版本、架構決策。
- 6 題：刪檔／版本切換／動態反射／索引 stale 的陷阱。
- 額外：跨 Repo、圖譜時序題（若要導入對應功能）。

每題先有人類／確定性程式標準答案、來源檔 SHA、標籤和可接受的 abstain 條件。避免評測時代理直接看答案。

## 量測表

| 指標 | 公式／意義 | 反例 |
| --- | --- | --- |
| `Recall@k` | Top-k 檢索是否涵蓋應找的全部必要來源 | 只找到部分 callers 卻說完整 |
| `Precision@k` | 命中多少真的相關 | 因多回傳幾百行造成灌水 |
| `Exact / Symbol hit rate` | 真正命中指定符號／路徑 | 模糊相似但找錯檔 |
| `Freshness PASS` | 索引 commit/branch/檔案 Hash 一致 | 索引存在但過期 |
| `Verified-source rate` | 模型答案能追溯到正確證據的比例 | 未來源引用 |
| `Abstention correctness` | 未知／不完整時正確拒絕 | 空索引直接推論不存在 |
| `p50/p95 latency` | 一次查詢、首次正確證據、整個任務時間 | 只報 cache warm 最佳值 |
| `Total Token` | 主＋所有子代理/Advisor/重試/cache | 只計主代理 |
| `Cost per success` | 全部模型、工具、計算費／真正通過任務數 | 省 Token 卻多一倍返工 |
| `Escaped error` | CI 未發現但 PR/人工驗收失敗 | 模型聲稱完成 |
| `Safety incidents` | 越權操作、外洩、保護檔遭改 | 依賴 prompt 自述 |

## 建議的 Gate（非實測）

- **P0：** 安全越權、索引誤引用其他 Repo ACL、已知 stale 仍回答，允許次數 **0**。
- **P0：** 模型回答「全部呼叫點」的任務，應提供 completeness status；未證明完整時不能說不存在。
- **P1：** 同樣或更高的正確任務完成率，才能接受「省額度」優化。
- **P1：** 相較 A，成本／成功任務數下降才值得導入；改善幅度需超過測量誤差。
- **P1：** p95 全程完成時間不能因索引建置/路由嚴重退化。
- **P2：** 追蹤索引大小、RSS、CPU、工具開機時間、維護工時與回退複雜度。

## 之前十月的反例

對照[十月歷史測試](../2026-10-retrospective/02-code-intelligence-benchmarks.md)，CBM 曾有生命周期 21/21 PASS，但 Freshness 21/21 FAIL。表示**服務活著 ≠ 資料對**。必須修復後重跑**相同新鮮度測資**才可聲稱問題解決。

## 2026 的代理評測參考專案

- [mini-SWE-agent](https://github.com/SWE-agent/mini-swe-agent) 可研究透明、可再現的輕量代理控制流程。
- [AgentSWE Benchmark](https://github.com/VectorSpaceLab/AgentSWE)：研究建立／修改／優化 Agent 的跨任務測試，但分數不能直接等價你的 Repo。
- [Inspect AI](https://inspect.aisi.org.uk/)：可重用工具、Agent、Scorer、Datasets。
- [agent-memory-benchmark](https://github.com/datapace-ai/agent-memory-benchmark) 和 [agent-memory-bench](https://github.com/hamza-dev-tech/agent-memory-bench)：記憶產品和檔案基線比對。

## 測試紀錄模板（示意）

```yaml
task_id: code-find-001
repo_sha: "commit-under-test"
variant: "A-baseline"
query_type: "callers"
expected_sources: ["src/example.ts#function"]
retrieved_sources: ["src/example.ts:10-30"]
index_sha: null
index_freshness: "not-applicable"
complete_callers: "unknown"
model: "provider/model/version"
tokens:
  input: null
  output: null
  cache_read: null
  subagents: null
latency_ms:
  retrieval_p50: null
  retrieval_p95: null
  task_total: null
pass: null
unauthorized_actions: 0
```

**禁止在沒有跑這組實驗時填上虛構改善百分比。**