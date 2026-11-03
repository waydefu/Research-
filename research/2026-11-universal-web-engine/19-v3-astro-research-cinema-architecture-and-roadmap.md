# 19｜THE OBSERVATORY V3：研究全文站內化的完整架構與規劃書

> **研究決策草案 v1｜2026-11-02（Asia/Taipei）｜待 Repo Owner 審查**
> **範圍：** 依 Owner 2026-11-02 新需求（可完全重構、研究資料全部在網頁內展示、不以 GitHub 連結作為閱讀入口），修訂 [18｜V3 技術盤點](18-v3-cinematic-experience-technology-decision.md) 的首選架構，並給出 P0–P5 完整規劃。
> **重要：** 本文件是**架構與規劃**，不是已安裝、已部署或已驗收的 V3。本 PR 不修改 `showcase/`、不安裝套件、不改 GitHub Actions 或 Pages 設定。所有效能數字皆為官方門檻或**提案預算**，沒有真機量測。
> **執行者手冊：** 交給 ChatGPT 5.6／Codex 實作時使用 [20｜ChatGPT 5.6 專用執行書](20-v3-chatgpt-5-6-execution-brief.md)。

## 現行事實基線（2026-11-03）

本文件最初寫於 2026-11-02，以下項目已被後續實作改變；**執行者遇到與舊段落衝突時，以本節與最新 main / PR / CI 證據為準，不得把歷史規劃逆向套回現況。**

