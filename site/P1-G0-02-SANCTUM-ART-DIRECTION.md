# P1 / G0-02｜Sanctum 首頁正式美術候選

> **文件狀態：歷史快照。** 記錄某一日期的決策或審查，內容原樣保留，不代表現況；現況見 [CURRENT-STATUS.md](./CURRENT-STATUS.md)，分類見 [DOCS-INDEX.md](./DOCS-INDEX.md)。

> 本文件描述一個可回退的實作候選。沒有 Owner 的畫面簽核、物理 Android／iOS、效能量測，**不得標為正式美術 Gate PASS**。

## 方向與實作
- **不換世界**：保留既有神殿 WebP（desktop / mobile）與固定場景、純 HTML 導覽、原生捲動。背景金色主光與非常少量冰藍邊緣反射，避免以多張背景切斷畫面。
- **繁中主角**：主標使用本機繁中明體 fallback 的 600 字重；英文技術提示轉為較細小的無襯線導覽資訊；小標與導讀用可閱讀的繁中排版。所有字型依系統既有字型解析，不添加未註冊外部字型資產／CDN。
- **敘事而非卡片**：首頁快速導覽改成左緣一條金光的垂直玻璃目錄；分類與精選保留實際圖片、書卷式細線分隔及原有可點擊 DOM。
- **手機第一眼先看圖**：維持既有 `58svh` 主視覺安全區、`104px` 連續暗玻璃交界；文字及搜尋仍跟隨圖片之後。搜尋框的 16px 字級避免 iOS 聚焦放大。
- **可撤銷的單一 CSS 層**：`site/public/atlas/sanctum/g0-02.css`；唯一首頁與 /v3/atlas/sanctum/ 透過同一絕對路徑載入，無需改 `site/scripts/unify-home.mjs` 的資產組裝契約。避免再往 48KB inline style 追加規則。

## 驗證要求
1. CI：`Research integrity`、`V3 P0 build and checks`、`Publish Research Showcase`，以 **本 PR 最新 HEAD** 判定。
2. Playwright：`site/tests/pages/g0-02-sanctum-art.spec.mjs` 在 320／393／768／1440 擷取首頁完整截圖、檢查光影樣式、繁中標題、手機圖文安全區、無橫向溢出、無 JS 與 reduce motion。
3. Owner 美術：與當前正式首頁同寬對比（首頁第一屏、分類段、精選段、結尾）；看金藍比例、背景是否變成具體觀測場景而不是新漸層、手機是否仍讓主圖居中、中文字體是否有層次。
4. 真機：依 `G0-REAL-DEVICE-PROTOCOL.md` 以相同 SHA 驗證 Android Chrome／iOS Safari、瀏覽器操作、熱與效能；實際數據空缺即標 `未測`。

## 不包含
- 新圖素材、新字型授權、Three.js／WebGPU runtime 或 P2 方案。
- `research/` 原始文件、V2 舊站、V3 研究正文、CI workflow／部署修改。
- 像素 golden、真機簽核、人工審美通過：這些都不是自動測試能替代的。

## 交付註記
此包不改 #63 的 V3 CSS。若 CI 失敗只修造成失敗的問題；不以刪掉無障礙／來源測試換取綠燈。主分支合併與正式部署均由 Owner 決定。
