# P1 / G0-01｜研究館場景連續性：首個可回退工作包

> 2026-11-04｜Owner 已授權進入 P1。本文件是**候選 PR 的設計與驗收紀錄**，不是已上線或通過實機驗收的宣告。

## 目的與既定方向

維持 Sanctum 根首頁、V2 歷史站及 V3 研究館的既有路由，從 V3 **閱讀區的視覺連續性**先做小型、可回退的 G0 實作。深藍背景、暗金主光及有限青色點綴；內容、圖片與研究技術案例仍各有獨立具體的視覺，不把網站改成同一張圖覆蓋所有頁面。

本包刻意只改善 V3 典藏、分類、搜尋和原文閱讀頁的 CSS 表現：入口下緣的柔和場景銜接、編輯式分段節奏、減少卡片感，以及只由 hover 觸發的微小圖像移動。既有手機首屏構圖、可見搜尋入口、無 JS 閱讀和每篇來源資訊不改。

## 實作與界線

- `src/styles/p1-reading-flow.css` 是本包獨立可拆除的樣式；由 V3 共用 Base Layout 載入，不碰 Sanctum 原生 HTML／V2。
- 只有 CSS；沒有 Three.js、GSAP、外部 CDN、GPU 常駐、動畫滾動接管或新權限。
- 圖像效果只用現有各研究主題素材；`prefers-reduced-motion: reduce` 關閉轉場，觸控裝置不依賴 hover。
- 研究原始 Markdown、87 筆來源與分群／索引／Pagefind、40 篇通用技術正文、47 份逐檔來源處置均不變。

## 合併前必驗

1. 本 PR 最新 HEAD：Required Research integrity、Astro 建置、單元／Playwright、npm 高風險稽核、Pages artifact 三組均成功；失敗先修，不能借用舊版。
2. Playwright 393px／1440px：典藏、搜尋、文章無橫向溢位；書籍入口背景不遮住文字，分類圖 hover 裁切安全；reduced motion 沒有強制動效；鍵盤可進入搜尋。
3. 由 Owner 看完整實際畫面，判定「連續感／圖片中央／暗金與冰藍比例／非卡片感」；現有 screenshot 僅人工證據，不是假造 golden。
4. Android 真機（包含 POCO F8 Ultra）與 iPhone Safari／幀率／發熱仍未量測，標為 **Unknown**；不可用 Chromium emulation 取代。
5. 核准前不合併、不主動正式部署、不把 G0 簽為 PASS。

## 後續獨立小包（不在本 PR）

- G0-02：採既有 Sanctum Art Direction 審定桌面／手機靜態場景和中文字體，經人工視覺簽核後才處理根首頁大改。
- G0-03：以 screenshots 與來源標註完成設計 Golden、字體覆蓋和可用性驗收。
- 新 GPU／3D PoC、鏡頭飛行和跨頁世界分別屬後續 P2/P3，不能藉此進場擅自啟動。