- 正式根入口目前已由後續 PR 切成 Sanctum：\`/Research-/\`。
- 舊 V2 已歸檔到 \`/Research-/v2/\`；V3 研究館仍位於 \`/Research-/v3/\`。
- \`site/scripts/unify-home.mjs\` 是目前 root / V2 / V3 組裝事實來源之一。
- PR #26、#31、#33 已完成後續首頁／內容整合作業；PR #35 是本基線建立時的首頁修正候選。**PR 狀態屬動態資料，不在規劃文件中寫死：執行或合併本計畫前必須重新讀取 current main 與 PR #35；若 #35 已合併，就以其內容作為新的 main 現況。**
- PR #36 在本輪審查前的 HEAD \`8fb9e3695d0b463adfdbad131b103e6ed5b84c8a\`（2026-11-03）曾取得 \`Research integrity\`、\`V3 P0 build and checks\`、\`Publish Research Showcase\` 三組 SUCCESS。**本文件後續再修改後必須以新的最終 HEAD 重新判斷，不可沿用舊 SHA 的綠燈。**
- 因此 P0.5-A 是「現況驗證 Gate」，不是預設存在的修復工作；若當前 main / PR HEAD 已通過，就記錄證據並關閉 A。
- 任何「P5 才切 root」「V2 仍是正式根首頁」等文字均視為 2026-11-02 的歷史計畫，不再是目前執行指令。

## 0. 結論

**V3 是「一座可完整閱讀的研究館」加上「一個貫穿全站、由研究資料生成的 3D 世界」。** 網站殼層從 18 的 Vite SPA 改為 **Astro 6 靜態輸出**；渲染器、動畫、資產管線、字體策略與 G0–G4 驗收沿用 18。

| 層 | 首選 | 一句話理由 |
| --- | --- | --- |
| 網站殼層 | **Astro 6（`output: 'static'`）+ TypeScript 6** | 所有研究 Markdown 在建置時轉成 HTML，每篇有自己的網址，無 JS／無 GPU 也能讀 |
| 跨頁連續性 | **`<ClientRouter />` + `transition:persist`** | 換頁不重建 3D canvas，鏡頭可以從一篇飛到下一篇 |
| 內容管線 | Astro content collections（`glob()`）+ remark／rehype 自訂外掛 + Shiki | 站內連結改寫、表格、程式碼、目錄、反向連結與文件關係圖 |
| 搜尋 | **Pagefind（extended，`zh-TW`）** | 靜態全文搜尋，中文自動分詞，不需要後端 |
| 3D | **Three.js `WebGLRenderer`（WebGL2），原生 TS，不用 R3F** | 一個渲染器、按需繪製、可完全關閉 |
| 動畫 | **GSAP（一條主 Timeline）+ 原生捲動** | 開場與鏡頭轉場由一個 Director 控制 |
| 資產 | **Blender → glTF／GLB → glTF-Transform（meshopt、KTX2）** | 原創 Evidence Engine 與研究星圖 |
| 部署 | GitHub Actions → GitHub Pages（靜態） | 不新增伺服器、資料庫或登入 |

**與 18 的唯一實質差異：** 18 假設研究內容只需「索引＋連結原文」，所以選 Vite SPA；現在全文要在站內閱讀，產品變成內容站，01 與 09 的研究都指向 Astro（見第 2 節）。

## 1. 需求與品質定義

| Owner 需求（2026-11-02） | 對架構的影響 |
| --- | --- |
| 可以完全重構 | **歷史決策（2026-11-02）**：V3 先在 `site/` 平行開發；**現況（2026-11-03）** 已由 `site/scripts/unify-home.mjs` 將 Sanctum 放到根入口，V2 歸檔 `/v2/` 作為回退 |
| 研究資料直接在網頁展示，不用 GitHub 連結 | 每篇 Markdown 都有站內頁面；站內互相引用改寫成站內路由；不再以「在 GitHub 開啟」作為主要閱讀路徑 |
| 超強 JS 特效、電影級互動（延續 18） | 3D 世界常駐於版面之下，換頁時鏡頭連續移動；特效必須服務敘事（16 的「quality of intent」） |
| 繁體中文主導、有字體變化（延續 18） | 閱讀層使用完整繁中字體；展示字體只用於標題並做子集化 |

**「不用 GitHub 連結」的界定（Owner 已於 2026-11-02 確認，見第 10 節）：**
- 研究文件之間的連結 → 一律改成站內連結。
- 文件引用的**外部官方來源**（MDN、W3C、各框架文件）→ 保留為外部連結，這是 `AGENTS.md`「事實需連結原始來源」的要求。
- 指向本 Repo PR／Ruleset 的 GitHub 網址（目前 2 處）→ 改為純文字標註，不做連結。
- 每篇文件顯示來源 commit SHA 與最後修改日期，**以文字呈現、不連到 GitHub**。

**不能接受（沿用 18 第 1 節，並新增三條）：**
1. 只有 3D 而文件難以閱讀：長表格被裁切、程式碼無法橫向捲動、手機上字太小。
2. 必須看完開場才能讀到文件；或搜尋必須等 3D 載入完成。
3. 任何研究內容只存在於 Canvas 或貼圖中。

**可接受的完成形式：** 首頁有一段可跳過的電影開場；之後每次換頁，同一個 3D 世界以鏡頭移動回應；進入閱讀時世界退到背景並停止持續繪製；關閉 JS、關閉動態或 GPU 失敗時，全站仍是一座完整、好讀的研究館。

## 2. 研究庫依據：每個決策從哪裡來

| 決策 | 研究依據 | 依據內容（摘要） |
| --- | --- | --- |
| 改用 Astro 靜態殼層 | [01](01-framework-selection.md)、[09 方案 B](09-reference-stacks-and-migration.md) | 公開內容比例高 → Astro；「主框架選擇與 3D 引擎選擇解耦」 |
| 3D 只用一個渲染器、WebGPU 不作前提 | [06](06-graphics-and-compatibility.md)、[18](18-v3-cinematic-experience-technology-decision.md) | WebGPU 在 MDN 仍為 Limited availability；不同時載入多個 3D 引擎 |
| 品質分級與降級狀態機 | [06](06-graphics-and-compatibility.md)、[13 §3.2／§7.4](13-design-performance-and-architecture.md) | Basic poster 為絕對退路；升階需連續穩態、降階一次即可 |
| 效能門檻與負向測試 | [07](07-performance-and-accessibility.md)、[13 §7.5](13-design-performance-and-architecture.md) | LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1（p75）；10 種失敗注入 |
| 沉浸路徑與快速索引並存 | [16 §1.1](16-active-theory-quality-benchmark.md) | 不進動畫也能在 1–2 次操作內到達研究內容 |
| 配色、Evidence Engine、色彩語義 | [V2 美術規格](../../showcase/design/V2-ART-DIRECTION.md) | `space.0 #0A101D`、`gold.primary #E4B451`、`cyan.plasma #40D4DE`；金色不代表「已驗證」 |
| Design Atlas、Art Direction Lab、凍結與自由相機 | [17 §2／§4](17-arctic-waters-threejs-creative-workflow.md) | 先做構圖圖集再寫 WebGL；參數可序列化與重播 |
| Blender 資產、GSAP 主時間軸、G0–G4 | [18 §0／§8](18-v3-cinematic-experience-technology-decision.md) | 先通過靜止畫面 G0，才開發昂貴 shader 與資產 |
| V2 未完成項目 | [V2 實作審查](../../showcase/design/V2-IMPLEMENTATION-REVIEW.md) | 繁中字體子集未做；無真機 GPU、INP、熱量資料 |
| CI 與供應鏈 | [08](08-security-testing-and-deployment.md) | lockfile、授權掃描、Actions SHA pin、部署前人工批准 |
| 共享模組邊界 | [13 §3.1](13-design-performance-and-architecture.md) | design-tokens、motion-director、scene-core、quality-policy 為邏輯邊界，不強制 monorepo |

## 3. 系統架構

### 3.1 四層與資料流

