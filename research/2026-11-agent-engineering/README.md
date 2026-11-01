# 2026-11｜AI Coding 代理工程研究

**範圍：** Google EGM、Claude Code 多模型協作（Sonnet／Haiku／Opus）、Advisor、Imagine、Jev／JEV。

**研究日期：** 2026-11-02（台北時間）  
**方法：** 官方文件／GitHub 原始專案交叉核對，未進行本機模型 benchmark、未安裝或啟用任何插件。

## 核心結論

| 技術 | 最佳用途 | 證據成熟度 | 主要限制 |
| --- | --- | --- | --- |
| EGM | 先寫規格，使用新上下文代理獨立審查 | 官方原始碼與安裝文件 | Goldfish 需要真的能產生獨立子代理 |
| Claude Code Advisor | 主模型執行、較強模型關鍵時刻提供意見 | Anthropic 官方文件 | 實驗性、提供者限制、額外使用量 |
| Claude Code 自訂子代理 | 將搜尋、程式審查等工作隔離 | Anthropic 官方文件 | 獨立上下文仍需使用量與權限控管 |
| Imagine / Custom visuals | HTML／SVG 視覺化、圖表與 UI 解釋 | Anthropic 官方產品介紹 + 社群出處 | 截圖中的內部規範不是獨立官方插件保證 |
| Jev | 狹窄、型別化分類與路由決策 | 專案原始文件與第三方整合 | 機率性判斷不是權限執行器，也非 Claude Code 內建 |

## 最值得學的設計模式

- **規格與實作分離：** 使用 EGM 讓設計文件先可被審查。
- **主代理上下文管理：** 將大量重複查找交給受限子代理，回傳摘要與證據。
- **兩類審查不要混淆：** Advisor 讀取對話脈絡；EGM Goldfish 刻意不繼承過去對話。
- **成本控管：** 並非模型越多就必定更省。需看總 Token、工具次數、延遲、返工率。
- **防止越權：** 路由模型做建議，真正權限由程式規則與人工批准決定。

## 閱讀順序

1. [EGM 工作流](01-egm.md)
2. [Claude Code 多模型與 Advisor](02-claude-code-multi-model.md)
3. [Imagine 視覺化](03-imagine.md)
4. [Jev 決策路由](04-jev.md)
5. [整合評估](05-integration.md)、[貼文核查](06-claim-check.md)、[來源](SOURCES.md)

> 本研究是資料保存與方案評估，不是已完成產品整合的驗收報告。
