# 22｜電影式 Web：捲動敘事、場景素材、玻璃效能與無障礙驗收

**查證日期：2026-11-03（Asia/Taipei）**  
**適用範圍：** 一般內容型、品牌型、研究館式沉浸網站；不綁特定產品或第三方美術素材。  
**證據類型：** 官方公開規格／指引（A），Repo 程式靜態分析（B），待真機確認的假說（C）。  
**執行邊界：** 此文件只提供研究、決策與測試方法；不等於性能實測或 P1 美術簽核。

## 一、核心問題與決策

將一般網站的多個區塊改成「同一張背景 + 透明卡片」**不會自動形成電影敘事**。成功的連續體驗至少需要：
1. **世界連續**：不因內容章節切換而突然替換背景、跳動捲軸或強制全畫面滑動。
2. **節奏連續**：進場、研究、證據、典藏四種章節，以漸層、光照、字級及空間密度建立清晰過渡。
3. **任務連續**：真實文章、搜尋、領域和返回入口可以自然導航；連結名稱必須與目的地一致。
4. **失效可用**：無 JS、低階 GPU、減少動態、無模糊支援時仍能閱讀與操作。

此四點是本研究的原創設計判斷，不是 Google 或 W3C 的量化評分。

## 二、捲動敘事技術選型（2026-11-03）

### 優先採用：原生捲動 + 漸進增強

- 靜態首屏必須先成立：真實 HTML、正確 heading hierarchy 和可聚焦連結。
- 可支援的瀏覽器使用 CSS `animation-timeline: scroll(root block)` 或 `view()`，只對**裝飾性**的 transform／opacity 做局部慢速變化。
- 不支援 CSS Scroll-Driven Animations 時，允許以**被動 scroll listener + requestAnimationFrame** 更新少量 CSS 變數；禁止接管原生捲動、要求使用者等動畫結束才能看內容。
- `prefers-reduced-motion: reduce` 必須停止非必要動態。動畫預設不能成為發現內容的唯一手段。
- **風險**：MDN 將 `animation-timeline` 列為 Limited availability；不能直接認定所有瀏覽器都能跑。僅因 CI Chromium 通過，不等於 iOS Safari、低階 Android 通過。