```text
  research/ · docs/governance/ · showcase/design/   ← 唯一資料來源（Markdown，不複製）
                         │  建置時
                         ▼
 ┌──────────────── 內容層（Astro build）────────────────┐
 │ glob() collections → remark/rehype 外掛               │
 │  · 站內連結改寫 · 標題錨點與目錄 · 表格容器 · Shiki   │
 │  · 文件關係圖 graph.json · 來源 commit／日期          │
 └───────────────┬───────────────────────┬──────────────┘
                 ▼                       ▼
        靜態 HTML（每篇一頁）        graph.json（節點座標已預算）
                 │                       │
 ┌──────── 閱讀層（DOM）───────┐  ┌──── 世界層（常駐 canvas）────┐
 │ 導覽、目錄、文件、反向連結   │  │ Three.js WebGL2              │
 │ Pagefind 搜尋 UI            │  │ Director 狀態機 + GSAP        │
 │ 無 JS 也完整可讀            │  │ transition:persist，換頁不重建│
 └─────────────┬───────────────┘  └──────────────┬───────────────┘
               └──── URL 是唯一狀態來源 ──────────┘
                              │
                 GitHub Actions → GitHub Pages
```

### 3.2 狀態模型（概念設計，尚未實作）

**URL 是唯一真相。** DOM 的點擊一律走正常連結；世界層只讀取路由，不自己保存「目前在哪篇文件」。

| 狀態 | 來源 | 值 |
| --- | --- | --- |
| `mode` | 路由 | `intro`（首頁開場）／`explore`（星圖、領域頁）／`reading`（文件頁）／`search` |
| `focus` | 路由 | 文件 id、領域 id 或 `null` |
| `anchor` | 目前可見的標題 | 文件內章節，用於微調鏡頭（P4 才做） |
| `quality` | quality-policy | `high`／`balanced`／`basic` |
| `motion` | 系統設定與頁面切換鈕 | `full`／`reduced`／`paused` |

**資料流方向：** `URL → Director → 鏡頭與場景`。世界層的互動（例如點擊星圖節點）只能呼叫 `navigate(url)`，不能直接改 DOM。換頁事件使用 Astro 的 `astro:before-preparation`（開始轉場）與 `astro:after-swap`（新頁已就緒）。

### 3.3 目錄結構（提案）

```text
site/
  astro.config.ts           output: 'static'，V3 reader base 仍為 '/Research-/v3/'；正式 root 目前由 unified-home 組裝為 Sanctum
  package.json · package-lock.json
  src/
    content.config.ts       collections：research、governance（排除 THREAT-MODEL.md）、design（Zod schema）
    lib/markdown/           remark-rewrite-links、rehype-table-wrap、rehype-toc 等自訂外掛
    lib/graph/              build-graph.ts：連結 → 邊；預算星圖座標 → graph.json
    lib/provenance/         git log 取得每檔 commit SHA 與日期
    layouts/Base.astro      <ClientRouter />、<WorldCanvas transition:persist />、跳到內容連結
    pages/
      index.astro           首頁：DOM 標題 + 開場 + 研究入口
      research/[...slug].astro
      domains/[domain].astro
      search.astro
    components/             Nav、DocHeader、Toc、Backlinks、SearchPanel、MotionToggle
    world/                  原生 TypeScript，只在瀏覽器執行
      engine.ts             renderer 生命週期、context lost／restored、按需繪製
      director.ts           狀態機 + GSAP 主時間軸，可取消、可跳到終態
      constellation.ts      依 graph.json 建立節點與連線（instancing）
      core.ts               Evidence Engine GLB
      quality.ts            分級與降級
      lab/                  Art Direction Lab，只在 ?lab=1 載入
    styles/tokens.css       色彩、字體、間距、動態 tokens
  public/assets/            GLB、KTX2、字體子集、poster
  scripts/                  字體子集化、資產壓縮
  tests/                    unit（Vitest）、e2e 與 a11y（Playwright + axe-core）
```

**內容來源路徑：** `glob()` 的官方文件說明可讀取檔案系統任何位置，但未示範 `base: '../research'` 這類上層路徑。**P0 第一件事就是驗證這點**；若不可行，改用自訂 loader 或建置前同步腳本，但不得把 Markdown 複製進 Git。

## 4. 技術選型

