# 03｜Frontend UI、State、CSS、表單與可及性技術

**重點：** 高品質 Web UX 是**元件正確、資料清楚、可操作、低 JS、裝置相容**，而不是動畫框架數量。

## 基礎組合

| 層次 | 候選 | 何時用 | 注意事項 |
| --- | --- | --- | --- |
| 語言 | TypeScript 6 + 原生 ES Modules | 需要健全大型模組與錯誤檢查 | TS 是靜態檢查，API 邊界仍需 runtime validation |
| 元件 | React 19.3／Vue／Svelte | 依團隊技術與生態選一個 | 避免「同一區域三種 UI 框架」 |
| 樣式 | 原生 CSS、CSS Layers/Container Queries、Tailwind CSS v4.3 | 高可維護性、響應式 | 每個方案都要設計 token，不要把 class 當設計系統 |
| 無頭元件 | Radix UI / React Aria / shadcn/ui | 對話框、選單、ComboBox、鍵盤語意 | shadcn/ui 是可複製元件，不是有完整產品規格的 design system |
| 表單 | React Hook Form / TanStack Form + Zod | 大量欄位、驗證、多步驟 | server 一律再次驗證，Zod 不處理授權 |
| Data fetching | TanStack Query，或框架原生 Loader/Server Components | 客戶端 cache、invalidation、重試與 optimistic UI | 避免同一資料多套 cache 相互衝突 |
| Client state | useState/context；必要時 Zustand | 小型 → 中型共享狀態 | 不要將遠端資料和 UI state 混在同一 Store |
| Motion | CSS/View Transitions；特定需求 GSAP/Motion/Rive | 按需動畫與狀態機 | 尊重 reduced-motion、監控主執行緒 |
| UI 測試 | Playwright、axe-core（輔助）、人工螢幕閱讀器 | 操作流程和可及性 | 自動掃描無法證明所有無障礙需求都成立 |

## 2026 必須知道的變化

- React 19.3（2026-09-09）已讓 \`<ViewTransition />\` 等 API 穩定；只有 Transition 更新會依設計觸發，不是每次 state change 都自動有動畫。
- Tailwind CSS v4.3（2026-05）擴充 utilities；不等於必須使用 Tailwind。
- 原生 View Transition API 逐步改善，但跨瀏覽器支援仍需查明；「可用於所有手機」需要實測。
- CSS Container Queries、Subgrid 與現代 layout 通常比為每種 viewport 寫大量 JS 監聽更易維護。

## 通用的狀態分層

\`\`\`text
Server / Database truth
    ├── API / Server Functions / Loader（Auth + Validation）
    ├── Client remote cache（TanStack Query / Router data）
    └── Local UI State（React/Vue/Svelte 狀態）
UI design tokens → Semantic HTML → A11y → Animation enhancement
\`\`\`

**若使用 Next RSC：** 先測框架原生 fetch/cache 與 Server Functions 的需求，再判斷是否需要 TanStack Query；不是每個頁面都再套一層。

## 選擇原則

1. 先做語意化 HTML、focus trap / keyboard UX 和表單錯誤狀態。
2. 開發 Design Token：color, type, spacing, radius, elevation, motion, z-index, breakpoints。
3. 對「互動很多的畫面」先量測 Client JS、Long Tasks 和 INP。
4. 只為真需求添加 state framework、動畫 SDK 和重型 components。
5. 資料防越權與輸入驗證**放在 server**，不是靠 React 表單。

來源：
https://react.dev/blog/2026/09/09/react-19-3
https://tailwindcss.com/blog
https://www.radix-ui.com/primitives
https://react-spectrum.adobe.com/react-aria/
https://ui.shadcn.com/
https://tanstack.com/query/latest
https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
