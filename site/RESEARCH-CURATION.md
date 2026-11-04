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

## 公開讀者優先：技術主題而不是內部交接

- 公開網站面向**任何想理解技術的人**；公開標題、導讀、分類、精選與設計示例必須解釋可重用的技術原理、適用情境和限制。不要讓讀者必須知道某一個 Repo、PR、Owner、階段代號或歷史工作過程才能理解。
- 避免「本專案如何……」「我們在這個 Repo……」「交接到 P1」等內部敘事當作對外的技術主題。可改為「靜態網站的部署與驗收」「AI Agent 的權限與稽核」等通用技術描述；**不得**把原始案例的未實作功能改寫成已驗證的通用規律。
- 作者、產品及技術本身的正式名稱（例如 Three.js、Polyfork）仍應準確標示，並保留原作者連結。對外技術敘事不等於匿名化外部創作者。
- 現有公開文章標題與 87 篇導讀有獨立編輯資料層：`research-taxonomy.mjs`、`research-leads.mjs`。新增內容應同步寫測試，避免公開文案再次混入特定網站開發紀錄。
- **重要尚未完成的範圍：** 歷史研究 Markdown 正文有些確實記載某個專案的實作、PR 與規格；本次只修正對外入口及已登錄的標題／導讀，不代表 87 份原始文章全文已全部通用化。未來應以**每篇來源核實的公開技術正文層**處理，而不是對原文做機械字串替換、隱藏不確定性或刪除原始證據。來源文件與 SHA 必須保留。
- 「已編輯導讀」不代表「已逐項事實查證」；外部測速、授權、版本與相容性仍需獨立驗證。公開展示不得把歷史完成狀態當成當前可用性。

## 公開技術正文的分層規則（P0.5）

- 目前前三批（含 P0.5 收尾追加）共有 40 篇已逐篇依原文整理的公開技術正文，登錄於 `site/src/lib/public-articles.mjs`。先顯示技術原理與限制；歷史 Markdown 保留在同一文章的可展開來源紀錄。
- `npm run audit:public` 初篩所有公開文章的專案語彙與交接脈絡，產生可回溯的 **87 篇風險清單**；此結果只是待編輯優先序，**不是內容已逐篇確認或事實已驗證**。
- 新增一篇公開正文時，必須比對真實 Markdown，避免把作者自述或歷史方案說成完成實作。技術解說、歷史原文、真實來源 SHA 與作者連結不可混淆。
- 對已編輯的文章，Pagefind 不索引原始歷史指令，避免搜尋結果把過期規劃當成建議；原文仍可由讀者自行展開查看。其他未整理文章仍照常顯示全文。
- 完整方法、第一至第三批與收尾追加文件名、結案界線見 `site/P0.5-PUBLIC-CONTENT-AUDIT.md`。

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

## 2026-11-04｜雙層搜尋契約

- **公開閱讀頁面**：既有 Pagefind 索引已編輯技術正文；未編輯的來源依原頁面現狀索引，並保留事實未驗的界線。不可宣稱此層包含全部歷史 Markdown。
- **歷史原始研究**：使用者主動切換後才下載 `original-search-index.json`，由目前 87 篇公開來源的原始 Markdown 及來源 SHA 生成；可找回被 Pagefind 排除的歷史文本。歷史結果標示「未重新查證」，不等於最新推薦。
- 兩層共用分類／標籤篩選，但互不混合排序；歷史查詢不載入第三方腳本，搜尋片段使用 `textContent` 渲染。原文資料來源包括原本就公開的治理／設計 Markdown，威脅模型則維持排除。
- 建置後 `postbuild-verify.mjs` 核對 87 篇原文的 SHA、來源路由、文字一致性；Playwright 驗證需由人主動切換並且無 JS 仍保留文章導覽。