| 技術 | 角色 | 為何選 | 淘汰的替代方案與原因 |
| --- | --- | --- | --- |
| Astro 6 | 靜態網站殼層、路由、Markdown 渲染 | 內容優先、Islands、建置時 HTML；研究 01／09 方案 B | Vite SPA：全文需自建路由與預渲染；Next.js：SSR／RSC 沒有對應需求（18 §4） |
| TypeScript 6 | 全站型別 | 內容 schema、Director 狀態、graph 型別一致 | 純 JS：V2 的零依賴優勢在重構後不再成立 |
| `<ClientRouter />` | 跨頁連續 3D | 官方 `transition:persist` 保留元素狀態；不支援 View Transitions 的瀏覽器可用 `fallback` | 自寫 SPA 路由：重做 Astro 已有的功能 |
| remark／rehype 自訂外掛 | 連結改寫、表格容器、目錄 | Astro 原生支援；可單元測試 | 手寫 HTML 卡片：違反「Markdown 是唯一真相」 |
| Shiki（Astro 內建） | 程式碼上色 | 建置時處理，零執行期成本；主題可用 V2 色票自訂 | 執行期上色函式庫：增加 JS |
| Zod（`astro/zod`） | 內容 schema | 標題、領域、日期缺漏時建置失敗 | 無 schema：錯誤會在畫面上才被發現 |
| Pagefind（extended） | 全文搜尋 | `zh`／`zh-TW` 頁面會分詞（如「每個月都」→「每個／月／都」）；純靜態 | Algolia 等外部服務：新增第三方與金鑰 |
| Three.js `WebGLRenderer` | 唯一 3D 渲染器 | PBR、自訂 GLSL、成熟；研究 13 Top 20 第 10 名 | WebGPU-first：仍需獨立 PoC；R3F：此專案不需要 React（18 §9） |
| GSAP Timeline（+ 有限 ScrollTrigger） | 開場與轉場 | 一條主時間軸；包含原付費外掛在內可免費商用 | Motion、Anime.js 同時使用：時間軸競速（09） |
| Blender + glTF-Transform | 原創資產與壓縮 | meshopt、KTX2，研究 06／17 | AI 生成資產直接上線：需 Blender 修整與授權記錄 |
| 字體：Noto Serif TC／Noto Sans TC + 展示字體候選 | 閱讀與標題 | 內文完整覆蓋繁中；展示字體 G0 盲測決定 | 系統預設字體：V2 審查已列為未完成項 |
| Vitest、Playwright、axe-core、Lighthouse CI | 測試 | 單元、端到端、可及性、實驗室效能 | 只靠 CI 綠燈：不等於美術或真機驗收 |

**GSAP 授權（2026-11-02 查證）：** Webflow 的標準授權允許在任何網站免費使用，包含商業用途；限制是不得用於「與 Webflow 動畫建構器競爭的無程式碼視覺工具」，也不得移除版權標示。本站不屬限制範圍，正式導入時仍需鎖版並保存授權頁快照。

## 5. 內容管線

**目前規模（以 PR #18 head 計算）：** `research/` 55 篇、`docs/governance/` 7 篇、`showcase/design/` 4 篇，共 66 篇 Markdown，約 415 KB（UTF-8）；本 PR 再加入 19、20 兩篇。依 Owner 決定，`docs/governance/THREAT-MODEL.md` 不在網站展示，其餘全部收錄。其中 61 篇有表格、16 篇有程式碼區塊（多為 ASCII 圖），2 張 SVG 插圖位於 `showcase/design/`；沒有數學式或 Mermaid。

| 步驟 | 做法 | 驗收 |
| --- | --- | --- |
| 1. 收錄 | 三個 collection；檔名推導 slug（`2026-11-universal-web-engine/13-design-…` → `/research/universal-web-engine/13-design-…/`） | 三個目錄下的 Markdown 全部有頁面（以測試比對實際檔案數） |
| 2. Metadata | 不要求改既有文件：標題取第一個 H1；領域取資料夾；順序取檔名編號；日期取「研究日期／查證」行，否則取 git 最後修改日 | Zod 驗證；缺標題即建置失敗 |
| 3. 表格 | rehype 外掛把 `<table>` 包進可橫向捲動、可鍵盤聚焦的容器；手機上首欄固定 | 最寬表格在 360px 寬不裁字 |
| 4. 程式碼與 ASCII 圖 | Shiki 上色；`text` 區塊保持等寬並可橫向捲動，不自動換行 | 第 3 節架構圖在手機上可完整捲動閱讀 |
| 5. 站內連結 | 相對 `.md` 連結 → 站內路由，保留 `#錨點`；指向本 Repo 非 Markdown 檔（如 SVG）→ 複製到站內資產；壞連結 → 建置失敗 | 輸出中「指向本 Repo 檔案的 GitHub 連結」= 0 |
| 6. 本 Repo 的 PR／Ruleset 網址 | 改為純文字標註（Owner 已確認） | 同上 |
| 6a. 排除清單 | `docs/governance/THREAT-MODEL.md` 不產生頁面、不進搜尋與星圖；其他文件連到它時顯示為純文字「（未公開於網站）」 | 輸出中沒有該文件的頁面、索引或節點 |
| 7. 關係圖 | 節點 = 文件；邊 = 站內連結（有向、依次數加權）；群組 = 資料夾；建置時以固定亂數種子預算座標寫入 `graph.json` | 同一 commit 兩次建置輸出相同 |
| 8. 反向連結 | 每篇頁尾列出「引用本篇的文件」 | 與 graph.json 一致 |
| 9. 來源標示 | 頁首顯示 commit SHA 與最後修改日期（純文字） | 每頁皆有；取不到時顯示「Unknown」 |
| 10. 搜尋 | 建置後執行 Pagefind；`<html lang="zh-Hant-TW">`；以領域作為篩選 | 抽測 20 個中文詞，人工確認結果 |