**官方根據：**
- Chrome： [Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- Chrome： [Scrollytelling — Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/scrollytelling)
- MDN： [animation-timeline 相容性](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline)

### 四段敘事建議（設計規格，非性能數據）

| 章節 | 文字與場景關係 | 動態限制 |
| --- | --- | --- |
| 00 進場 | 主視覺清晰、繁中標題優先、最少遮罩 | 不強制滾動、不自動鏡頭旋轉 |
| 01 精選研究 | 逐步加深遮罩；文章以編輯式清單承接場景 | 結構不因動畫改變；未載入仍可閱讀 |
| 02 證據概覽 | 用小比例金色分隔及文字排版替代大量浮動卡片 | 優先 opacity／transform |
| 03 知識典藏 | 背景暗、可閱讀性高、分類及搜尋明確 | 無 JS／Reduced Motion 不丟內容 |

避免只用「第一個 viewport 就達到最深遮罩」來冒稱跨頁敘事。

## 三、圖片：外部快取、關鍵路徑與響應式

### 可直接採用

1. 相同圖片**只保留單一資產網址**，不要重複把 WebP base64 塞在 HTML／CSS／img 中；這能移除 HTML 重複字元，也讓圖片可獨立快取。
2. CSS 背景如可能參與 LCP，應在 `<head>` 使用 `<link rel="preload" as="image" fetchpriority="high" type="image/webp">`，適當用 `media` 避免桌機與手機圖片同時搶資源。
3. 非首屏文章縮圖保留 `loading="lazy"`；避免將 LCP 圖片 lazy load。
4. 如果需 Astro 自動生成 responsive `srcset`，應考慮匯入 `src/assets` 後使用 `astro:assets`；**`public/` 素材只原樣複製，不會經 Astro 圖片最佳化**。對不想改動視覺的高保真原型，先抽出 WebP 檔比貿然轉圖安全。
5. 靜態圖尺寸、LCP 效果、HTTP 傳輸大小與快取命中率分開量測；**不能把 HTML 縮小百分比當成載入時間縮短百分比**。

**官方根據：**
- web.dev： [Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp)
- web.dev： [Optimize CSS background images with media queries](https://web.dev/articles/optimize-css-background-images-with-media-queries)
- Astro： [Project structure: public assets](https://docs.astro.build/en/basics/project-structure/)
- Astro： [Image and Assets API Reference](https://docs.astro.build/en/reference/modules/astro-assets/)

## 四、玻璃、字型與語意導航

- `backdrop-filter` 只有在背景透明或半透明時有視覺作用；父層 backdrop root、透明度、mask 等可能改變實際模糊範圍。不要將全畫面疊加多層模糊當作高級質感的充分條件。
- 建議用一段可讀的深色漸層玻璃區，Hero 保持清晰；手機可以降低 blur 半徑，模糊不可用時降級為較不透明背景。
- 中文主內容以繁中為主標題，英文作輔助；字型候選的 CSS 字族聲明不能證明實際字型已載入。未取得授權檔與完整 glyph coverage 前，不宣稱已做受控字體盲測。
- 「搜尋」「研究領域」「典藏館」「舊版總覽」必須連到對應功能。內部路由不應刻意打開新分頁，除非交互需求另有說明。
- `focus-visible`、跳過導覽、焦點恢復與 Esc 關閉 Modal 必須持續測試；無 JS 的原始研究連結仍必須可用。

**官方根據：**
- MDN： [backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter)
- W3C WAI： [WCAG 2.2 New Success Criteria](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

## 五、不可用 CI 全綠替代藝術與效能驗收

**功能證據：** 320／360／393／430／768／1440px 無水平溢出；原始文章 URL 真實存在；圖片能載入；鍵盤焦點、手機導覽、無 JS 與 reduced motion。  
**視覺證據：** 六種尺寸首屏、每個章節銜接、章節中段、底部及高對比模式截圖，由 Owner 對照先前核准的神殿美術；必要時做前後並排人工差異審查。  
**效能證據：** 不限於 Playwright assertions；DevTools Performance、Network waterfall、Lighthouse 與真機 FPS／掉幀／熱負載都要分別量測。  
**Core Web Vitals 目標：** LCP ≤2.5 秒、INP ≤200ms、CLS ≤0.1，依行動與桌面**實際資料第 75 百分位**判定；沒有數據時明標「未量測」。

**官方根據：** [web.dev Web Vitals](https://web.dev/articles/vitals)

## 六、Research- P1 觀察（專案案例，非通用基準）

- 2026-11-03 P1 HTML 原始長度約 1,608,476 字元（JavaScript 字串長度，非網路傳輸 bytes），內嵌 9 處 WebP Data URI，但只有 5 份不同圖片資料。第一輪將圖獨立化後，HTML 原始字串長度變為 51,420 字元；圖像內容仍要另外傳輸，**不可解讀為網頁快 96%**。
- P1 原有遮罩在約 0.9 個 viewport 高度達到最大值；後續改用四階段控制，仍屬**靜態神殿背景上的捲動視覺**，不是實體 3D camera 或 WebGL。
- P1 功能變更在單獨的 [#24](https://github.com/waydefu/Research-/pull/24)；此報告以獨立研究 PR 提交，沒有對主站部署、合併或變更框架。
- 此節數據是對指定原始碼版本的靜態檢查，待 PR 最新 CI、人工觀感與真機報告補齊後才能更新結果。

## 七、P1 → P2 Gate

先完成影片式視覺語言、內容導覽、素材去重與無 JS 功能，再做實機測試及 Owner 視覺驗收；**未經 G0 美術簽核，不因工程測試全過就進入 Three.js／GSAP／Blender P2**。

<!-- 查證更新：2026-11-03；外部來源為官方文件，個案數字為 Research- 靜態程式分析；無未經實測的性能勝率宣稱。 -->
