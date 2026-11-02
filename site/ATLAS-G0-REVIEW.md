# P1 G0 — Observatory Sanctum Art Direction Atlas

> 2026-11-03 · Owner 批准 P0 PASS 並授權 P1 G0 靜態構圖研究。此檔僅記錄 PR 驗收，不構成 G0 通過或 P2 開工許可。

## 目標

以 Owner 選定的「天文儀式感 × 神殿式知識核心」和暗金主調完成三種真正不同的鏡頭構圖：

- A 中央聖殿：對稱／中央核心／典禮式進入。
- B 偏心觀測：儀器偏右／強烈留白／內容與物件並置。
- C 長廊探索：建築縱深／遠方核心／方向引導。

共同色彩：宇宙黑 #0B0E17、深藍 #1A2B4A、古典暗金 #D4B173、象牙白 #E6E0D3、冰藍 #6EA8D6。**冰藍為少量輔助色，不得取代暗金主視覺。**

## 本分支的靜態頁面（合併前不會在線上 Pages 發布）

- /Research-/v3/atlas/
- /Research-/v3/atlas/concept-a/
- /Research-/v3/atlas/concept-b/
- /Research-/v3/atlas/concept-c/
- /Research-/v3/atlas/typography/
- /Research-/v3/atlas/evidence/

本階段所有藝術背景使用在此 PR 原創的 SVG 幾何與 CSS。並未引入圖片模型、第三方現成展示資產、Three.js、GSAP、Blender 或新的 npm 依賴。

## 12 張審查截圖

當 Pages PR CI 的 Playwright 測試執行成功後，測試輸出目錄應包含：

- concept-a-home-desktop.png、concept-a-home-mobile.png、concept-a-article-desktop.png、concept-a-search-desktop.png
- concept-b-home-desktop.png、concept-b-home-mobile.png、concept-b-article-desktop.png、concept-b-search-desktop.png
- concept-c-home-desktop.png、concept-c-home-mobile.png、concept-c-article-desktop.png、concept-c-search-desktop.png

以上只是**測試產物命名約定**；須以 CI 實際完成及 artifact 存在為準，不能僅憑檔名宣稱已驗收。

## G0 Gate 狀態

| Gate | 目前狀態 |
|---|---|
| 可瀏覽的三種構圖與真實文件入口 | 已編寫，待 CI 建置及瀏覽器驗證 |
| 12 組電腦/手機/文件/搜尋截圖 | Playwright 測試已編寫，待 CI 產出 |
| 320、360、393、430、768、1440 寬與 reduced motion | 測試已編寫，待 CI 結果 |
| 三套繁中候選字體的 CSS 排版試件及授權入口 | 已編寫 |
| 真正的匿名字體盲測、受控字型檔與完整 cmap 覆蓋 | **未完成**。本 PR 沒有字型二進位檔，系統後備字體不應被當成候選字型 |
| Evidence Engine 三視角二維黑白輪廓草案 | 已編寫，僅為靜態 SVG |
| 真正具 3D 深度的輪廓正面／側面／3/4 驗證 | **未完成**，需要模型後才可驗證 |
| Owner 選擇 G0 構圖與允許進入 P2 | **未授權，禁止自行宣告通過** |

## 不可越界

- 不切換 V2 首頁或 V3 根首頁；不修改 P0 正文、研究來源、研究索引、Search/Reader 功能。
- 不修改 GitHub workflow、Pages、授權、安全與治理設定。
- 不新增任何外部素材、字型 CDN、執行時依賴、WebGL 或真機效能宣稱。
- PR 審查之前不合併、不部署，不提前進入 P2。

## 審查重點

1. 暗金是否仍然絕對主導，藍光是否太多？
2. A/B/C 是否在鏡頭、構圖重心與可閱讀區有明確差異？
3. 手機版是否自然地把宏偉場景轉為有序的資訊入口？
4. 文章與搜尋是否維持真正內容連結，不是假資料？
5. 文字、按鈕、真實研究入口是否不需要動畫也能使用？

**結論：** 本次 PR 是 G0 第一輪可操作構圖提案；字型實際載入/盲測與三維輪廓是剩餘驗收點。除非 Owner 明確決定縮小 Gate，不能標註 G0 已全部通過。