# 04｜Backend、API、Database、ORM 與身份驗證

**先選資料與運行環境，再談框架。** Edge、Serverless、傳統 Node、WebSocket 常駐服務的限制不同。

## API 層

| 候選 | 核心用途 | 優點 | 限制 |
| --- | --- | --- | --- |
| Next.js Route Handlers / Server Functions | 小中型全端產品的服務端功能 | 與 App Router 緊密整合 | 必須逐入口檢查授權和 cache；非萬用微服務 |
| Hono | Web Standards、Workers/Node/Bun/Deno 的輕量 API | 跨 Runtime、輕、易建立 REST | 需要自行設計較多領域架構 |
| Fastify | 高吞吐 Node API 與 Plugin | schema/validation、生命週期、插件 | Node 特定部署考量 |
| NestJS | 大型後端的 DI、模組、可測性 | 明確結構和多開發者維護 | 初期抽象／維護成本較高 |
| Cloudflare Workers | 全球 Edge API + 靜態資產 | 同部署可整合 assets 與 API | Node 相容層、CPU/DB 連線與外部服務限制 |

來源：
https://hono.dev/docs
https://fastify.dev/
https://docs.nestjs.com/
https://developers.cloudflare.com/workers/static-assets/routing/full-stack-application/

## 資料與快取層

| 選項 | 適用場景 | 警告 |
| --- | --- | --- |
| PostgreSQL | 多使用者、關聯資料、交易、一致性 | 索引、交易、連線池和備份要設計 |
| SQLite | 單機、嵌入式、小型應用、某些 Edge 服務 | 多機寫入、並發與備份要核對實際架構 |
| Redis | 熱點資料快取、Rate limit、佇列相關工作 | 不是取代主資料庫；TTL/一致性與記憶體成本 |
| 物件儲存 S3/R2 等 | 媒體、大型檔案、版本化資產 | 權限、費用、私密 URL、刪除與 retention |
| 全文／向量搜尋 | 大量文件／語意檢索 | 索引 freshness、費用與相關性評測 |

## ORM 選擇（2026 特別注意）

- **Drizzle**：SQL 風格 TypeScript schema 和可控 SQL；適合願意直接理解 SQL/遷移的工程。
- **Prisma ORM 7**：成熟的 typed client、migrate、studio 與使用者群；但要按官方版本鎖定。
- **Prisma ORM 8**：截至 2026-10-30 **仍是 RC**。官方明言 \`npm install prisma\` 可能取到 8 RC，且 CLI/API 大幅改動；既有 7 專案應同時鎖定 \`prisma@7\`、\`@prisma/client@7\`，**不要在 CI 無意升版**。

重要參考：https://www.prisma.io/docs/orm/release-status  
https://www.prisma.io/docs/orm/v7  
https://orm.drizzle.team/docs/overview

## 身份驗證與授權分開

- **Authentication（身份驗證）**：確認使用者身分（Session、OAuth/OIDC、Passkey 等），候選如 Auth.js、Better Auth、平台託管 Auth。
- **Authorization（授權）**：每個敏感資料讀寫都在服務端或資料庫檢查角色、資源所屬權、Tenant ID；**登入成功 != 有權查詢其他人的資料**。
- **RLS**：例如 PostgreSQL Row-Level Security 可以做深一層資料隔離，但須測試 policy、DB role、連線上下文與 service role bypass。
- **Secrets**：不可出現在 Client Bundle、前端環境變數或日誌；對外回傳只給最低必要資料。
- **Cache**：使用者／租戶個人化資料不得被共享 cache 洩露；所有 cache key 和 invalidation 應被測試。

## 安全操作 Gate

- [ ] Server-side validate、每個 API 和 Action 做 AuthZ
- [ ] Rate limiting / Abuse protection / audit logging
- [ ] CSRF / XSS / SQLi / SSRF，依架構建模
- [ ] DB Migration 可回滾／先前備份／權限分離
- [ ] Tenant isolation 測試與 Cache 隔離測試
- [ ] 靜態掃描 + 依賴風險 + 人工 code review

**不是只裝一個 ORM 或 Auth 套件就能得到安全。**