**無 JS 時：** 文件頁、領域頁、目錄、反向連結都是靜態 HTML；只有全文搜尋需要 JS，因此 `/search/` 在無 JS 時改列出全部文件的分領域清單。

## 6. 3D 世界與導演系統

### 6.1 世界觀：研究星圖中央的觀測核心

- **Evidence Engine（中央）：** 沿用 V2 美術規格的原創輪廓：偏心雙軌金屬環、斜切菱透鏡、刻度弧。由 Blender 製作成 GLB，取代 V2 的程序化圓環。
- **研究星圖（周圍）：** 每篇文件是一個節點（撰寫時約 66 個），依資料夾分成 6 個星域（retrospective、agent-engineering、agent-repository-operations、universal-web-engine、governance、design）。連線來自真實站內引用，**不是裝飾**。
- **色彩語義沿用 V2：** 青色 = 正在探索；金色 = 目前聚焦的文件；兩者都**不代表「已驗證」**。文件若無 evidence metadata，不做任何「可信度」視覺映射。

### 6.2 模式與鏡頭

| 模式 | 觸發 | 鏡頭與場景 | 繪製方式 |
| --- | --- | --- | --- |
| `intro` | 首頁首次進入 | 第一束訊號 → 接近核心 → 星圖展開；DOM 標題先出現，開場隨時可跳過 | 持續繪製，開場結束即停 |
| `explore` | 首頁（開場後）、領域頁 | 環繞星圖；DOM 清單的 hover／focus 點亮對應節點 | 互動時繪製，閒置 2 秒後停止 |
| `reading` | 文件頁 | 鏡頭飛到該文件節點後停住；世界亮度降到背景層級，不與內文競爭 | **按需繪製**：鏡頭到位後不再每幀繪製 |
| `search` | 搜尋頁 | 搜尋結果對應的節點點亮 | 結果更新時繪製一次 |

- **轉場：** `astro:before-preparation` 時 Director 開始鏡頭移動；`astro:after-swap` 時對準新焦點。轉場可被下一次導覽打斷，絕不阻擋點擊或捲動。
- **減少動態：** 鏡頭直接切到終態，停用視差、粒子與閃爍；`<ClientRouter />` 本身也會在 `prefers-reduced-motion` 時停用轉場動畫。
- **可跳過：** 首頁開場有可見的「直接看研究」按鈕；第二次造訪預設不播開場。

### 6.3 品質分級（研究 06／13 的狀態機，去掉 WebGPU 的 Ultra）

```text
Poster（初始 HTML 內的靜態圖）
  └─ WebGL2 可用？ 否 → Basic（純 DOM + poster）
       └─ 是 → Balanced（DPR 上限、無後製）
            └─ 暖機後連續兩段穩態都在預算內 → High（Selective Bloom、較高 DPR）
                 └─ 任一段明顯超出預算 → 降一級，冷卻後才可再升
context lost、shader 編譯失敗、頁面隱藏 → 停止繪製；重複失敗 → Basic 並記錄原因
```

### 6.4 製作工具（研究 17）

- **Art Direction Lab（`?lab=1`，只在開發與 QA 載入）：** 光源方向、金色強度、青色輪廓光、粗糙度、Bloom、FOV、曝光；設定可存成 JSON 並重播。
- **凍結與自由相機：** 暫停時間、自由移動相機、在固定視角截圖，檢查破面、過曝與遮擋。
- **Design Atlas：** 同一場景在桌機、手機、減少動態、無 GPU 四種狀態下並排比較。

## 7. 美術與字體

- **配色：** 沿用 V2 的 CELESTIAL INTELLIGENCE token 與亮度治理（暗部約 70–80%、白色峰值極小面積）。閱讀層的文字對比以**最差實際背景**重新量測。
- **閱讀是主產品：** 文件頁不是卡片拼貼。內文 17–18px，繁中每行約 32–40 字；標題階層清楚；表格、程式碼、引用區塊各有專屬樣式。
- **字體策略：**
  - 內文：Noto Sans TC 或 Noto Serif TC，以 `unicode-range` 分片自架（不呼叫字體 CDN，沿用 V2 政策）。
  - 展示標題：G0 盲測三個候選（Owner 2026-11-02 確認）：Noto Serif TC、霞鶩文楷 TC、芫荽。**導入前查核各自版本的 OFL 原文與字元覆蓋**。
  - 建置時收集所有標題用字 → `pyftsubset` 子集化展示字體。
- **反模板規則：** 不用一致圓角卡片、裝飾性漸層、每節都有全大寫小標、每個區塊都淡入上滑；大膽只花在 3D 世界與首頁開場，閱讀層保持安靜。

## 8. 效能、降級與可及性

