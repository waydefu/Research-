# 08｜2026 Web 安全、測試、CI/CD 與部署策略

**不把「選用知名框架」當成安全。** 2026-10 React Server Components/Next.js 的實際高危漏洞清楚顯示需要維護安全修補鏈。

## 對新專案的最低安全基線

| 類型 | 典型問題 | 保護措施 |
| --- | --- | --- |
| AuthN/AuthZ | 登入後越權查看其他人的資料 | 服務端逐資源授權、租戶隔離、RLS 視需求 |
| Cache | 共享 cache 泄露個人資料、失效邏輯錯誤 | 按身份/租戶隔離 cache、失效測試 |
| RSC/Server Functions | 服務端函式被當成內部程式，漏驗授權 | 將其視作公開可呼叫 API；檢查所有入口 |
| XSS/CSRF | 攻擊者執行腳本/偽造操作 | 輸出轉義、CSP、CSRF 防護、SameSite、Token |
| SQLi/SSRF | 不安全輸入導致越界 | 參數化查詢、外部 URL allowlist、防內網探測 |
| Supply Chain | npm 依賴、CI Action、Build Script | Lockfile、漏洞掃描、Actions SHA pin、最小權限 |
| Secrets | 公開前端、日誌和 preview 流出金鑰 | 環境隔離、Secret Store、CI Redaction、rotation |
| Storage | 未授權檔案讀寫、錯誤 URL 簽章 | Bucket policy、ACL 測試、上傳限制 |
| Deployment | Edge / Node runtime 不相容、冷啟/連線故障 | 先 build+run preview，再產線 |
| Observability | 錯誤發生但不可重現 | 日誌、Trace、Metrics、部署版本與 request ID |

## 2026-10 必須記錄的安全公告

- 2026-10-14 **Next.js** 發布 \`use cache\` RCE 與圖片最佳化依賴修補；最初 patched 16.4.1 / 15.5.28。當前記錄的穩定版 16.4.3 需配合當天 advisory 確認。
- **React RSC** 同期有高危安全公告；RSC 套件更新應和應用框架的相容性同步。
- 任何 AI 生成的 Server Action 不可跳過權限檢查；PR 需要獨立測試與證據。

來源：
https://nextjs.org/blog/nextjs-security-update-october-14-2026
https://github.com/react/react/security/advisories
https://github.com/vercel/next.js/security/advisories

## CI/CD 範例 Gate（規範，非已安裝）

\`\`\`text
PR
 ├─ lockfile / licenses / SCA
 ├─ typecheck + lint
 ├─ unit tests + API contract / AuthZ negative tests
 ├─ build (runtime/edge adapter)
 ├─ E2E (Chromium + Firefox + WebKit)
 ├─ accessibility + CWV/lab budget
 ├─ preview deploy smoke test
 └─ human approval before protected branch/deploy
\`\`\`

- CI 綠燈只意味已設定的檢查通過，不表示零漏洞。
- 對資料刪除、Migration、Secrets 變動、IAM、正式部署、合併需要明確批准。
- 自動生成的建議不能直接推送到其他 Repo。
- 観測建議用 OpenTelemetry traces / metrics，JavaScript Logs SDK 在官方文件仍標示 Development；瀏覽器 instrumentation 也可能是 Experimental。

## 部署平台評估

- **Vercel**：Next 原生整合佳，但須確認服務商定價、限制與可攜性需求。
- **Cloudflare Workers**：官方有 Astro、React Router、Next/OpenNext、TanStack Start、Nuxt 等 full-stack 適配；不保證所有 Node API 一致。
- **Node Server / Container**：對長連線、特定 native add-ons、常駐進程提供較大控制權；運維由團隊負擔。
- **靜態 CDN**：純靜態或獨立 API 設計可降低 runtime 複雜度，適合內容型站點。

來源：
https://developers.cloudflare.com/workers/static-assets/routing/full-stack-application/
https://opentelemetry.io/docs/languages/js/
https://playwright.dev/
https://docs.github.com/en/actions
