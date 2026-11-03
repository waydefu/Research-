# 01｜通用 Web 框架選型：2026 年 11 月

**判斷準則：內容型態、SSR/SEO、互動密度、資料存取模型、部署可攜性與維護成本。** 「最快」必須在相同產品和硬體測，不能用宣傳 benchmark 排名。

## 框架比較

| 技術 | 架構定位 | 適合 | 主要代價 | 官方入口 |
| --- | --- | --- | --- | --- |
| **Next.js 16** | React 全端／App Router、Server Components、Streaming、Cache Components | 內容+互動、會員、交易與產品 Web | Server/Client 邊界、Cache 失效與 RSC 安全、部署複雜度 | https://nextjs.org/docs |
| **React Router Framework Mode** | 路由 Loader/Action、SPA/SSR/SSG，由 Vite 整合 | 需要精準控制資料載入、可逐步遷移 React App | 需自行決定更多基礎設施 | https://reactrouter.com/start/modes |
| **TanStack Start** | TanStack Router + 型別安全路由、SSR、Server Functions | 高互動全端 React、型別安全路由與查詢參數 | 生態比 Next 少，特殊整合需驗證 | https://tanstack.com/start/latest/docs/framework/react/overview |
| **Nuxt 4** | Vue 全端、Nitro、SSR、模組 | Vue 團隊、SEO 與內容/會員混合產品 | 維護 Vue / Nitro 的生態依賴 | https://nuxt.com/docs |
| **SvelteKit** | Svelte 編譯、SSR/CSR/prerender、Adapters | 重視較少客户端 JS、簡潔互動與小團隊 | 不同的元件語法與生態移植成本 | https://svelte.dev/docs/kit/introduction |
| **Astro 6** | HTML 優先 + Islands；按需 Hydration | 部落格、內容型、品牌／文檔、部分互動 | 全局重度互動需設計跨 Islands 狀態 | https://docs.astro.build/en/concepts/why-astro/ |
| **Vite + React SPA** | Client-side App，選用 API 後端 | Dashboard、內部工具、離線型或登入後產品 | 首屏 SEO 與自行建立資料／登入架構 | https://vite.dev/guide/ |

## 分辨渲染方式（重點）

- **SSR（Server-Side Rendering）**：請求時在服務端先生成 HTML；不是免費、不是全部會自動快。
- **SSG / prerender**：建置時產出 HTML；適合更新週期可控的頁面。
- **CSR / SPA**：瀏覽器建立 UI，適合高度互動；需注意首屏、SEO、Bundle、載入狀態。
- **RSC**：React Server Components，是元件執行／傳輸模型，不等於 SSR 或完整後端授權模型。
- **Streaming／Suspense**：分段輸出、儘快顯示重要內容；需要正確載入與錯誤邊界。
- **Islands**：只在需要互動的元件 Hydrate；適合內容多、互動少的頁面。
- **PPR／Cache Components**：依 Next 版本設定與快取策略，需逐路由驗證，不可等同所有頁面永遠靜態。

## 新增選型維度：Agent Cost（2026-11-03）

Nolan Lawson 的 2026-10 benchmark 讓 Opus 5.5 / high effort 以同一份 Pokédex spec 在乾淨 container 中分別使用多個 framework 實作，原則上各跑 5 次，再比較 API 成本、Token、時間、LOC 與 Lighthouse。

在這個**偏 content-heavy、低互動** workload 中，Astro、Hono+htmx、Nuxt 的 Agent 成本相對低；Astro 同時產生極少 client JS。Vanilla + Vite 並沒有自動成為最低成本，表示 framework 的明確慣例也可能替 Agent 壓縮解法搜尋空間。

但這不能變成通用排名：作者只測一種 app，Lighthouse 偏向 page-load / MPA，複雜 SPA 互動沒有被充分量測，且 framework / MCP / model 版本都會變。

因此本 Repo 後續框架決策新增：

- Token / wall time。
- task pass rate / repair count。
- MCP / Skill discovery + use rate。
- generated LOC / config surface。
- Runtime / accessibility。

詳細方法與數據：[AI Framework Agent Cost](../2026-11-agent-repository-operations/11-ai-framework-agent-cost.md)。

## 快速決策

1. **公開內容比例非常高？** → Astro / Nuxt / Next；以 JS 傳輸、真實內容編輯流程測。
2. **React 技能已有、需要 SEO 和後端整合？** → Next；若想掌握 Router / Loader 則同時 PoC React Router / TanStack Start。
3. **登入後操作介面占 90%？** → Vite + React、SvelteKit 或 React Router；不應為了「流行」套 SSR。
4. **團隊主要是 Vue？** → Nuxt，先比較實際遷移代價。
5. **WebGPU 重度場景？** → 主框架選擇與 3D 引擎選擇解耦；3D 頁面可以 lazy mount。

### 對照重點與限制

- Next.js App Router 頁面與 layout 預設 Server Components；互動部分才設 Client Component。
- TanStack Start 官方已稱 **stable**，RSC 在它的文件仍列 experimental；勿混淆。
- Astro 6 採 Vite Environment API，可在開發期使用更貼近生產的 Runtime。
- React Router 有 Framework/Data/Declarative 3 種 Mode，功能不同；不要只拿 router library 的重量和全端框架相比。

**主要來源：**
https://nextjs.org/docs/app
https://reactrouter.com/start/modes
https://tanstack.com/start/latest/docs/framework/react/overview
https://svelte.dev/docs/kit/introduction
https://astro.build/blog/astro-6/
https://docs.astro.build/en/concepts/islands/
https://github.com/nuxt/nuxt/releases