| 項目 | 目標 | 性質 |
| --- | --- | --- |
| LCP | p75 ≤ 2.5s | Google 官方「良好」門檻 |
| INP | p75 ≤ 200ms | 同上 |
| CLS | p75 ≤ 0.1 | 同上 |
| 首屏 | LCP 元素是 HTML 內的標題或 poster，不等待 3D | 架構規則 |
| 世界層載入 | `requestIdleCallback`／LCP 之後才載入 three.js 與 GLB | 架構規則 |
| 閱讀模式 | 鏡頭到位後零持續繪製 | 架構規則 |
| 高階裝置 | 60 FPS 目標；中階 30 FPS 或 Basic | 提案，P5 真機校準 |

**負向測試（沿用 13 §7.5）：** 阻擋 WebGL、context loss、慢網並阻擋 GLB、減少動態、iOS 返回上一頁、旋轉與縮放、純鍵盤與單指、快速連續換頁 3 次、shader 編譯失敗。每一項都必須：頁面不黑屏、內容可讀、導覽可用。

**可及性：** WCAG 2.2 AA 為驗收基線。canvas 設 `aria-hidden="true"`；所有世界互動都有 DOM 等價入口；換頁後焦點移到新頁 `<h1>`（`<ClientRouter />` 會以 `aria-live` 宣告新頁標題，每頁必須有 `<title>`）。

## 9. 分階段規劃

每個階段都是**獨立、小範圍的 PR**，Owner 審查通過才進下一階段。原始 P0–P5 架構保留，但依 2026-11-03 實際 Repo 狀態，在 P0 與 P1 之間新增 **P0.5 基礎收斂層**。原因是目前瓶頸已從「缺研究／缺頁面」轉成「CI 契約、資料模型、視覺唯一性、單一部署來源與治理一致性」。

### 9.1 P0.5 執行模型：Blocking / Parallel / Break-glass

P0.5 不再是一條十三項全部串行的硬鏈，而分成三種治理類型：

| 類型 | 規則 | 項目 |
| --- | --- | --- |
| **Blocking Gate** | 新的大規模 P1 production implementation 前完成或重新驗證 | A Current CI verification、C Metadata Schema、D Architecture Contract + ADR、E 模組化 / Design System、F Code / Visual Quality Gate、G 公開視覺 / 全繁中 Gate、H 單一正式 Deploy Source |
| **Parallel Governance** | 可和 G0 收尾、文件整理、低風險 bugfix 平行 | B Safe Required Checks、I Security / Dependency 完整治理、J Supply-chain / License Registry、K Agent Skills、L Re-baseline / machine policy、M ingestion pipeline |
| **Break-glass** | 任何時候可插隊；處理 production regression、重大 accessibility、security、secret、license / legal、CI outage | 不受 A–M 順序限制，但必須留下豁免紀錄與補驗證 |

**已授權／已進行的 G0 收尾不因 P0.5 被凍結。** P0.5 阻擋的是新的大規模 P1 production implementation，不是把已上線網站的 bugfix、首頁修正或 G0 驗收工作停住。

### 9.2 P0–P5 主階段

| 階段 | 目標 | 主要交付物 | 通過條件（Gate） |
| --- | --- | --- | --- |
| **P0 內容館** | 全部研究在站內可讀 | Astro 內容館、Pagefind、站內連結與 CI | 歷史主能力已完成；以當前 main / CI / 實機證據為準 |
| **P0.5 基礎與治理收斂** | 讓資料、模組、UI、CI、安全、Agent、部署可持續擴張 | Blocking + Parallel + Break-glass 規則 | Blocking Gate 完成；Parallel 有 Owner 可見狀態與未結事項 |
| **P1 美術 G0 / production** | 靜止 Atlas 定案後進正式美術實作 | Design Atlas、字體、Evidence Engine、production UI | 已授權 G0 可收尾；新的 production 實作需 Blocking Gate 完成或有明確 waiver |
| **P2 3D PoC G1** | 一個精緻場景與一次飛行 | Blender GLB、星圖、鏡頭飛行、品質分級 | 目標瀏覽器實測 |
| **P3 導演 G2** | 連續電影 | 開場、轉場、reduced-motion | 內容始終可直接讀，動效可打斷／關閉 |
| **P4 研究功能 G3** | 研究館完整 | 反向連結、目錄、搜尋篩選、關係圖 | DOM / world 狀態一致 |
| **P5 真機與發布 G4** | 正式上線、驗收與可追溯發布 | 真機、負向測試、rollback、release provenance | Owner 人工驗收；artifact 可追溯、可回退 |

### 9.3 P0.5 十三個 Gate／Workstream

