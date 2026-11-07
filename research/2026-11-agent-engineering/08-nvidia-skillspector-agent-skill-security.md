# NVIDIA SkillSpector：如何在安裝 Agent Skills 前掃描提示注入與供應鏈風險？

**資料核對：2026-11-07（Asia/Taipei）**  
**原作者：** NVIDIA；[GitHub 專案](https://github.com/NVIDIA/SkillSpector)；[官方使用文件](https://docs.nvidia.com/skills/scanning-agent-skills)。  
**研究定位：** AI Agent 技能供應鏈、靜態掃描、MCP 權限、風險分數與安裝閘門。**本篇未安裝或執行任何技能與掃描器。**

## 它能檢查什麼？

SkillSpector 是**安裝前的風險掃描器**，可針對本地目錄、單一 SKILL.md、Git Repo、URL 或 ZIP 檔案檢查可疑內容。官方列出的類型包括 prompt injection、機密外洩、權限提升、工具濫用、系統提示詞洩漏、記憶污染、不安全程式碼、MCP 最小權限、工具投毒與第三方依賴問題。

- 第一層：**靜態模式**（規則、危險 API、可疑字串、宣告權限對照）；無需呼叫 LLM，適合安裝前初篩。
- 第二層：**可選 LLM 語意分析**，比較技能描述與程式行為是否不一致；這通常增加成本、外送內容與資料治理責任。
- 依官方文件可匯出 JSON、Markdown、SARIF 供審查或 CI 使用，也能透過 OSV.dev 查公開依賴漏洞（無網路時回退離線分析）。
- 作者 README 標示 Python 3.12+、Apache-2.0，聲稱 0–100 風險評分。**風險分數是掃描器內部指標，非安全認證或漏洞確證。**

### 文件版本衝突必須標明

[專案 README](https://github.com/NVIDIA/SkillSpector/blob/main/README.md) 於本次核對記載 **71 種模式、17 類**；[NVIDIA 官方掃描指引](https://docs.nvidia.com/skills/scanning-agent-skills) 記載 **68 種模式、17 類**。這可能代表文件同步落差；在固定發布版本、實際命令輸出之前，不應斷言所有部署都具備 71 種偵測功能。

README 提供的資料集統計如 31,132 個技能、26.1% 有漏洞、5.2% 有可疑惡意意圖，均是**作者研究樣本／定義**，不能外推為所有 Agent 技能或以此證明個別掃描結果可靠。

## 安全整合範例（僅供規格參考，尚未執行）

1. 在隔離環境下載**固定 commit** 的待審技能，先保留原始 SHA、來源網域與授權，不直接交給高權限 Agent。
2. 靜態掃描並輸出 JSON/SARIF；若有未處理的高危或掃描覆蓋不足，**阻擋安裝**，不可只看分數。
3. 人工核對命令是否會執行外部程式、擷取憑證、寫入檔案、修改 hooks、連到未批准端點，或要求不必要的 MCP 工具。
4. 需語意分析時才傳入 LLM，先移除敏感資料，核對是否會外送來源內容及產生費用。
5. 安裝後仍維持 sandbox、最低權限、網路出口限制、稽核與回退。**掃描無發現不是無漏洞證明。**

## 使用代價與缺口

| 項目 | 預期用途 | 界線 |
| --- | --- | --- |
| 上游程式 | [GitHub 原始碼](https://github.com/NVIDIA/SkillSpector) | 開源工具依賴不等於安裝安全；應固定版本與檢查 transitive dependencies |
| 靜態掃描 | 初篩技能內容及權限 | 可能漏掉動態下載、執行階段行為及混淆手法 |
| LLM 語意分析 | 檢查「宣稱用途 vs 真實程式」 | 可能誤判，且外部模型傳輸有隱私風險 |
| 0–100 分數 | 排序與審查優先級 | 非可跨工具比較的客觀風險機率 |
| SARIF 報告 | 供 CI／程式碼審查 | 導入前必須建立處置標準與負向測試 |

**採用評估：高優先研究候選；未授權立即安裝。** 應先用良性、提示注入、憑證外洩及混淆樣本對照誤報與漏報；只有在測試覆蓋、資料流向與權限邊界都可接受後，才考慮將其作為技能進入產線的必要檢查。

## 來源與證據層級

- [NVIDIA SkillSpector README](https://github.com/NVIDIA/SkillSpector/blob/main/README.md) — A：上游功能、環境需求、測試數據的**作者說明**；不是獨立評估。
- [官方 Scan Agent Skills 文件](https://docs.nvidia.com/skills/scanning-agent-skills) — A：官方檢查階段及使用方法；與 README 偵測數量衝突已明示。
- [專案 LICENSE](https://github.com/NVIDIA/SkillSpector/blob/main/LICENSE) — A：原始碼 Apache-2.0；第三方依賴授權需另查。
- 安裝閘門、威脅模型和試驗規劃 — C：工程推導，**NOT RUN**。
