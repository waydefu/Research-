# 02｜Next.js 16 系列：值得用在哪裡、不能掉進哪些坑

**日期：2026-11-02。** GitHub release list 可確認穩定 **16.4.3（2026-10-23）**；16.5.x 為 Canary，不能把 preview 當穩定。

## 整體能力

- **App Router**：路由、巢狀 layout、error/loading boundary、route handlers。
- **Server / Client Components**：server 端讀取機密與資料，client 只處理需要互動的部分。要確認 bundle 邊界，**Client Component 的程式碼會交給瀏覽器**。
- **Server Functions / Actions**：提供表單與伺服器變更入口；**每個進入點仍要做認證、授權、輸入驗證、CSRF 防護與速率限制（依威脅模型）**。
- **Cache Components**：明示使用 \`use cache\`、\`cacheLife\`、\`cacheTag\` 等，需設計失效條件、個人資料隔離與錯誤 fallback。
- **圖片/字型/Metadata**：有整合工具，但 CDN、圖片最佳化、部署成本需核算。
- **Turbopack**：建置效能優化，不能宣稱使用它就增加瀏覽器 FPS。

## 重大安全事件（不可忽略）

- 2026-10-14 Next 官方發出**非常重要的安全更新**：受影響的 \`use cache\` Typed Arrays 場景可能允許未授權遠端程式碼執行，Image Optimization 上游函式庫亦有風險。
- 當時官方修補：16.4.1 / 15.5.28；已發現 16.4.3 穩定發布，**部署仍應查當日安全公告並升到所屬分支的最新安全版**。
- 2025～2026 React RSC 也曾有 RCE / DoS 等安全公告。即使只用 Next，仍必須看**React、Next 與相關依賴**的 advisory。
- 不可把 Edge Middleware/Proxy 當作資料庫權限的唯一把關；敏感資料和角色權限須在 Server/DB 每次查詢執行。

來源：
https://nextjs.org/blog/nextjs-security-update-october-14-2026
https://github.com/vercel/next.js/releases/tag/v16.4.3
https://react.dev/blog
https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
https://vercel.com/changelog/next-js-may-2026-security-release

## Next 適用情況

**推薦：**
1. 需要公開 SEO 與登入後互動的混合產品；
2. React 需要整合 SSR、圖片、metadata、Server Actions 和 Route Handlers；
3. 團隊願意理解 RSC 邊界與 Cache 策略，也有安全更新維護能力。

**不優先：**
1. 純靜態 1～3 頁網站；
2. 純登入後 Dashboard、無公開索引與 SSR 需求；
3. 需要零服務端運維、完全靜態部署且沒有合適 adapter 的專案；
4. 想移植舊有大量 Client-only 網站，但還未定義資料邊界、元件拆分與風險。

## 實務上必須量測的東西

| 項目 | 驗證 |
| --- | --- |
| 首屏 | LCP、Hydration、實際 Client JS、圖片載入 |
| Streaming | 各段 Suspense reveal、等待時間、失敗恢復 |
| 快取 | 匿名與登入交錯、Cache Tag 清除、跨租戶與版本佈署 |
| 部署 | Node / Edge / Cloudflare adapter 能力、冷啟、DB 連線 |
| 安全 | RSC advisory、Route Handler/Server Action 授權、secret exposure |
| 維護 | 更新至安全版、Lockfile、可重現 CI |

**結論：Next.js 是強候選，而不是所有 Web 都要用的「最強」預設。**
