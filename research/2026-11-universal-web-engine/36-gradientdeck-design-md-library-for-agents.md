# 36｜GradientDeck UI：把真實網站整理成 DESIGN.md，給 AI Agent 當設計約束

**研究日期／來源最後核對：2026-11-06（Asia/Taipei）**
**研究狀態：初步完成（官方站內資料已核對；未逐站比對原網站，未實際讓 Agent 套用）**
**分類：UI/UX／設計系統／Agent 工具／參考資料庫**
**研究標的：**[GradientDeck UI](https://ui.gradientdeck.com/)

## 要解決什麼問題

做網站時，Agent 常因為沒有明確的視覺約束，產出「一眼就是 AI 範本」的介面（本庫 [13](13-design-performance-and-architecture.md) 的 AI 廉價感 lint）。GradientDeck 的做法是：把一個真實網站的顏色、字型、間距、元件與「該做／不該做」整理成一份 Markdown（`DESIGN.md`），放進專案根目錄，讓 Claude Code、Codex、Cursor 等 Agent 照著做。

本篇回答三件事：這個資料庫**實際有什麼**、**能證實到哪裡**、**現在就能怎麼用，哪些不能用**。

## 主要結論

- **已證實（站內資料，2026-11-06 核對）：**
  - 首頁與 `llms.txt` 都宣稱收錄 **1,286** 份 DESIGN.md，標示「Free, no account」。`library.json` 實際有 1,286 筆，與宣稱一致。
  - 主題分布（`library.json` 的 `theme` 欄位）：light 881、dark 272、mixed 133，與首頁篩選器數字一致。
  - 產業分布：agency 206、saas 189、ecommerce 170、ai 129、other 109、design 108、devtools 102、fintech 78、productivity 74、media 69、crypto 52（加總 1,286）。
  - 每筆有 `slug`、`name`、`nickname`、`industry`、`theme`、`host`、封面圖、色票（`colors`）與字型（`fonts`）；1,286 筆都有色票與字型欄位。
  - 每個風格有兩種穩定網址：精簡版 `/styles/{slug}/design.md` 與延伸版 `/styles/{slug}/design-extended.md`。`llms.txt` 自述精簡版約 3k tokens、延伸版約 5k tokens；**本研究只量到檔案大小**（以 Aesop 為例：精簡 15,229 bytes、延伸 25,750 bytes），**沒有計算 token**。
  - 精簡版的章節（Aesop 範例）：Colors、Typography、Spacing & Layout、Border Radius、Components、Do's and Don'ts、Elevation、Surfaces。延伸版另有 token 表。
- **有條件成立：**
  - 「讓 Agent 設計得像真實產品團隊」是站方的產品主張。文件本身載明：**量測值經過正規化、角色與建議是詮釋、HTML 範例是重建，不是原站元件**。因此它是「第三方詮釋的設計摘要」，不等於該品牌官方的設計系統。
  - 網站在 `llms.txt` 聲明：設計屬於被擷取的網站，DESIGN.md 只應作為自己介面的**參考**，不要拿來假冒別的品牌。這是站方聲明，不是授權條款。
- **尚待驗證：**
  - 擷取值與原網站是否一致（本研究未逐站比對）。
  - 套用到 Agent 後，成品是否真的更貼近目標風格（沒有 A/B）。
  - DESIGN.md 內容本身的著作權／授權與再散布條件（本研究只嘗試了 `/terms`，回 404，沒有窮盡搜尋條款頁；已讀的首頁與 `llms.txt` 只標示「© 2026 GradientDeck UI」，沒有運營者身分）。
  - 載入 3k–5k tokens 的實際成本與對任務品質的影響。
- **錯誤或誇大說法：** 目前沒有發現，但「1,286 份都能直接複製使用」不能成立：授權與品牌使用邊界未明。

## 來源與可重現方法

| 主張 | 原始來源 | 最後核對 | 證據級別 |
| --- | --- | --- | --- |
| 1,286 份、免費、無需帳號、支援 Claude Code／Codex／Cursor | [首頁](https://ui.gradientdeck.com/)、[llms.txt](https://ui.gradientdeck.com/llms.txt) | 2026-11-06 | 站方自述（A-） |
| 實際筆數、theme／industry 分布、欄位 | [library.json](https://ui.gradientdeck.com/library.json)（`curl` 下載後以腳本統計） | 2026-11-06 | 可重現（A） |
| DESIGN.md 章節與「正規化／詮釋／重建」聲明 | [Aesop 精簡版](https://ui.gradientdeck.com/styles/aesop/design.md)、[延伸版](https://ui.gradientdeck.com/styles/aesop/design-extended.md) | 2026-11-06 | 可重現（A） |
| 設計屬於原網站、僅供參考 | [llms.txt](https://ui.gradientdeck.com/llms.txt) | 2026-11-06 | 站方聲明（B） |
| 站台由 Next.js 與 Cloudflare 提供 | 首頁回應標頭（`x-powered-by: Next.js`、`server: cloudflare`） | 2026-11-06 | 可重現（A） |
| 樣本風格內容（Moooi、Studio Freight、Active Theory） | 各自 `/styles/{slug}/design.md` | 2026-11-06 | 第三方詮釋（B），未對照原站 |

可重現做法：`curl -sS https://ui.gradientdeck.com/library.json` 後統計 `theme`／`industry`；`curl -sS https://ui.gradientdeck.com/styles/<slug>/design.md` 讀單一風格。

## 資料庫裡哪些「現在就能參考」

以下是**候選清單，不是推薦或相容性結論**；本研究只讀了 Aesop、Moooi、Studio Freight、Active Theory 四份的內容。

- **Active Theory**（`dark`，[design.md](https://ui.gradientdeck.com/styles/active-theory/design.md)）：與本庫 [16](16-active-theory-quality-benchmark.md) 的品質基準是同一家工作室。文件的詮釋是「近乎全黑的畫布、UI 像半透明幽靈、色彩被節制到只有一個冷色強調，讓渲染的 3D 世界承擔所有色彩重量」，並用幾何無襯線處理導航、襯線處理內文。**這與「UI 退後、渲染世界當主角」的沉浸網站做法一致，可當對照。** 其色票（深紫藍）與暗金電影感的方向不同，不應照搬。
- **Moooi**（`mixed`，[design.md](https://ui.gradientdeck.com/styles/moooi/design.md)）：詮釋為「午夜展廳，奶油色基座」——全幅暗場景加大標題，之後轉成淺色目錄。可對照「從沉浸場景過渡到可閱讀內容」的節奏。
- **Studio Freight**（`mixed`，[design.md](https://ui.gradientdeck.com/styles/studio-freight/design.md)）：詮釋為「古典襯線標題＋等寬標籤、無圓角無陰影」。可對照繁中標題層級的設計。
- **進一步篩選**：依 `library.json`，`theme=dark` 且 `industry` 為 agency 或 design 的共 80 筆，`mixed` 共 32 筆，包含 Active Theory、Basement Studio、Cuberto、Unseen Studio 等。**能否貼近暗金電影感，需要人工逐一閱讀，目前未做。**

## 對採用 DESIGN.md 的網站專案的建議（設計建議，不是已執行的結果）

1. **學它的格式，不抄它的品牌。** 值得借用的是「顏色附角色、字型附尺寸與用途、元件附狀態、最後有 Do／Don't」這個結構。可以用專案自己的 design tokens 與美術方向，寫一份**原創**的 `DESIGN.md`，讓之後的 Agent 不必重讀整份歷史文件就能守住風格。這件事尚未做。
2. **當作比較基準，不當素材。** 想知道某個細節（例如暗色底上的灰階層級、毛玻璃的使用克制度）別人怎麼處理，可以讀對應風格；不要把別人的色票、字型組合整份套進自己的專案。
3. **成本與品質要先量。** 單份 3k–5k tokens 不算大，但 1,286 份不可能全載入；本庫 [`04-cost-context-and-routing`](../2026-11-agent-repository-operations/04-cost-context-and-routing.md) 的原則適用：只載入選定的一至兩份，並做有／無 DESIGN.md 的 A/B 比較後再決定。
4. **授權界線。** 在確認 DESIGN.md 本身的授權前，不將整份內容複製進公開研究庫 或其全文索引；本篇只引用事實與簡短描述。

## 選項比較

| 方案 | 好處 | 代價 | 風險 |
| --- | --- | --- | --- |
| 載入某個第三方 DESIGN.md | 立即有明確的風格約束 | 3k–5k tokens；風格可能和自己的專案不合 | 內容是詮釋而非官方；授權不明；可能造成品牌近似 |
| 寫專案自己的 DESIGN.md | 精準貼合暗金方向；完全原創；可長期維護 | 需要整理 tokens 與規則 | 需持續與實際 CSS 同步，否則會過期 |
| 不用，只靠現有文件 | 無額外成本 | Agent 需讀大量歷史文件，風格約束較散 | 容易回到範本感 |

## 驗證計畫

- [ ] 抽樣 5 個風格，對照原網站的色票與字型，記錄偏差
- [ ] 找出並讀懂 DESIGN.md 內容的使用條款，或聯絡站方確認
- [ ] 以同一任務做「有／無 DESIGN.md」的 A/B，由人工盲評視覺相近度與 token 成本
- [ ] 寫出專案原創 DESIGN.md，再用同一流程驗證
- [ ] 人工審核結論

## 是否採用（需明確批准）

- **尚未批准。** 本篇是資料庫的盤點與可用性評估，不代表已安裝、套用或通過驗收。
- 影響範圍：僅限研究；未改動任何設計 tokens 或網站程式。
- 回退方式：本篇為新增研究，刪除即可還原。

## 未能確認的事

- 站台運營者、聯絡方式、資料擷取方法與更新頻率；
- DESIGN.md 的使用條款與可否再散布；
- 擷取精度；
- 實際對 Agent 產出品質的影響。

## 修訂紀錄

- 2026-11-06：初版。
