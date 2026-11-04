# P1｜設計系統最小基線與視覺驗收方法

> 建立於 2026-11-04。目標是使後續 P1 美術改動可回溯、有共用 Token、有真實畫面取證，不是宣稱已達 Active Theory 品質，也不是批准 Three.js 全站 3D 或 P2。

## 視覺契約

1. **色彩概念**：研究概念層 `--palette-space-0:#0A101D`、`--palette-gold-primary:#E4B451`、`--palette-cyan-plasma:#40D4DE`；暗金主光、藍光只能點綴，文字優先繁中。
2. **已上線閱讀世界**：`tokens.css` 保留原計算值 `--bg:#080B11`、`--gold:#D9B579`、`--cyan:#91B9D0` 的等價語義引用，這是目前已驗收的閱讀色彩，不能擅改成概念圖色值。
3. **多場景**：Sanctum 根首頁有獨立靜態 `site/public/atlas/sanctum/index.html` CSS，V2 是歷史展示，Astro V3 由 `src/styles/global.css` 與 `atlas.css` 分層。本包不假稱三套 CSS 已完全共用，也不為了規格統一毀掉原視覺。
4. **架構**：Token 在一個 `:root` 宣告、概念與正式閱讀區各有語義變數；保持 `global.css` 的 import 邊界。大規模動效開始前應從 `global.css`／`atlas.css` 逐步抽出 typography、layout、motion 模組，需另有可比對的畫面基準與 CI。
5. **互動可讀性**：連續場景、減少卡片式 SaaS 結構、原生捲動、深色玻璃、中文排版、鍵盤、無 JS、reduced motion、iframe 點擊後載入及關閉卸載均須保留。不得用主背景裝飾遮住手機中央主視覺。

## 視覺／實機 Gate（不可互相替代）

| 證據 | 目前實作 | 仍需要 |
| --- | --- | --- |
| 程式來源與 Token | `site/tests/p05-entry.test.mjs` 驗證單一 Token 根層、原值與 import | 未來每次重大視覺變更更新 token 評審 |
| Chromium 機械檢查 | 現有 Sanctum 六寬、閱讀、鍵盤、reduced-motion、axe、搜尋、表格；新增 `site/tests/pages/p1-visual-review.spec.mjs` 保存 393／1440 頁面截圖 | 截圖需經人實際比較；**截圖存在不等於像素級回歸 Gate** |
| 高保真視覺基準 | CI Artifacts 可保留實際截圖與 URL／commit | Owner 指定同 SHA 的「核准 golden」、人工或自動差異閾值／允許的動畫變化區域；本包不假造 golden |
| Android + iOS | [真機測試規程](G0-REAL-DEVICE-PROTOCOL.md) 已存在 | 真實 POCO／Android Chrome 與 iPhone Safari，同一版本錄影、截圖、轉向／返回、10 分鐘觸控、FPS/溫度（有量測工具才填） |
| 第三方資產與權利 | [P1 素材登記](P1-ASSET-RIGHTS-REGISTER.md) | 每件新外部素材授權、截圖及 iframe 功能另核實 |

## 人工視覺簽核欄位（Owner 填寫）

- Git SHA／Pages 或 Staging URL：
- Android 裝置／OS／瀏覽器、iPhone／iOS／Safari 版本：
- 首頁、分類、搜尋、文章四個情境 × 393 與 1440 截圖／錄影連結：
- 是否保留全頁背景、中心畫面、暗金比例、玻璃層、字體層級與連貫性：PASS／FAIL／未驗
- 手機上是否出現背景切割、字蓋圖、橫向 overflow、觸控區太小：PASS／FAIL／未驗
- 實機 Core Web Vitals／耗電／熱量（工具、樣本數、方法）：測量值或 Unknown
- 是否核准此 SHA 作為 P1 G0 golden：Owner 決定／日期，未填即未核准

**限制**：本 PR 只收斂設計 Token、可觀測性與檢查路徑，不替代最終美術評價、素材授權或實機 Gate。
