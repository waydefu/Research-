# 05｜TypeScript、Node.js、Build Tools、DX 與 Monorepo

**技術研究截點：2026-11-02。** 不將 CI 的 build 加速當成使用者端瀏覽 FPS 加速。

## 基礎技術鏈

| 位置 | 候選 | 目前重要事實 | 選擇原則 |
| --- | --- | --- | --- |
| 型別 | **TypeScript 6** | 2026-03 正式，遷移預設 target/module 並為 7.0 native port 鋪路 | 大型專案採 strict；舊案先跑 typecheck |
| TS 原生編譯器 | TypeScript 7 Beta | 官方 2026-04 發表 Beta，不把預覽當穩定 | 可在實驗分支比較型別檢查速度和相容性 |
| Runtime | **Node.js 26 LTS**／24 LTS | 官方 2026-10-28 發布 26.13.0 LTS | 以平台、套件支援與安全維護優先 |
| 其他 Runtime | Bun / Deno | 具有不同相容性、內建工具與權限設計 | 需要時做同工作負載 PoC，不預設更快 |
| Bundler | **Vite 8 + Rolldown** | 2026-03 正式；Rust-based unified bundler | 適合 SPA、React Router、Astro 等 Vite 生態 |
| Next bundler | **Turbopack** | 整合於 Next 生態 | 不必為使用 Next 再加一個 Vite |
| Monorepo | pnpm workspaces + Turborepo / Nx（按需） | 多專案共同套件和 task cache | 小專案不需建大型 monorepo |
| 格式/檢查 | ESLint / Prettier / Biome / Oxc | 功能有交集 | 應先選**一套主要 lint/format**，避免規則互打 |
| 測試 | Vitest + Playwright | 單元／整合／E2E 的主要候選 | 必須驗證真產品流程與部署 |

## 2026 值得關注的事實

- Vite 8 以 Rolldown 統一 dev/prod bundle 管線；官方宣稱部分情境 **10–30 倍 build 加速**，但這不是全專案普遍比例，也**不會直接保證 Runtime 性能**。
- TypeScript 6 的 module/target 預設發生重大變更，應根據 tsconfig、Browser Targets 和 Node 版本進行升版。
- Node 26 是 LTS，不代表每個 npm 套件已完成相容性；CI 應測**生產指定的 Node 和平台**。
- 若選 Next.js，應遵循其原生工具鏈；若選 Vite-based 框架，無須把 Turbopack 硬塞進去。

## 最小 DX 規範

\`\`\`text
repo/
├── apps/               # 只有多個產品才需要
├── packages/           # 只有真正重用的庫才抽共用
├── docs/               # ADR / 體系結構 / 設計規範
├── tests/              # 單元、契約與 E2E
├── package.json
└── lockfile             # 可重現安裝，納入版本控制
\`\`\`

單一小站可以只有 \`src/\`，不要為了看起來專業而增加不必要的抽象。

## CI Gate

1. 固定 runtime major、lockfile 與依賴安全更新策略。
2. typecheck、lint、unit、E2E、build；以實際部署產物為準。
3. 檢查 JS bundle 演變、import cycle、重複依賴與 source map 洩露。
4. 保留 artifacts 和 PR 差異，禁止無證據宣稱「十倍提速」。

官方來源：
https://vite.dev/blog/announcing-vite8
https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/
https://nodejs.org/en/blog/release
https://nodejs.org/en/about/previous-releases
https://turbo.build/repo/docs
https://vitest.dev/
https://playwright.dev/
