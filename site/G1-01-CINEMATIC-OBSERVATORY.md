# G1-01｜電影式觀測所：第一個實際 Three.js 網站預覽

> 這是工程與美術候選；**不是已完成的最終美術作品**，也沒有取代正式首頁或通過手機真機驗收。

## 只有一個新版網站

| 網址 | 用途 | 本輪處理 |
| --- | --- | --- |
| `/Research-/` | 現行正式首頁 | 等 Owner 對照新站後再切換 |
| `/Research-/v3/observatory/` | 新網站唯一預覽 | Astro + Three.js 新站、四個連續內容章節 |
| `/Research-/v3/library/`、`search/`、`research/*` | 真實研究資料庫 | 保留來源 Markdown、SHA、Pagefind |
| `/Research-/v3/atlas/g1/` | 已退役的低多邊形實驗 | 只保留轉址；原 JS/CSS 刪除 |
| `/Research-/v3/atlas/` | 歷史美術研究 | 主入口改指向新版，舊構圖只用來比較 |
| `/Research-/v2/` | 舊展示站 | **待獨立清理 PR 移除發布產物**，不可連原始研究一起刪除 |

## 真正實作了什麼

- `site/src/pages/observatory/index.astro`：手機置中世界圖片、連續電影敘事、PBR 實驗展廳與真實研究分類及全文連結。第一屏讓畫面優先，避免大型文字壓住天文儀。
- `site/src/styles/cinematic-observatory.css`：暗海軍藍世界、暖金主光、冰藍輪廓、漸層玻璃和獨立手機構圖，沒有外部 CDN 字型。
- `site/src/experience/observatory/scene.js`：three@0.187.0、RoomEnvironment、MeshPhysicalMaterial、多軸天球、金屬刻度、24 條輪輻、48 枚齒輪、分層機座、柱廊、穹頂、星點和鏡頭進場。模型為本站程式生成的原創幾何，**不是 Blender GLB**。
- Three.js 只有捲動到場景才開始載入；無 WebGL、無 JS、強制 `?poster=1`、reduced motion 或丟失上下文都能保留視覺背景及研究連結。
- 將原先 public/atlas/g1 下的獨立低多邊形 WebGL2 JS/CSS 刪除，留下相容轉址；不留下 backup 或複製品。
- `site/tests/pages/observatory-preview.spec.mjs`：320、393、768、1440 測試、兩種截圖、真實研究連結、無 JS、功能退化與手機選單。截圖不等於 Owner Golden。

## 尚未達成的品質門檻

- Blender 原創精雕 GLB、UV、金屬貼圖與更完整建築材質仍待 G1-02；程式化幾何只能是美術與渲染的第一版。
- 真實 POCO Android、iOS、FPS、GPU timing、熱量、耗電、LCP/INP/CLS 需要可追溯測量，不可從截圖臆造。
- Owner 必須以實際手機畫面與最初美術參考對照，不接受僅以 CI 成功作為視覺合格證明。
- 舊 V2 靜態網站與重複發佈路徑應在獨立清理 PR 移除；`research/`、`docs/governance/`、`showcase/design/` 原始證據不可刪。
- 正式首頁在新站視覺通過後才切換，不直接把未驗證原型部署為唯一首頁。

## 範圍與安全

這包只修改 `site/`，新增一個確定的網站預覽及一套 Three.js 模組；不改 Ruleset、部署流程、密鑰、研究原文。Repo Git history 保有已刪除實驗的回溯能力，不需要保留多份舊網站複本。
