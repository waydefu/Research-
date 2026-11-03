# Research-｜下一位 Agent 接手交接書

> **現行交接快照：2026-11-03（Asia/Taipei）**
>
> **交接先讀**：本檔 → site/AGENTS.md → 目前 GitHub main／open PR／Actions → 19 號 P0.5 計畫 → Owner 最新授權。本快照不會自動更新；動態狀態以 GitHub 當場查核為準。

## 1. 目前真實狀態

| 項目 | 查證後結果 | 注意 |
| --- | --- | --- |
| Repo | https://github.com/waydefu/Research- | 公開儲存庫 |
| main 基線 | `50794e998bfba2c07323ee8442f3eaf36c2f0e2f` | 下一位重新查 SHA |
| 尚未合併 PR | 交接檢查開始時為 **0 件**；本交接 [PR #37](https://github.com/waydefu/Research-/pull/37) 已新開 | PR #31～#36 均已合併；接手時重新查 #37 是否已合併 |
| 正式首頁 | https://waydefu.github.io/Research-/ | 原創暗金天文神殿 Sanctum |
| 完整典藏 | https://waydefu.github.io/Research-/v3/library/ | Astro V3 父子主題與圖文研究 |
| 全文搜尋 | https://waydefu.github.io/Research-/v3/search/ | Pagefind |
| 歷史 V2 | https://waydefu.github.io/Research-/v2/ | **不可逆向改成根首頁** |
| main Pages Action | https://github.com/waydefu/Research-/actions/runs/41627389650 | SUCCESS；部署 job 成功，不等於真機驗收 |
| main Research integrity | https://github.com/waydefu/Research-/actions/runs/41627389740 | SUCCESS，僅限上列 SHA |
| V3 P0 回歸 | https://github.com/waydefu/Research-/actions/runs/41624042933 | PR #36 HEAD 上 SUCCESS；**不是目前 main SHA 的該工作流程結果** |

最新站點仍是 Astro 靜態研究館與靜態神殿美術，不是已交付的 Three.js 連續 3D 世界。

## 2. 已合併的交付與意義

- PR #26：正式根首頁改為 Sanctum，V2 歸檔到 `/v2/`，V3 讀者入口不變。
- PR #31、#32、#33：繁中閱讀、研究分類／搜尋、來源與外站示範、不同領域圖像、Open Design Agent Kit 與相關研究收錄。
- PR #34：手機文字遮擋、重複選單、內容背景、Markdown 原文片段誤入摘要；細分主題**原地展開該主題全部文章**，不跳搜尋。
- PR #35：手機首屏直接看見「完整典藏館」「全文搜尋」；桌面以典藏優先，首頁排序為**搜尋／典藏入口 → 圖文研究分類 → 精選研究 → 閱讀功能**。
- PR #36：P0.5 治理由 A～M 硬串行改成 Blocking / Parallel / Break-glass；不再把歷史 V2 root 誤當現況，Required Checks 禁止直接將 paths-filtered raw workflow 設為全 repo 必選檢查。

上述是合併與 CI 事實，**不代表** Owner 已簽核美術、Android／iPhone 真機與每一篇白話導讀。

## 3. Owner 不可遺失的產品要求

1. **全站繁體中文且零基礎能懂。** 每篇先說「這是什麼、能做什麼、適合誰」，再進技術細節；Three.js 等英文專有名詞可保留，但首次出現需附白話解釋。
2. **首頁直接找到資料。** 完整典藏館與搜尋不藏進選單；主次按鈕用途清楚，不要多顆按鈕做相同動作。
3. **父／子分類具體。** 父類有主題圖片、真實用途；子類有使用情境，點開即列出全部所屬文章，不跳別處。
4. **每個研究題材要有符合內容的圖片。** 不要只重複神殿背景或用抽象光團替代具體物件。
5. **美術方向**：暗金天文儀、深藍拱頂、少量冰藍、全頁連續的電影敘事感；參考 `site/design/OBSERVATORY-REFERENCE-AND-OPEN-DESIGN.md`。原始圖片是 Owner 2026-11-03 聊天中提供，**尚未作為 Repo 的正式圖檔**；需要精確對照時須重新取得可存取的圖。
6. 尊重原研究 Markdown、來源 SHA、原作者；原作品與通用 demo 不得混淆。第三方 iframe 只在用戶點擊後載入，外站不允許嵌入時要提供原網址。

## 4. 下一位應先讀哪裡

| 用途 | 檔案 |
| --- | --- |
| 範圍、授權 | `AGENTS.md`、`site/AGENTS.md`、本交接書 |
| 網站根入口、構建 | `site/public/atlas/sanctum/index.html`、`site/scripts/unify-home.mjs`、`.github/workflows/publish-showcase.yml` |
| 文章、搜尋、資料 | `site/src/pages/[collection]/[...slug].astro`、`site/src/pages/search.astro`、`site/src/lib/catalog.mjs` |
| 分類、圖片 | `site/src/pages/library/index.astro`、`site/src/pages/domains/[domain].astro`、`site/src/lib/exhibit-info.mjs`、`site/public/research-exhibits/` |
| 導讀、來源、demo | `site/src/lib/research-metadata.mjs`、`site/RESEARCH-CURATION.md` |
| 歷史 G0、真機程序 | `site/P1-DELIVERY-G0-ACCEPTANCE.md`、`site/G0-REAL-DEVICE-PROTOCOL.md`、`site/ATLAS-G0-REVIEW.md` |
| P0.5 A～M 決策 | `research/2026-11-universal-web-engine/19-v3-astro-research-cinema-architecture-and-roadmap.md` `9 |
| Open Design 工具研究 | `research/2026-11-universal-web-engine/25-open-design-agent-kit-and-observatory-adoption.md` |

**歷史檔案警告**：P0 初期文件及舊 G0 紀錄可能仍描述「PR #31 Draft」「V2 是 root」「尚未部署」，那是當時狀態，不能取代當前 main。

## 5. 待辦與工作排序

| 優先序 | 事項 | 完成標準／限制 |
| --- | --- | --- |
| A：交接完成 | **P0.5-A Current CI Verification** | 記錄目前 main SHA、CI、部署結果。PR #36 的 V3 P0 曾 PASS；main SHA 缺相同檢查時要明寫未執行，不能冒稱三組全過 |
| **下一個建議獨立 PR：P0.5-C** | **研究 Metadata Schema** | 先盤點現有 CURATED、TOPIC_RULES、EXHIBITS 與 Markdown；定義可驗證繁中標題、白話導讀、父／子分類、授權圖片、作者／demo、來源可靠性；原文不動、未知值不捏造、全量文章與搜尋回歸 |
| 可並行規劃：B | Required Checks | 設置 every-PR 必回報狀態，docs-only 與 site/research 兩類 PR 均測試後，才**另經 Owner 授權**修改 Ruleset |
| 後續 Blocking | D/E/F/G/H 架構契約、模組化、品質 Gate、全繁中與素材、單一部署來源 | 新的大規模 production P1 工作之前必須完成，或取得 Owner 明示 waiver；已授權小型 bugfix、G0 收尾不中斷 |
| 可並行治理 | I/J/K/L/M 安全、授權、Skills、治理、收錄流水線 | 分小 PR，有實際發現與證據；不要虛構風險 |
| **待實測的 G0** | Android／iOS、外站 demo、效能／發熱、Owner 目視簽核 | Chromium 截圖／觸控模擬不是物理裝置。沒有資料填「未量測」，不能寫 PASS |
| **未授權** | P2 Three.js／Blender 導演、全站重構、全素材替換、直接部署 | 本交接**不構成**開工、合併或正式部署授權 |

### 下一位 Agent 接手的第一個操作

1. 核實 main／open PR／workflow triggers 與最近的 CI；不要只看本快照的 SHA。
2. 閱讀 `site/AGENTS.md`、19 號 `9、`site/RESEARCH-CURATION.md` 與 Owner 的原始美術要求。
3. **僅針對 P0.5-C** 盤點欄位覆蓋率與人工 metadata 缺口，提出最小且可驗證的 Schema，優先兼容現有文章與 Pagefind。
4. 在可用 Node ≥22.12 的 Repo clone 裡執行 `cd site`、`npm ci --no-audit --no-fund`、`npm run check`、`npm run build`、`npm run provenance`、`npm run e2e`；需有 Playwright Chromium。確認原文、深連結、中文搜尋、手機與無 JS。
5. 建立獨立 Draft PR，附變更、測試證據、缺口與 Owner 待決；不自動合併或部署。

## 6. 不可越界／風險提醒

- `docs/governance/THREAT-MODEL.md` 不得被放到站內路由、Pagefind 或公開的研究索引；Repo 為公開，站內排除不會讓 GitHub 檔案變成私有。
- 外站可用 CSP／X-Frame-Options 禁止嵌入。不可繞過，原站連結永遠保留。
- Open Design Agent Kit **僅研究與記錄規範**，沒有證據顯示目前這個 Agent 環境已安裝或連上其 MCP；不得擅自執行 `npx` 或改全域 MCP/Agent 設定。
- User 未明確授權時不可跨修改研究／其他 Repo，不改 Ruleset／工作流程／全域設定，不合併，不部署。緊急安全、機密、授權法律、嚴重無障礙與 production regression 依 P0.5 break-glass 記錄：決策者、範圍、風險、期限及補驗證。
- 真機 GPU/FPS/溫度、實際 Core Web Vitals 未測就明示未測。不要用 CI 全綠宣稱最終 G0 簽核。

**接手成功的標準**：不靠原始聊天就知道現況入口、交付版本、CI 與 G0 的邊界、下一個唯一建議的小 PR、Owner 批准前不能做的事。
