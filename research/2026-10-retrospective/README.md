# 2026 年 10 月｜AI 工程研究精選與實測回顧

> **整理日：2026-11-02** · 依十月對話、先前執行摘要、可追溯 GitHub／官方來源整理。不是逐條可證實的全量對話匯出；有些項目僅曾比較或提出為候選。  
> **不安裝任何插件、不更動既有專案。** 與 11 月的 [EGM、Advisor、Imagine、Jev 專題](../2026-11-agent-engineering/README.md) 互補，不重複存整份研究。

## 核心收錄（精選，不是越多越好）

| 主題 | 本次文件 | 價值／判定 |
| --- | --- | --- |
| 代理協作與治理 | [01｜Hermes、模型分工與確定性閘門](01-agent-orchestration.md) | **高**：避免權限、並發與不必要代理成本 |
| MCP 與索引 | [02｜Serena、RepoMap、Codebase Memory MCP](02-code-intelligence-benchmarks.md) | **最高**：保留失敗實驗、實測數據與限制 |
| Skills 與治理 | [03｜Agent Skills、來源治理、小說 Skills 案例](03-agent-skills-and-governance.md) | **高**：可重用設計與真實 CI 經驗 |
| UI/UX Skills | [04｜Impeccable、GOATED UI、UI UX Pro Max](04-ui-design-skills.md) | **高**：設計審查與方法可重用 |
| Web 動畫與 3D | [05｜Motion、GSAP、Rive、WebGL 與 AKM](05-web-motion-3d.md) | **高**：手機效能、正確性與素材授權取捨 |
| 安全／CI | [06｜RBAC、信任邊界、Semgrep、Gitleaks](06-secure-agent-cicd.md) | **高**：真正的安全閘門 |
| AURORA 音訊 | [07｜DSP、HRTF、量測及研究路線](07-audio-dsp.md) | **高**：有具體工程問題及可測的假設 |
| 本地模型 | [08｜手機 LLM、模型選型與成本](08-local-llm-models.md) | **中高**：可重做效能測試 |
| AI 影片自動化 | [09｜OpenFilm、Remotion、FFmpeg](09-video-automation.md) | **高**：開源工具與商業化合規界線 |
| 候選與待查證 | [10｜其他工具與去重清單](10-candidate-backlog.md) | **中**：可回收線索，不把名稱當成果 |
| 導入決策 | [11｜實際可採用路線與優先順序](11-adoption-roadmap.md) | **高**：防止堆工具與無效重複研究 |

## 核心發現

1. **Codebase Memory MCP 不是裝了就更省。** 12 題 A/B 顯示 input -3.0%、API calls -6.7%，但 output +15.7%、任務時間僅 -1.2%，freshness 失敗 21/21；維持 `KEEP_WITH_LIMITS`、不全域啟用。
2. **工具的權限、證據和回退勝過 Agent 數量。** `default` Profile、明確審批、總並發 2、禁止擅自開啟子代理的後期治理規則維持不變。
3. **UI Skills 值得用來做審查與產生設計規則，但不是把全部框架塞進網站。**
4. **發現原始來源 ≠ 已採用；PR 已建立 ≠ 已合併或本機安裝驗收。**
5. **以前的性能數字只適用當時的版本／樣本。** 重新導入前需版本鎖定、freshness 檢查、同條件 A/B。

## 研究狀態詞彙

- **實測紀錄**：先前對話提供具體數字或可追溯驗收，尚待原始 log／檔案回鏈。
- **官方／原始碼核對**：功能有上游佐證，不等於在使用者環境實測。
- **方案**：建議架構，尚未執行。
- **候選**：只知道名稱／用途，需補原始來源與實驗；不得聲稱已安裝。

本資料庫儲存的是**研究筆記與工作原則**；任何導入、安裝、合併其他 Repo 都需要另外授權。
