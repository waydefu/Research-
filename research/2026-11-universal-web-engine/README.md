# 2026/11｜通用 Web 工程技術與高階視覺架構

**研究日期：2026-11-02（Asia/Taipei）**　**範圍：通用，不針對小說、遊戲網站或特定品牌**  
**研究狀態：** 官方文件／原始專案交叉研究已整理；**沒有宣稱完成同場景基準測試**。不代表已在其他 Repo 安裝或實作。

> 核心觀念：**先挑正確的網站架構與資料邊界，再挑渲染引擎和特效。** 高相容、性能、安全、可維護性應同時考慮。

## 完整研究目錄

1. [01｜框架大比拚：Next.js、React Router、TanStack Start、Nuxt、SvelteKit、Astro](01-framework-selection.md)
2. [02｜Next.js 16：App Router、RSC、Cache、安全與部署](02-nextjs-deep-dive.md)
3. [03｜前端 UI／狀態／樣式與互動技術](03-frontend-ui-and-state.md)
4. [04｜Backend、API、Database、ORM、Auth](04-backend-data-and-auth.md)
5. [05｜TypeScript、Node、Vite、工具鏈、Monorepo](05-runtime-build-and-dx.md)
6. [06｜WebGPU、WebGL、3D、GPU Compute 與降級](06-graphics-and-compatibility.md)
7. [07｜效能預算、可及性與可量測指標](07-performance-and-accessibility.md)
8. [08｜安全、測試、CI/CD、供應鏈](08-security-testing-and-deployment.md)
9. [09｜三種參考技術棧與從舊系統遷移的策略](09-reference-stacks-and-migration.md)
10. [10｜28 個頂級互動作品：美術指導與 UX 規範](10-creative-direction-and-reference-sites.md)
11. [11｜Motion、3D Rendering、Shader 與電影級特效技術](11-motion-graphics-and-rendering.md)
12. [12｜70 個 GitHub 候選及 Top 18 深入比較](12-github-creative-ecosystem.md)
13. [13｜高階 UI 設計系統、六種裝置、三套 Creative Stacks、Top 20 評分](13-design-performance-and-architecture.md)
14. [14｜十種特效 Rendering Pipeline／偽碼與五個 PoC 驗收](14-effects-recipes-and-poc-validation.md)
15. [15｜55 項來源條目、證據層級、衝突處理與決策閘門](15-creative-web-evidence-and-adoption.md)
16. [SOURCES｜原本通用 Web 技術的來源與查證索引](SOURCES.md)

## 版本快照（2026-11-02 查證）

| 技術 | 可確認狀態 | 研究影響 |
| --- | --- | --- |
| Next.js | **16.4.3 穩定版**（2026-10-23）；16.5 Canary 是預覽，非穩定 | 新專案使用有安全修補的穩定版本 |
| React | **19.3**（2026-09-09） | ViewTransition 和 Fragment Refs 已穩定；RSC 安全更新仍需注意 |
| Nuxt | **4.6.2**（2026-10-16） | Vue 生態全端候選 |
| Astro | **6.0**（2026-03-10） | 內容優先、Islands、小 JS 包 |
| Vite | **8.0**（2026-03-12） | Rolldown 統一建置；建置加速不等於網站執行加速 |
| TypeScript | **6.0 穩定**；7.0 beta 有官方公告 | 大型專案的型別檢查與相容風險 |
| Node.js | **26 LTS**（2026-10-28 官方列表） | 優先 LTS 並匹配部署平台 |
| TanStack Start | 官方文件明示 **Stable** | 以 TanStack Router 為核心的全端 React 方案 |
| Prisma | v7 可用；**v8 尚為 RC**（官方 2026-10-30） | 不可無意用 npm latest 把 7 換成 8 |

日期來源在 [SOURCES](SOURCES.md)。**新舊版衝突時以官方當日 release 與 security advisory 為準**。

## 結論：不是「Next.js 通殺」

| 場景 | 首選候選 | 排除條件／另選方向 |
| --- | --- | --- |
| 公開 SEO、SSR、會員／交易型應用 | **Next.js** 或 **Nuxt** | 若不願承擔 RSC / cache / SSR 運維，考慮 React Router |
| 內容、文件、行銷、出版 | **Astro 6** | 大量跨區共享即時狀態時，可能要走全端框架 |
| Web App 控制台、重度操作界面 | **Vite + React** 或 **TanStack Start／React Router** | 不需要 SSR 就先別增加 SSR 複雜度 |
| 極低 JS 與小團隊快速產品 | **SvelteKit** | 實際看生態套件、團隊技能 |
| 3D／沉浸式 Web | **App Shell + 一個 3D Renderer** | 不把所有 UI 畫成 Canvas；需 GPU 不可用的回退 |

## 採用原則

1. **一個主框架 + 一個主渲染器（如果需要）**，避免重複依賴。
2. 先定義**資料型態、敏感性、SEO、權限、安全、可部署平台**，再選 SSR/CSR/SSG/Islands。
3. 首屏與互動指標：LCP、INP、CLS；動態介面另測長任務、FPS、記憶體、裝置耗電。
4. CDN、Edge、Serverless、傳統 Node 均可，但**不假設具備相同檔案系統、連線生命週期或 Node API**。
5. 除非實際量測，**不宣稱任何框架普遍最快、相容性最高或永遠最省 Token／成本**。

本 Repo 只保存研究與技術選型，**不會自動修改別的 Repo、CI、Hermes 或本機設定**。


## Creative Web 深化研究增量（2026-11-02）

**本次新增 10–15 篇，保留原有 01–09：**面向世界級 Web Creative Development 的獨立研究延伸，不取代現有的前端／架構／相容性章節。

- **網站與視覺語言：**28 件案例（來源強度 A／B／C），涵蓋 Active Theory、Resn、Dogstudio、makemepulse、Hello Monday、Locomotive；部分有作者工程說明，未在真實瀏覽器逐站測量。
- **Open Source：**70 個 GitHub 存在性、授權 metadata 與維護快照；其中 18 個檢查官方 release／工程選型與導入風險。未做同條件 Bundle/Android/iOS Benchmark。
- **實作研究：**WebGL2、WebGPU/TSL、WGSL、GLSL、PBR、後製、GPU particles、SDF、fluid、GSAP/Motion/Rive 等的性能代價與跨端降級。
- **可轉成開發規範：**8 類 Design Tokens、非模板化 AI 視覺檢核、三種 Creative Stack、10 種最小 Rendering Pipeline／偽碼、5 個 PoC 的可重做驗收、Top 20 五維研究序位分。
- **尚未完成：**第三方作品 28 個逐頁功能 Walkthrough、真機 GPU/FPS/功耗、依賴完整漏洞掃描、真實 Bundle size；凡缺實測保留 Unknown。研究未安裝套件、未修改其他 Repo、未授權部署或合併。

**方法與來源：**[Creative Web 證據台帳](15-creative-web-evidence-and-adoption.md)，**查證日期 2026-11-02**；研究評級不代表產品測試得分。
