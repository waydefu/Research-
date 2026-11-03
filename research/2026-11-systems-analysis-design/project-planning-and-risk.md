# 資訊系統專案規劃、排程與風險管理

> **研究範圍：**涵蓋工作分解、任務依賴、關鍵路徑、組織溝通、成本與風險應對。 主要概念依來源文件整理，出處見 [來源與證據](SOURCES.md)。


## Project Management

專案管理工作包括 **Planning（規劃）、Scheduling（排程）、Monitoring & Controlling（監控與控制）、Reporting（回報）**。專案經理負責分解任務、決定先後順序和估計工期；大型專案可能有 Project Coordinator 協助行政工作。（PDF 第 2–4 頁）

**Project Triangle**：Cost（成本）、Time（時間）、Scope（範圍）互相制約；不可能無限制同時壓低成本、縮短時間且增加範圍。（第 3 頁，圖 3-2）

## Task Management

- **WBS（Work Breakdown Structure）**：把大型專案拆成較小任務。
- **Task / Activity**：有開始與結束、使用組織資源的工作。
- **Milestone**：重要事件／節點，協助追蹤進度。
- **Duration**：工作所需工期；**Person-day**：一人一天的工作量。
- 影響工期的因素：專案規模、人力、類似專案經驗與限制。
- **Predecessor**：前置任務；WBS 裡的任務需依照 Task Pattern 安排邏輯順序。

| 工具 | 主要用途 | 來源文件位置 |
| --- | --- | --- |
| **Gantt Chart** | 以時間長條圖呈現任務排程、進度及完成比例 | 第 5–7 頁 |
| **PERT/CPM Chart** | 用任務節點和連線表現依賴、工作順序及可分析的路徑 | 第 5、7、12–15 頁 |
| **Critical Path** | 若其中任務延誤會影響整個專案完工日期的任務路徑 | 第 14 頁 |
| **Slack Time** | 任務在不延誤專案完工時可容許的延遲時間 | 第 14 頁 |

### 三種任務關係（第 12–13 頁）

1. **Dependent Tasks**：任務相依，上一項需完成後才進行下一項。
2. **Multiple Successor Tasks**：一項工作後可以分出多個後續工作。
3. **Multiple Predecessor Tasks**：下一項工作依賴多個前置工作。


## People & Communications Management

- **People**：技術解釋要清楚、理解使用者需求、處理團隊互動、鼓勵學習與持續回饋；變更過程需給予協助並建立信任。（第 16–17 頁）
- **Communications**：維持開放、清楚、定期的需求與進度溝通。團隊成員回報專案經理，經理向主管及使用者說明；需求和範圍變更需有溝通規則，並考慮語言／文化障礙。（第 18–19 頁）

## Technology & Financial Management

- **Technology**：選工具時考量功能、擴充性、成本效益；完成安裝、整合、設定、團隊培訓；持續更新、安全檢查及存取控制。（第 20–21 頁）
- **Financial**：人力、軟硬體、訓練、維護、超支等預算；以 **ROI（Return on Investment，投資報酬率）** 評估預期效益與成本，持續評估財務風險。（第 22–23 頁）

## Risk Management

**風險管理流程：**
1. **Risk Identification**：找出威脅與不確定性；可採 Delphi、SWOT、Risk Breakdown Structure；結果通常記入 **Risk Register**。（第 24–25 頁）
2. **Risk Analysis**：依發生機率與影響程度評估；分 **Qualitative**（定性）與 **Quantitative**（定量）分析。（第 26–27 頁）
3. **Risk Response Planning**：安排如何處理風險。（第 26 頁）

| 策略 | 白話理解 | 筆記補充例子（非投影片原例） |
| --- | --- | --- |
| **Avoidance** 迴避 | 避免承擔特定風險 | 停用不必要的高風險方案 |
| **Transfer** 轉移 | 將風險後果／責任轉由他方承擔 | 為可保風險購買保險 |
| **Mitigation** 降低 | 降低發生可能或損失 | 加強測試與備援 |
| **Acceptance** 接受 | 明知風險仍選擇承擔 | 接受影響很小的延誤風險 |

**Risk Management Plan**：包括辨識、分析、應對，也要描述監控控制、角色與責任及風險溝通。（第 28 頁）

常見失誤：風險辨識不足、風險評估不佳、應對措施無效。（第 29 頁）

## Project Software 與成功要素

**專案管理軟體**可以協助排程、資源配置、追蹤、文件、協作、風險與整合。來源文件舉例 Microsoft Project、GitHub、Google Workspace。（第 30–34 頁）

專案挑戰常見五類：
- **Business**：商業目標不符、流程再造、ROI 理由不足。
- **People**：溝通中斷、抗拒變更、技能缺口。
- **Technology**：相容性、快速技術變動、安全與隱私。
- **Budget**：超支、非預期費用、預測不準。
- **Schedule**：延遲、任務重疊、工期低估。

來源文件建議具備 **Agile Mindset**，接受需求可能變更，並重視合作與建設性解決衝突。（第 35–37 頁）

## 研究適用範圍

本文件描述資訊系統分析、設計與專案管理的基礎方法。流程與工具的適用性取決於組織需求、資源及實施條件；內容不代表已於特定專案實測。
