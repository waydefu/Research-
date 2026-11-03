# Research- 新增研究、編輯與示範管理

更新：2026-11-03｜這是網站管理說明，不會修改或取代原始研究結論。

## 原則

1. 原始 Markdown 是唯一的研究正文：不得因排版而改寫、刪掉不確定性或變造作者言論。
2. 網站導讀與外顯標題是獨立編輯層：可以改成白話，但要依現有事實核對，不把推論寫成已證實。
3. 主分類為來源資料夾，細分類依標題與檔案路徑配對規則；不符合的文件顯示「跨領域研究」，等人工處理。
4. 對作者及第三方示範，必須區分原作品、作者自述、技術通用範例。外部站拒絕嵌入時只提供原站連結。
5. 沒有編輯備註時，展示原文段落摘要並明確標示「內容概覽」，不宣稱已完成人工改寫。

## 2026-11-03｜逐篇分類與公開標題的目前優先層

- 現有公開文件的人工校訂分類、技術標籤及精確繁中對外標題，統一登錄於 `site/src/lib/research-taxonomy.mjs` 的 `REVIEWED_DOCUMENTS`；新增時先檢查該表是否已有來源路徑。
- 每份文章僅指定一個**主要細分類**，可有多個精確技術標籤。以原 H1 與內容章節核對，不能只看到 GPU、Agent、design 等字就猜測主題。
- `README.md` 是研究導覽，`SOURCES.md` 是來源索引；來源與原始 H1 永不因公開分類或標題整理而被覆寫。
- 正式 `schemaVersion: 1` Metadata 若經 Owner 審核啟用，優先使用其明示欄位；其他現有編輯表使用人工分類，未知的新來源仍保留 Regex fallback，並標示尚未人工整理。
- 細分類的繁中用途與既有配圖對應在 `TOPIC_DESCRIPTORS`；不要將重用的分類圖片誤稱為逐篇專屬圖像。

## 新增一份研究

- 在 research/ 既有主題目錄（或新建主題資料夾）新增 Markdown。保留標準的第一層標題與來源 URL、查證日期及不確定性。
- 原本的 Astro Content Collections、catalog.mjs 會在下次建置自動納入全文、Pagefind 搜尋、領域清單和研究關聯圖；無須手工更新 80 多條文章路由。
- 如有全新資料夾，請在 site/src/lib/catalog.mjs 的 DOMAIN_NAMES 加上容易理解的繁中領域名稱；沒有時使用原資料夾名稱。
- 細分類與技術標籤由 site/src/lib/research-metadata.mjs 的 TOPIC_RULES / TAG_RULES 決定；需要精確分類時，將完整來源路徑加入 CURATED 進行人工覆寫。
- 同一個 CURATED 項目可以指定 title（網站閱讀標題）、lead（一至兩句白話導讀）、topic（主題）、creator（作者／作品來源）、demos（示範）。
- 沒有查核到作者身分時，creator 應留空。不要把採訪網站、轉載站或一般技術範例標成原作者。

## 白話專業編輯規範

依序回答：這是什麼？為什麼值得關心？如何運作？實際適合什麼情況？限制和待驗證條件是什麼？

- 題名優先採動作、問題或清楚名詞，例如「Three.js 海洋如何運作？」；不能把研究中的假設寫成肯定。
- 第一段 60–120 個中文字，先給概念與目的，再說技術名稱。英文專有名詞第一次出現時保留原文。
- 文章正文原封保存；展示標題與導讀和全文有衝突時，應優先修正編輯導讀，而不是隱藏原文。
- 每份手工導讀至少由一位審核者比對原始文件；沒有證據支撐的市場數字、性能指標或作者身分禁止加入。
- 長文沿用目錄、分節標題、可捲動程式碼與表格；避免所有段落都做成同款圓角卡片。

## 第三方原作與內嵌示範

目前註冊示例：Arctic Waters 的作者作品網址，以及 Three.js 官方海面 Shader 演示。兩者**不是同一作品**，也沒有聲稱海洋網站的 3D 原始碼已公開。

- 只在 CURATED 手工登記已核對的 HTTPS 示範。頁面不會自動探查、爬取或轉載第三方程式碼。
- 只有點擊「在這裡載入示範」才建立 iframe 的 src，以避免自動執行第三方追蹤或昂貴的 WebGL。
- iframe 使用 sandbox、無 referrer；初期只允許 threejs.org 和 3ditions.drop3.app。新增其他網域要做來源、權利與安全審查後再更新用戶端 allowlist。
- 原站可以透過 X-Frame-Options 或 CSP frame-ancestors 禁止內嵌；這不是本站的 bug。一定保留「到原網站操作」連結。
- 不複製第三方圖片、模型、shader、影片或商標；外站的嵌入可用性與授權不是同一件事。

## 驗收流程

在 site/ 目錄跑：npm run check、npm run build、npm run e2e。確認資料總數、中文搜尋、主領域和細分主題、手機無橫向溢出、文章原文未被截斷、作者連結不被誤標、第三方示範未點擊前零載入、沒有 JS 時仍可閱讀。

Core Web Vitals、手機 FPS、GPU 熱負載與外部網站 iframe 的真實可用性必須另外驗證；Chromium CI PASS 不代表這些項目已通過。

## 官方來源

- Astro Content Collections：https://docs.astro.build/en/guides/content-collections/
- Pagefind filters：https://pagefind.app/docs/filtering/
- Pagefind JS API：https://pagefind.app/docs/js-api-filtering/
- MDN iframe sandbox：https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
- MDN frame restrictions：https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options
