# P1 G0 — Observatory Sanctum Art Direction Atlas

> **2026-11-03 最新狀態：** P1 交付紀錄與 G0 驗收狀態以 [P1-DELIVERY-G0-ACCEPTANCE.md](./P1-DELIVERY-G0-ACCEPTANCE.md) 為準。本文件保留最初 Atlas G0 的歷史構圖要求與紀錄，較舊的「未合併／未部署」描述不可當成目前站點或 PR 的即時狀態。

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

**歷史構圖 A/B/C** 使用原創 SVG 幾何與 CSS；**最新 Sanctum 全頁高保真版本**使用經確認的原創靜態 WebP 場景，圖片已去重為 5 份獨立資產。未引入 Three.js、GSAP、Blender、第三方現成展示資產或新的 npm 依賴。

## 12 張審查截圖

當 Pages PR CI 的 Playwright 測試執行成功後，測試輸出目錄應包含：

- concept-a-home-desktop.png、concept-a-home-mobile.png、concept-a-article-desktop.png、concept-a-search-desktop.png
- concept-b-home-desktop.png、concept-b-home-mobile.png、concept-b-article-desktop.png、concept-b-search-desktop.png
- concept-c-home-desktop.png、concept-c-home-mobile.png、concept-c-article-desktop.png、concept-c-search-desktop.png

以上只是**測試產物命名約定**；須以 CI 實際完成及 artifact 存在為準，不能僅憑檔名宣稱已驗收。

## G0 Gate 狀態

| Gate | 目前狀態 |
|---|---|
| 可瀏覽的三種構圖與真實文件入口 | **工程驗證完成**，G0 畫面仍待 Owner 美術簽核 |
| 12 組電腦/手機/文件/搜尋截圖 | **已由 CI 產出**，但與最新 Sanctum 審查截圖屬不同組別 |
| 320、360、393、430、768、1440 寬與 reduced motion | **Pages Chromium 30/30 PASS**；非 Android/iOS 真機測試 |
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
## 2026-11-03 最新收斂結果（以本 PR 最終 CI 為準）

- **正式候選仍位於 PR #24，並非正式 Pages 首頁**；未合併、部署 job skipped。
- `site/public/atlas/sanctum/index.html` 使用**全頁固定原創神殿 WebP 背景**，Hero / 精選研究 / 證據概覽 / 典藏館形成連續深色玻璃閱讀區；仍是靜態場景，不冒稱即時 3D。
- 美術與內容維持暗金為主、冰藍點綴；繁體中文主標題優先。文章／研究領域／全文搜尋使用站內同分頁導航，舊版頁面明確標示。
- 原 HTML 約 1,608,476 個 JavaScript 字串字元，9 處內嵌 WebP 資料只有 5 張不同圖；抽成五個獨立 WebP 後，HTML 約 51,420 字元（後續敘事 CSS/JS 又稍有增加）。**此為原始字串長度，不是網路傳輸大小或性能提升比例**。
- 在原生捲動上採進場／精選／證據／典藏四段遮罩曲線；CSS `animation-timeline` 的背景輕微運動只作為支援瀏覽器的裝飾性增強，`prefers-reduced-motion` 可停用。
- **[最新 P1 Pages CI：30/30 Playwright 通過](https://github.com/waydefu/Research-/actions/runs/41571528597)**，包含六種視窗、背景固定、玻璃、真實連結、無 JS、手機選單、獨立素材 URL 與多階段捲動；[V3 P0 checks](https://github.com/waydefu/Research-/actions/runs/41571528586) 與 [Research integrity](https://github.com/waydefu/Research-/actions/runs/41571528576) 均成功。**如果本段後還有新提交，必須重新確認新 HEAD CI，不可沿用舊綠燈。**
- 待確認：Owner 對比原核准美術的畫面觀感、受控字體盲測、真 3D 三視角厚度（本 Gate 如仍要求）、Android/iOS 真機 GPU/FPS/熱負載、LCP/INP/CLS 現場指標。
- 相關通用技術研究為**獨立研究 PR #25**，不在本程式 PR 混入研究來源修改。
- **Gate 結論：工程候選可審，G0 美術未簽核，不能宣告完整 P1 通過，也不得據此進入 P2。**
