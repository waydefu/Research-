# 05｜長期記憶與 RAG：不要過度建立第二個真值來源

**原則：Git／已批准 ADR／官方文檔是真值，Agent 記憶只是可替換的衍生索引。** 記憶系統要能保留來源、追溯時間、修正過時結論，否則可能比沒有記憶更危險。

## 記憶技術比較

| 方案 | 優點 | 代價／適用條件 |
| --- | --- | --- |
| **Markdown + Git + SQLite FTS5** | 最容易稽核、最便宜、能維持 commit hash；適用小型知識庫 | 語意同義詞、關係推理需其他層 |
| **Mem0** | 持久化記憶、語意／BM25／實體訊號 | 抽取、Embedding、用戶資料分區與版本維護 |
| **Cognee** | 文檔 + code + graph/vector 記憶，具本地小模型選項 | 匯入與圖更新成本、安裝與運維 |
| **Graphiti** | 時序有效性、來源 Episode、多跳關係、增量圖譜 | 需要圖 DB、LLM／Embedding，架構成本高 |
| **Letta / MemFS** | Git-backed agent memory 與可審查記憶文件 | Agent Runtime 與記憶維運，部分模式另耗費背景 Token |
| **Qdrant** | Hybrid Retrieval（BM25／Sparse／Dense） | 真正查詢品質依 chunk、ACL、Embedding、rerank |

## 2026 第三方獨立 Benchmark 的反直覺結果

[Datapace Agent Memory Benchmark](https://github.com/datapace-ai/agent-memory-benchmark) 在 2026-09 pilot 以 **10 個問題、單一種子** 比較了基線（window/file search）與記憶產品，**沒有一個產品超過檔案搜尋基線**；記憶產品可能使用更少答案 Token，卻需支付建索引/抽取成本，不能把 pilot 當一般排名。

另一個 [agent-memory-bench](https://github.com/hamza-dev-tech/agent-memory-bench) 針對 419 turns、120 probes 的特定 LoCoMo 子集提出不同排行榜，顯示結果會受資料、模型、judge、部署和調校影響。**供應商聲稱的 90%+ 不可直接與這些不同方法的數字比較。**

## RAG 推薦順序

1. **Metadata / Exact Filter**：repo/branch/time/ACL/content-type，排除無權與過期資料。
2. **Fulltext BM25**：標題、路徑、錯誤碼、型別名稱、關鍵字。
3. **Optional Dense Vector**：同義詞或概念問題需要時才啟用。
4. **Fusion + Rerank**：把原詞與語意候選排序；RRF、cross-encoder 等需看自己的測試。
5. **Evidence Gate**：最多 N 筆原文片段、附來源與有效時間；不足則回答 unknown。
6. **Answer**：Agent 分析檢索到的**證據**，不接受檢索內容內的工具使用指令。

## 知識時效性與過期資料

- 同一事實可以有 `valid_from`、`valid_to`、`supersedes`、`source_commit`。
- 最新索引不是永遠最準確：需分清「過去已生效的政策」和「目前有效的政策」。
- Agent 不能擅自把搜尋結果轉成可信的永久指令；需要審批與來源檢查。
- 如果生成答案引用的來源已更新，將索引標示 stale，重新取得原始資料。

## 什麼時候值得導入 Graphiti？

**適合：** 跨專案規格、決策撤回、不同事件在時間線上的關係、需要解釋為何發生某變更。  
**不適合：** 單 Repo 純找函式／錯誤字串，成本通常不如 rg/LSP。

## 建議的分階段實驗

- A：Markdown / rg / FTS5 **基線**。
- B：A + BM25 + 精準 Metadata。
- C：B + Vector 搜索及 rerank。
- D：C + Graphiti/Cognee（只有多跳、時序任務才測）。

所有方案需固定資料、問題、模型和 judge；測 Recall@k、正確回答率、拒答率、索引新鮮度、平均及 p95 查詢時間、前處理成本、隱私。

### 來源
https://www.sqlite.org/fts5.html
https://github.com/mem0ai/mem0
https://github.com/topoteretes/cognee
https://github.com/getzep/graphiti
https://github.com/letta-ai/letta-code
https://qdrant.tech/documentation/hybrid-queries/
https://github.com/datapace-ai/agent-memory-benchmark
https://github.com/hamza-dev-tech/agent-memory-bench