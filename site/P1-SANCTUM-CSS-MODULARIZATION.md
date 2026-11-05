# P1｜Sanctum CSS 快取與模組邊界第一次抽離

## 範圍
- 原本 `site/public/atlas/sanctum/index.html` 的約 48 KB inline CSS **未改選擇器或宣告順序**，獨立為 `sanctum-core.css`。
- HTML 原先後載入的 `g0-02.css` 保留原順序；主頁 `/Research-/` 和 Astro Atlas 預覽使用同一份絕對網址的 stylesheet。
- CSS 中 `./assets/*.webp` 依 `sanctum-core.css` 所在資料夾自行解析，不依賴根首頁的 `unify-home.mjs` 字串取代；HTML 上原有 WebP preload 照舊。
- 根首頁與 V2／V3 的內容、互動和原圖未更改。抽出來後瀏覽器可獨立快取 CSS，HTML 變得更小；**尚未量測實際網路下載或性能收益**。

## CI 防回歸
`site/tests/pages/sanctum-css-boundary.spec.mjs` 在正式首頁與 Atlas 預覽、320／393／768／1440 寬驗證：兩支本地 stylesheet、背景 WebP、固定場景、暗玻璃、中文字重、不溢出及可讀 URL。既有搜尋／不遮圖／reduced-motion／無 JS 測試仍必須全部通過。

## 後續
這僅是第一個安全、可回退的文件拆分。下一步若要依 typography/layout/motion 細切，需以 Owner 核准 Golden 截圖比對和同一 SHA 的可追溯回歸來判斷。不能把本包標為整站 CSS／設計系統全面模組化完成。
