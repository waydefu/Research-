# Luminati／The Bells of Evermere：2.5D 像素遊戲如何做出立體電影光影？

查證日期：2026-11-03（Asia/Taipei）。  
類型：外部原作與引擎架構研究；**不是 Research- 已採用的技術、已部署功能或真機測試結果**。

## 一分鐘理解

Luminati 是一套以 Three.js 製作的 **2.5D 像素風遊戲引擎**。角色和表面保留像素美術特徵，世界則透過真正的 3D 幾何、光照、陰影與景深渲染，所以看起來像一座能走進去的微縮模型。The Bells of Evermere 是使用該引擎的瀏覽器遊戲／活動入口；**遊戲內容、引擎原始碼和我們的研究網站是三個不同事物**。

- [遊戲入口：The Bells of Evermere](https://lumina-static-584822.gitlab.io/game.html?campaign=bells-of-evermere)
- [上游 GitLab：Luminati 原始碼](https://gitlab.com/stubborn-hug/lumina)
- [上游 README：架構、執行需求、效能與授權狀態](https://gitlab.com/stubborn-hug/lumina/-/blob/main/README.md)
- [上游文件目錄：特性、架構與測試](https://gitlab.com/stubborn-hug/lumina/-/tree/main/docs)
- [AI Agent 上手文件：實作位置與契約](https://gitlab.com/stubborn-hug/lumina/-/blob/main/docs/ai/AGENT_ONBOARDING.md)

## 已由上游文件支持的設計

| 層級 | 做法（白話） | 對互動網站的啟發 |
| --- | --- | --- |
| 引擎 | Three.js r186、JavaScript ES Modules、WebGL 2 | 先明確分開渲染器與內容系統，避免資料頁與效果程式互相糾纏 |
| 2.5D 視覺 | 2D 像素素材置於 3D 場景；真實光照與陰影、景深 | 透過鏡頭、材質及構圖創造連貫空間感，而非堆疊卡片 |
| 光影與環境 | 24 小時光色、動態天候、粒子、God Rays、後製光效 | 光影可跟隨敘事狀態，但要有可停用或降階方案 |
| 資源系統 | 紋理、角色圖、道具、部分音樂與音效由程式生成 | 研究「可重現資產」與視覺一致性，不等同可直接借用原作素材 |
| 開發工具 | 遊戲、關卡編輯器、Sandbox 共用引擎 | 可以借鏡獨立實驗頁與範例場景，縮短渲染問題的定位時間 |
| 效能 | 解析度調節、光源池、批次處理、Shader 預熱 | 優先衡量 frame time、draw call 與記憶體，而非以特效數量評價 |
| 驗證 | Browser harness、Node 測試、JSDoc typecheck | 每個效果都應有可重現測試與失敗回退路徑 |

上述是上游**文件描述的能力**，不是本站測得的 FPS、耗電、溫度或品質分數。上游 README 的 1600×900／60 fps 與約 300 draw calls 為開發預算，不是跨硬體保證。

更多原始文件：
- [渲染管線](https://gitlab.com/stubborn-hug/lumina/-/blob/main/docs/architecture/RENDER_PIPELINE.md)
- [光照模組](https://gitlab.com/stubborn-hug/lumina/-/blob/main/docs/architecture/modules/lighting.md)
- [效能與測試架構](https://gitlab.com/stubborn-hug/lumina/-/blob/main/docs/architecture/PERFORMANCE.md)
- [測試與驗證流程](https://gitlab.com/stubborn-hug/lumina/-/blob/main/docs/development/TESTING_AND_VERIFICATION.md)

## 對 Research- 的採用判斷（提案，未授權實作）

**最適合借鑑的是「渲染／資產／場景／測試」分層和降階設計，不是把遊戲引擎整套放進研究館。**

1. **現在可研究，不動 production**：參考上游單一效果 Sandbox 的做法，整理相機、光源、材質與後製的獨立驗證方法。
2. **未來需有 Owner 明確授權才可做**：將 WebGL 場景接入網站；先驗證弱效能 Android、iOS Safari、無 JS 閱讀、reduced motion 及載入故障降級。
3. **不可混淆的兩件事**：一張漂亮的遊戲場景不代表研究文章已具體配圖；遊戲引擎也不能取代 Astro／Pagefind 的全文典藏與搜尋。

目前網站仍是 **Sanctum 靜態首頁＋V3 Astro 研究館**；此文件的收錄**不等於啟動 P2 3D PoC、改動 G0、美術驗收或部署**。

## 查證界線、授權與風險

- 本輪依據上游 README、原始碼專案與文件交叉核對；**未能直接操作載入後的遊戲，也未在 Android／iOS 真機測量**。實際畫質、手機穩定度、GPU 使用量與 iframe 支援均列為「未實測」。
- 2026-11-03 檢視的上游 [LICENSE](https://gitlab.com/stubborn-hug/lumina/-/blob/main/LICENSE) 顯示 **MIT**，但部分搜尋快照仍留有較舊的「尚未選授權」文字；若未來要重用程式碼、字體、圖片或聲音，必須以**實際欲使用的上游 commit 和每個資產的授權**重新核對。此處僅記錄連結與方法，未轉載上游程式或素材。
- 外部 URL 僅供使用者主動開啟；本 PR 不增加 iframe 允許名單、引入第三方腳本或複製作者資產。
- 保持原始研究 Markdown、來源與既有網站功能不變；新增本篇可由現有 catalog 自動編入，正式收錄仍取決於 PR 審查與合併。

## 驗證建議

- Markdown 連結與標題正常；沒有臆造可復現的手機效能。
- 若未來批准收錄至正式網站，再以既有 CI 驗證 catalog、Pagefind、全部來源頁面與索引；不以 CI 綠燈冒充真機測試。
