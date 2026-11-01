# 09｜三種可用的參考技術棧，以及從舊系統推翻重建

**下列是研究組合，不是目前已安裝或實測。** 一個產品先選一個主要前端框架，依實際需求增減。

## A｜全端 SaaS / 商業網站（以 React 為主）

\`\`\`text
Next.js 16.4.x + React 19.3 + TypeScript 6
  ├─ App Router / Server Components / Streaming
  ├─ Semantic DOM + CSS / Tailwind + Accessible primitives
  ├─ Server Actions / Route Handlers with AuthZ & runtime validation
  ├─ PostgreSQL + ORM (Drizzle or Prisma 7 stable)
  ├─ CDN / Object Storage
  └─ Playwright + Unit Tests + CI + Observability
\`\`\`

**何時好：** 公開 SEO、會員、個人化、表單、資料型產品同時存在。  
**何時不好：** 純靜態、只要 SPA、團隊不想維護 SSR/cache/RSC 和安全更新。  
**風險：** Next Cache、跨租戶資料邊界、Server Action 權限、部署成本。

## B｜高效內容／文件／知識站

\`\`\`text
Astro 6 + TypeScript 6
  ├─ Static / Hybrid rendering
  ├─ Islands (only interactive widgets hydrate)
  ├─ CSS / Tailwind as needed
  ├─ Content collections + Search / CMS adapter
  └─ CDN + perf / accessibility / SEO checks
\`\`\`

**何時好：** 編輯內容多、公開 SEO、互動不密集。  
**注意：** 動態使用者資料與跨 Islands 狀態的代價需 PoC，不要只看靜態首屏。

## C｜高互動專業工具／3D 選配器

\`\`\`text
Vite 8 + React 19.3 / SvelteKit / TanStack Start (擇其一)
  ├─ TypeScript 6 + typed domain model
  ├─ DOM UI shell, Accessible interaction
  ├─ API (Hono / Fastify / framework-native)
  ├─ One renderer only: Three.js TSL / PlayCanvas / Babylon.js
  ├─ worker + optional OffscreenCanvas
  ├─ WebGPU → WebGL2 → Basic DOM fallback
  └─ data correctness tests + perf budget + browser/device E2E
\`\`\`

**何時好：** 儀表板、互動建模、可視化工具、重度操作介面。  
**注意：** 3D 資產、GPU 能力和實際數值必須分開驗證。

## 不值得「無腦堆」的組合

- Next + Nuxt + Astro 全部一起引入；
- React Query + 框架 fetch cache + 全域 store 做同一份資料的三套狀態；
- GSAP + Anime.js + Motion + Rive 同時處理相同動畫；
- Three + Babylon + PlayCanvas 共同繪製同場景；
- 無基準測試就為了速度換 Bun／Edge／WebGPU；
- 為了追新工具，直接用 Prisma ORM 8 RC 遷移已有 Prisma 7 DB。

## 推翻舊站的五段式遷移

1. **Baseline**：盤點路由、Auth、DB schema、API、部署環境、流量與現有 CWV，凍結最小可比較樣本。
2. **選型 PoC**：同內容、同設計、同互動流程，用 2～3 種方案比較**品質、成本、總維護工作量**。
3. **Strangler migration**：先替換可隔離的頁面或 bounded context；保持 API contract／資料一致性；不要一次重寫所有資料模型。
4. **Shadow / Parallel**：新舊系統同時驗證、校對結果、測資遷移、建立緊急回退與 Feature Flags。
5. **正式切換**：經明確批准，發版後持續監控錯誤、INP、LCP、DB、成本；保留 rollback。

## 決策評分表（評分架構，非評測結果）

| 面向 | 建議權重 |
| --- | ---: |
| 正確性／權限／可回退 | 25% |
| 相容性／可及性 | 20% |
| 用戶體驗與實機效能 | 20% |
| DX / 可維護性與測試 | 15% |
| 部署可攜與運維 | 10% |
| 費用（架構 + 使用量 + 後續遷移） | 10% |

只給出權重，**不在沒有 benchmark 時憑空填框架分數**。
