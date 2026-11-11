# 開機動畫與視覺效果：跨平台研究索引

研究日期：2026-11-11（Asia/Taipei）  
研究狀態：四個 GitHub 專案已完成限定範圍原始碼／發布紀錄核對；四部使用者提供影片完成解碼統計與抽樣視覺檢查；未在 Android 或 Windows 實機驗證。

這份專題比較瀏覽器外掛開場、SVG/DOM 敘事動畫、Canvas 即時光效、Windows 原生啟動器，以及 Android 系統開機動畫。所有內容都是**研究**，不表示這些上游專案已被安裝、執行、改作或取得資產轉授權。

## 閱讀順序

1. [01｜四種技術架構比較與驗收框架](01-cross-project-architecture-and-adoption.md) — 先看結論、架構與採用門檻。
2. [02｜dsh-boot-animation](02-dsh-boot-animation-handoff-and-fallback.md) — 片尾交接、媒體池與失敗保護。
3. [03｜dsh-550c-boot](03-dsh-550c-splash-timeline-and-first-frame.md) — 首幀覆蓋、SVG 分鏡、雙段退場。
4. [04｜HALOFLUX](04-haloflux-beat-canvas-light-rings.md) — 非均勻節拍、光場與手機負載控制。
5. [05｜Codex Dragon R16](05-codex-dragon-r16-living-boot-and-pulse.md) — 三段影片、預熱、眨眼切換、淚滴波紋與原生窗口交接。
6. [06｜Android 與使用者影片量測](06-android-bootanimation-and-video-analysis.md) — 逐幀統計的限制與 POCO 裝置可行性。
7. [SOURCES｜原始出處與授權界線](SOURCES.md)。

## 核心判斷

- DSH 裝飾性啟動頁與 Android OS 開機階段是**不同執行環境**；HTML／Canvas／WPF 不能直接放進 Android 的 bootanimation.zip 當作可執行腳本。
- 實際應用啟動的視覺交接，需要把「素材已解碼」「實際已顯示」「主程式就緒」「動畫結束」「使用者略過」分開觀察，不能只用一個定時器。
- 真正 Android 開機動畫優先研究 AOSP 影格序列規範；POCO F8 Ultra／HyperOS 實際可替換方式、Root 需求與保固／安全風險均**未實測**。
- 不收錄或轉存第三方動漫、遊戲、龍娘、影片、音樂等受權利保護的原始媒體；研究館自製技術示意圖不等於原作者作品。

最後核對：2026-11-11。新增研究採用時需再次核對 upstream commit、LICENSE 與設備支援。
