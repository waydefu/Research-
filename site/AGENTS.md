# site/ — THE OBSERVATORY（現行 V3 與正式首頁）

> **接手入口（2026-11-03）**：[HANDOFF-CURRENT.md](./HANDOFF-CURRENT.md)。先重新查 main / open PR / CI；本檔中 P0 限制保留歷史脈絡，不可把 V2 逆向設為 root。

## 目標
目前正式首頁是 Sanctum 暗金神殿，V3 是站內可讀、可搜尋的繁體中文靜態研究館。研究 Markdown 保持在原目錄，不複製。**尚未實作可跨頁飛行的正式 Three.js 3D 世界**；P0 僅指歷史內容館階段。

完整規格：`research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap.md`；
執行手冊：`research/2026-11-universal-web-engine/20-v3-chatgpt-5-6-execution-brief.md`。

## 優先順序與授權
Owner 最新對話指示 > 本檔與最新交接書 > 19 號現況修訂 > 歷史 18 號規劃；有衝突先核實 main、PR、CI 與授權，涉及新決策請 Owner 確認。
可以在 `site/` 內新增、修正，執行測試，在功能分支推送與開 PR。
修改 `site/` 外任何檔案、workflow、Pages 或 repo 設定，加入未列技術、合併、部署、刪除檔案，皆要先獲得 Owner 同意。
`research/`、`docs/`、`showcase/` 為唯讀資料來源。

## 技術與品質
Astro 6 靜態輸出、TypeScript、Astro Content Collections、remark/rehype、Shiki、Pagefind；後續階段才導入 Three.js、GSAP、Blender GLB。
不使用 React/R3F、Next.js、WebGPU-first、額外的捲動接管、CDN 字體與腳本。
**現行路由**：根首頁 `/Research-/` 是 Sanctum；V2 在 `/Research-/v2/`；V3 研究典藏與搜尋在 `/Research-/v3/`。根路由由 `site/scripts/unify-home.mjs` 組裝；不要恢復歷史 V2 root。
`docs/governance/THREAT-MODEL.md` 不能出現在站內路由、搜尋結果或公開索引；請注意原 GitHub Repo 仍是公開的。
研究互連轉站內路徑，第三方來源保留；本站 Repo 的 PR／Ruleset 連結顯示純文字。來源 SHA 用文字顯示。
正文、搜尋、導覽在 DOM，無 JS 仍能閱讀文件；桌機手機都需要可用的表格、程式碼捲動、鍵盤導覽。
主視覺拒絕卡片式 SaaS 模板，採繁體中文與有層次的字體；美術定案留到 P1。
**任何未實測效能或相容性只能回報未量測，不得宣稱通過。**

## 驗收與回報
`npm run check`、`npm run build`、Markdown 全量頁面與連結檢查、Pagefind 中文搜尋測試、無 JS/axe、360/768/1440px/reduced-motion 截圖。
本階段 Gate 不通過時標為未完成，禁止以 CI 綠燈代替實測。
PR 說明需列：結論、變更檔案、驗證證據、未量測項目、需要 Owner 決定的事。
