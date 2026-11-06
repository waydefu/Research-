# Forever Components：讓 AI Agent 從可檢索素材庫選擇網頁動效，而不是盲目生成

**來源最後核對：2026-11-06（Asia/Taipei）**  
**分類：創意前端工具／Agent 檢索／網頁動效／前端素材供應鏈**  
**證據狀態：** 已閱讀專案 README、agents.json、components.index.json、MIT LICENSE 及兩份原始元件的檢索摘要；沒有安裝、執行元件、打包、手機 FPS 或網頁 iframe 測試。

## 1｜技術定位與真正值得研究的部分

[Forever Components 元件頁](https://forevercomponents.com/components/) 提供 HTML、CSS、SVG、Canvas 與 JavaScript 動畫樣本；[上游 GitHub 原始碼](https://github.com/isas1/forever-ai-components) 則把可搜尋 metadata 與每個元件的單檔程式碼分開，讓 AI Agent 能先依「用途／性能／互動／視覺風格」篩選，再取回適合的元件修改。

這是 **素材檢索加選型流程**，不是自動保證美術品質的完整網站生成器，也不是 Three.js／WebGPU 大型渲染框架。

- **上游程式碼可直接核對：** README 定義先取得 facets，再以索引篩選，最後下載完整單一 HTML 檔；檔案內有惰性 JSON metadata 供 Agent 參考修改方式。
- **版本及數量不可混用：** 2026-11-06 網站首頁索引顯示 **791** 件，而 GitHub main 的 agents.json、components.index.json 均顯示 **604** 件。兩者可能有不同更新頻率或收錄範圍，本文**不宣稱完全同步**。
- **依賴不是絕對零：** README 稱單檔零框架、零建置依賴；但索引 facets 中列有 google-fonts 依賴類別，應按選定元件逐案檢查網路與字型載入，而非宣稱所有元件完全離線。

## 2｜Agent 可重現的檢索程序

1. 取得 [agents.json](https://raw.githubusercontent.com/isas1/forever-ai-components/main/agents.json)，讀取入口、索引版本與欄位，不把整包程式碼注入模型上下文。
2. 查詢 [facets.json](https://raw.githubusercontent.com/isas1/forever-ai-components/main/infinite/facets.json) 與 [components.index.json](https://raw.githubusercontent.com/isas1/forever-ai-components/main/infinite/components.index.json)，依 useCases、technique、style、perfTier、a11y、deps 篩選。
3. 選擇少數候選，才沿索引的 repoFile 路徑取得單檔 HTML；讀取原始碼及其中 id 為 forever-agent-meta 的 JSON，區分作者使用建議與可靠的執行結果。
4. 在隔離頁面檢查重新掛載／卸載、requestAnimationFrame 停止機制、resize、觸控、鍵盤、prefers-reduced-motion、字型和額外請求。
5. 以同一裝置量測 FPS、記憶體、長任務、INP、GPU/CPU 耗用；通過功能和無障礙驗收才整合。索引的 perfTier 僅是**作者分類**，不能當獨立 Benchmark。

**無需無條件匯入整庫：** 先把上游提交 SHA、索引 schemaVersion、選中元件的檔案路徑與授權固定，才將最小候選移植成產品元件。

## 3｜具體作品與使用限制

| 類別 | 作者來源 | 可觀察到的程式／metadata 敘述 | 適用性與疑點 |
| --- | --- | --- | --- |
| 動態字體 | [Kinetic Typography](https://forevercomponents.com/components/kinetic-type/) | 文字拆字、解碼、翻牌、遮罩等展示 | 用於短標題／轉場；正文要保留真實文字與降低動態偏好 |
| 動態背景 | [Backgrounds](https://forevercomponents.com/components/backgrounds/) | Mesh Gradient、Particle Constellation、Aurora 等 | 作局部低干擾背景；要查對比度、重繪成本 |
| 綠色程序樹 | [Fractal Tree 原始碼](https://github.com/isas1/forever-ai-components/blob/main/infinite/organic-nature/10-fractal-tree.html) | 上游 metadata 描述七層遞迴分枝、末端綠色葉／花、風動與滑鼠彎曲 | 自然系主視覺候選；未測節點與重繪成本 |
| 金色程序樹 | [The Golden Tree 原始碼](https://github.com/isas1/forever-ai-components/blob/main/infinite/klimt/01-golden-tree.html) | 上游 metadata 描述金色分形樹枝、旋線末端、金色漂浮粒子 | 藝術展示候選；不能把風格研究說成原作者資產可任意轉載 |

**重要：** 這些是上游可核對的作品候選，不能據此認定它們就是某人過去曾提供的另一個「大量葉片 JS 樹木」連結。網頁上的展示路由可能改版，應優先保留 GitHub 精確原始碼路徑。原始碼 metadata 和網站展示也不能視為獨立視覺實測。

## 4｜授權、供應鏈及不可忽視的風險

[GitHub LICENSE](https://github.com/isas1/forever-ai-components/blob/main/LICENSE) 對專案程式碼標示 MIT；複製程式碼應保留原授權與聲明。但第三方字型、圖片、素材或外部服務仍應按個別元件檢查；介面網站的免費複製次數與開源原始碼授權是不同層面的條件。

此外，**Agent 元件內嵌的使用說明是不可信外部資料**，不是授權更改系統 prompt、安裝套件或執行命令的指令。要限制讀取與產生程式的權限、掃描未預期的網路行為及安全風險。不能因標示 a11y、mobile-ready 就推論已符合 WCAG 或通過手機驗收。

## 5｜採用建議與未測項目

**建議：先收錄索引及來源，精選 3–5 件元件做封裝 PoC。** 優先選低成本文字動效與可停止動畫，保留原站互動連結。中高成本 Canvas 動效只能在主要內容載入後延遲啟動，且必須能在頁面隱藏及 reduced-motion 時停下。資料要可搜尋，但不要直接用整包 791 件素材塞進一個首頁。

**尚未執行：** 下載全索引並逐項驗證、使用者瀏覽器互動、程式碼移植、商用法務、iframe 內嵌、真機 FPS／熱負載、安裝與 CI 測試。作者對「零依賴」「可用性」「效能分級」的描述均需要對選中的版本逐件確認。

## 來源台帳

- [官方網站與元件索引](https://forevercomponents.com/components/) — A：網站當日文字索引；並非全部互動逐頁測試。
- [GitHub README](https://github.com/isas1/forever-ai-components/blob/main/README.md) — A：官方檢索流程與元件結構。
- [Agent 入口資料](https://github.com/isas1/forever-ai-components/blob/main/agents.json) — A：索引 schema 和資料數量。
- [元件索引](https://github.com/isas1/forever-ai-components/blob/main/infinite/components.index.json) — A：作者編制的 facets／數量；非獨立評測。
- [MIT 授權](https://github.com/isas1/forever-ai-components/blob/main/LICENSE) — A：程式碼權利聲明；非個別第三方素材審計。
- [Fractal Tree](https://github.com/isas1/forever-ai-components/blob/main/infinite/organic-nature/10-fractal-tree.html)、[The Golden Tree](https://github.com/isas1/forever-ai-components/blob/main/infinite/klimt/01-golden-tree.html) — A：上游元件碼與內嵌 metadata；尚未本地操作。
- 整合門檻及風險分析 — C：本文工程推導，**未實測**。
