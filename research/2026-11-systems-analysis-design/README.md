# 系統分析與設計｜Ch1–Ch3 課程研究筆記

> 類別：課程教材整理／基礎資訊系統分析與專案管理。  
> 整理日期：2026-11-03（Asia/Taipei）。  
> 證據類型：使用者提供的三份課程簡報 PDF；**這是來源導向的學習摘要，不是外部研究、實作測試或最新產業標準查證**。  
> 原始 PDF 未收入公開儲存庫；參閱 [來源與限制](SOURCES.md)。

## 三章總覽

| 章節 | 核心問題 | 一句話 |
| --- | --- | --- |
| [Ch1：Introduction to Systems Analysis & Design](01-introduction-to-systems-analysis-and-design.md) | 什麼是資訊系統？如何開發？ | 了解系統組成、系統分析師、SDLC 和開發方法 |
| [Ch2：Analyzing the Business Case](02-analyzing-the-business-case.md) | 這個專案值得做、做得成嗎？ | 理解系統請求、商業理由、四大可行性及初步調查 |
| [Ch3：Managing Systems Projects](03-managing-systems-projects.md) | 核准之後如何把專案做完？ | 用 WBS、甘特圖、PERT/CPM、關鍵路徑與風險管理掌握執行 |

**理解順序：**認識系統（Ch1）→ 評估立案（Ch2）→ 管理執行（Ch3）。

## 十五個必備觀念

1. **資訊系統五要素：**Hardware、Software、Data、Processes、People。
2. **Data / Information：**原始事實／經處理、對使用者有價值的資訊。
3. **SDLC 五階段：**Planning → Analysis → Design → Implementation → Operations。
4. **Agile：**以漸進與反覆修訂應對使用者需求；Prototype 是早期可運作版本。
5. **電子商務：**B2B（企業對企業）、B2C（企業對消費者）、C2C（消費者對消費者）。
6. **SWOT：**Strengths、Weaknesses、Opportunities、Threats。
7. **PESTEL：**Political、Economic、Social、Technological、Environmental、Legal。
8. **系統請求六理由：**加強控制、降低成本、更多資訊、更好績效、改善服務、更多支援。
9. **四大可行性：**Operational（能否有效使用）、Economic（效益是否勝過成本）、Technical（技術是否可行）、Schedule（時間是否可行）。
10. **初步調查五步：**了解問題→定義範圍與限制→蒐集事實→分析資料→評估可行性。
11. **專案三角形：**Cost、Time、Scope 互相制約。
12. **WBS：**將專案分解成可管理的任務。
13. **Gantt vs PERT/CPM：**甘特圖看時間與進度；PERT/CPM 看任務先後與依賴。
14. **Critical Path vs Slack Time：**影響專案完成日期的任務路徑／不推遲完工的可延遲時間。
15. **四種風險應對：**Avoidance、Transfer、Mitigation、Acceptance。

## 常見混淆對照

| A | B | 關鍵差異 |
| --- | --- | --- |
| Data | Information | 原始資料 vs 經處理後有價值的資訊 |
| Systems Analysis | Systems Design | 建立邏輯模型 vs 建立符合需求的實體模型 |
| Operational Feasibility | Technical Feasibility | 實際是否能有效使用 vs 技術資源能否實現 |
| Gantt Chart | PERT/CPM | 時間／進度 vs 任務依賴／路徑 |
| Critical Path | Slack Time | 影響整體完成日期的路徑 vs 不影響完工的浮動時間 |
| Risk Avoidance | Risk Mitigation | 避免風險來源 vs 降低風險發生機率或影響 |

## 課程內容如何銜接實務

以「公司想建置訂單系統」為**自行舉例**，非投影片原案例：

- **Ch1**：辨識人、流程、資料、軟硬體，選擇 SDLC 與開發方法。
- **Ch2**：釐清為何需要新系統，確認是否值得投資、技術與時程能否支援。
- **Ch3**：拆解需求／設計／測試等任務，安排依賴與時程，處理預算、溝通及風險。

## 課程研究資料的使用邊界

- 內容依照教材重述，並補上**白話釋義**；例子與記憶口訣不是教材原文。
- 非對教材內容或用語的外部權威交叉驗證；未驗證不應當作最新 ISO/PMBOK/敏捷標準。
- 原始教材可能有著作權；本 repo 只保存**轉述的重點筆記、檔名和 PDF 頁碼**，不重新散布原 PDF 或整頁投影片。
- 專題只作研究與查詢，不改變任何專案的系統設計、治理規則或部署配置。

[教材來源、頁碼與限制](SOURCES.md)