| ID | 類型 | 要做什麼 | 完成 / 判定方式 |
| --- | --- | --- | --- |
| **A｜Current CI verification** | Blocking | 讀取當前 main / PR HEAD 的 Research integrity、V3、Pages artifact/browser 結果。**只有失敗才進修復。** | 若全綠：記錄 SHA、日期、run evidence → A = PASS；若 regression：只修真實失敗 |
| **B｜Safe Required Checks** | Parallel | **禁止直接把目前有 \`pull_request.paths\` 的 V3 / Pages workflow 設為全 Repo required check。** 先設計 every-PR always-reporting wrapper，或調整 workflow 讓每個 PR 都回報穩定狀態；昂貴測試可由 path classifier 決定是否執行 | README/AGENTS-only PR 與 site/research PR 都能取得明確 required status；不存在 skipped workflow 永久 Pending |
| **C｜Metadata Schema** | Blocking | 正式定義 publicTitle、summary、domain、topic、tags、creator、originalSource、demo、license、verifiedAt、image、evidenceLevel | 新研究不再主要靠 regex 推導；缺必要欄位可被 CI 發現 |
| **D｜Architecture Contract + ADR** | Blocking | 建 docs/architecture + docs/adr；固定 source/content → metadata/domain → components → pages → runtime/effects 單向依賴；重大決策記錄 Context / Decision / Alternatives / Consequences / Status | 正式決策可快速判斷；越層依賴有可檢查規則 |
| **E｜模組化 + Design System** | Blocking | 拆 content / metadata / search、primitives / research / navigation、tokens / typography / layout / motion | 頁面只組裝公開介面；共用 UI / CSS 不再散落複製 |
| **F｜Code / Visual Quality Gate** | Blocking | 建 lint / format / import-boundary；Playwright 核心 viewport visual regression；避免固定「圖片數 = N」這種脆弱 contract | 格式、危險 import、核心視覺 drift 可被 CI 阻擋 |
| **G｜每篇視覺 + 全繁中 Gate** | Blocking | article.image → topic → domain → fallback；核心文章專屬相關視覺；公開 title / summary / domain / topic 繁中 | 不再整批同圖；raw folder slug 不露出 |
| **H｜單一正式 Web App / Deploy Source** | Blocking | 以**現況**為起點收斂：Sanctum 已是 root、V2 已在 /v2/、V3 reader 在 /v3/；目標是讓 site/ 成為正式主 build/deploy source，showcase/ 逐步退成 legacy/reference，**不是再次切 root** | 一套主 build 契約生成 root + reader + legacy；不逆向恢復 V2 根首頁 |
| **I｜Security + Dependency Governance** | Parallel + break-glass baseline | secret / license / high-risk dependency 問題隨時插隊；完整工作再補 SECURITY.md、SAST 主方案、secret scanning / push protection、Dependabot/等價更新、必要時 dependency review | 緊急安全修補不等待 H；完整治理有自動 Gate / exception |
| **J｜Supply-chain + License / Asset Registry** | Parallel + break-glass baseline | 明確授權風險立即處理；完整補 root LICENSE 決策、THIRD_PARTY_NOTICES、asset/source manifest；SBOM / attestation 留 P5 | 第三方 asset / source 可追溯 |
| **K｜Agent Skills + Context Governance** | Parallel | 建 research-ingest、review、metadata-curation、architecture-review、site-ui-review、visual-regression、web-performance-a11y、security-review、source-license-review、release-deploy 等 task Skills | AGENTS 只留全域界線；Skill 以 task success / token / rework A/B 驗證 |
| **L｜Re-baseline + Machine Policy** | Parallel | 新 baseline 記錄 visibility、ruleset、required checks、root routing、deploy source、安全／依賴現況；把可機械檢查規則移進 CI | 不再讓歷史 baseline 冒充 current state |
| **M｜Research ingestion pipeline** | Parallel（依賴 C/G/L） | 固化 URL → 查證 → metadata → Markdown → 分類 → 圖片 → source/demo/license → index → CI | 完整研究條目自動進分類、搜尋、視覺、來源與網站 |

### 9.4 Safe Required Check 設計原則

修改 \`main-eag-100\` 前，必須先證明 required status 在**所有 PR 類型**都會回報：

\`\`\`text
pull_request (all paths)
        ↓
required-gate (always reports)
        ↓
path classifier
 ├─ site / research / showcase changed → expensive V3 + Pages verification
 └─ unrelated docs/root-only change     → lightweight integrity / contract checks
        ↓
single required status = success / failure
\`\`\`

不得直接要求一個可能因 \`paths:\` 完全不觸發的 workflow context，否則 docs-only PR 可能永久 Pending。

### 9.5 Waiver / Break-glass 紀錄格式

任何跳過 Blocking Gate 或緊急插隊都要在 PR 留下：

\`\`\`text
Decision maker:
Reason:
Scope:
Risk accepted:
Expires / revisit by:
Deferred verification:
Follow-up issue / PR:
\`\`\`

Security、secret、license、production regression、重大 accessibility 修補**不需要等待階段批准**；先止血，再補完整證據與回歸。

### 9.6 明確延後／目前不需要

- 多層多人 OWNERS / reviewer hierarchy。
- Nx / Turborepo / 大型 monorepo。
- 完整 Storybook；先用 Atlas / component lab + Playwright visual regression。
- 付費 RUM / Observability；P5 有真實流量 / SLO 再評估。
- 社群型 CODE_OF_CONDUCT / SUPPORT escalation；有外部貢獻者後再補。

### 9.7 實施原則

1. A 是**驗證**，不是預設故障。當前證據全綠就記 PASS，不重做已完成工作。
2. B 先做 safe wrapper / trigger 設計，後改 ruleset，順序不可反。
3. C–H 是新的大規模 P1 production implementation 前的主要 Blocking Gate；**既有 G0 收尾與必要 bugfix 不被凍結**。
4. I / J 的最低安全與授權基線立即生效；完整治理可平行。
5. K / L / M 可平行，但 M 依賴 C/G/L 的資料與政策契約。
6. Break-glass 永遠優先於里程碑；止血後必須補 waiver / regression evidence。
7. P0.5 不藉機提前導入 Three.js / GSAP / 電影級 3D。

## 10. 風險與待決事項

| 風險 | 影響 | 對策 |
| --- | --- | --- |
| `transition:persist` 對 WebGL canvas 的實際行為未在官方文件示範（範例是 `<video>`） | 換頁可能重建 context | P2 第一項驗證；不行則世界層改為只在同一頁內轉場 |
| `glob()` 讀上層目錄未經官方示範 | P0 卡關 | 備案：自訂 loader 或建置前同步（不進 Git） |
| Pagefind 中文分詞品質 | 搜尋找不到詞 | P0 人工抽測 20 詞；必要時加同義詞或標題加權 |
| 繁中字體檔案大 | LCP 變差 | 內文分片、展示字體子集化、`font-display: swap` |
| 3D 資產需要真正的美術 | 「四個圓環加 Glow」 | G0 先過靜止畫面；Blender 資產另立 PR 審查 |
| AI 執行者越權或誤報完成 | 未授權部署、假驗收 | 依 [20 執行書](20-v3-chatgpt-5-6-execution-brief.md) 的授權邊界與回報格式 |

**Owner 決定（2026-11-02，全部採用本文件建議）：**

| 事項 | 決定 |
| --- | --- |
| 來源 commit SHA | 以純文字顯示，不連到 GitHub |
| 本 Repo 的 PR／Ruleset 網址 | 改為純文字標註 |
| `docs/governance/` 公開範圍 | 公開；`THREAT-MODEL.md` 先不在網站展示，日後由 Owner 另行決定 |
| V3 預覽路徑 | `/Research-/v3/`；P0 完成後以獨立 PR 修改部署 workflow |
| 展示字體候選 | Noto Serif TC、霞鶩文楷 TC、芫荽 |
| P0 開工 | 本文件合併後，由 Owner 另行指定執行者（ChatGPT 5.6 或 Claude）並明確開工；文件合併不等於開工許可 |

## 11. 來源

**研究庫：** [01](01-framework-selection.md)、[06](06-graphics-and-compatibility.md)、[07](07-performance-and-accessibility.md)、[08](08-security-testing-and-deployment.md)、[09](09-reference-stacks-and-migration.md)、[13](13-design-performance-and-architecture.md)、[16](16-active-theory-quality-benchmark.md)、[17](17-arctic-waters-threejs-creative-workflow.md)、[18](18-v3-cinematic-experience-technology-decision.md)、[V2 美術規格](../../showcase/design/V2-ART-DIRECTION.md)、[V2 實作審查](../../showcase/design/V2-IMPLEMENTATION-REVIEW.md)。

**外部官方文件（2026-11-02 查證）：**
- Astro View Transitions（`<ClientRouter />`、`transition:persist`、生命週期事件、`fallback`、reduced motion、路由宣告）：https://docs.astro.build/en/guides/view-transitions/
- Astro Content Collections（`glob()`、`render()`、schema 可選）：https://docs.astro.build/en/guides/content-collections/
- Pagefind 多語言與中文分詞：https://pagefind.app/docs/multilingual
- GSAP 標準授權：https://gsap.com/standard-license
- Three.js WebGLRenderer：https://threejs.org/docs/#api/en/renderers/WebGLRenderer
- Google Web Vitals：https://web.dev/articles/vitals
- WCAG 2.2：https://www.w3.org/TR/WCAG22/

---

**修訂紀錄｜2026-11-02 v1**：依 Owner 新需求，將 18 的首選殼層由 Vite SPA 改為 Astro 6 靜態輸出；新增內容管線、研究星圖世界觀、四種模式、P0–P5 規劃與待決事項。沒有變更現網、部署、權限或自動化設定，沒有任何真機量測。

**修訂紀錄｜2026-11-02 v1.1**：記錄 Owner 對第 10 節六項待決事項的決定（全部採用建議）；排除 `THREAT-MODEL.md`；預覽路徑定為 `/Research-/v3/`；字體候選定案。
