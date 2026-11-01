# 07｜效能、兼容、可及性：要有可驗證門檻

## Google Core Web Vitals 正式門檻（p75，行動／桌機分開）

| 指標 | 官方良好門檻 | 用途 |
| --- | --- | --- |
| **LCP** | ≤ **2.5 秒** | 主要內容開始可見 |
| **INP** | ≤ **200 ms** | 使用者互動延遲 |
| **CLS** | ≤ **0.1** | 畫面位移穩定性 |

來源： https://web.dev/articles/vitals

**注意：** Core Web Vitals 不是 3D FPS、初始 JS Bundle、GPU 記憶體或電池耗電的直接替代指標。

## 建議的工程性能預算（是目標、不是實測）

| 場景 | 初始目標 | 量測方式 |
| --- | --- | --- |
| 一般內容頁 | 滿足 CWV 良好門檻 | CrUX/RUM + Lighthouse/DevTools |
| SPA 導航與表單 | INP p75 ≤ 200ms | 真實互動測量 |
| 3D 前景主要視覺 | 高階目標 60 FPS，行動中階可設 30 FPS fallback | frame time、p95/p99、GPU profile |
| 3D 後景特效 | 網頁不在前景時停止；reduced motion 時簡化 | Page Visibility + motion preference |
| 離線與慢網 | 核心導航或必要功能仍可操作 | 模擬慢網、離線 E2E |
| 弱 GPU | 退回基本 UI，不因渲染失敗導致功能無法操作 | 裝置矩陣 |

**60 FPS 是每幀 16.67ms 的預算，不是所有 CPU/GPU 工作總能分到完整 16.67ms。** 需要觀察尾延遲與負載尖峰，而非只有平均 FPS。

## 與框架有關的效能風險

- Next SSR：TTFB、Server Functions latency、Cache invalidation、RSC payload、Hydration。
- SPA：client JS bundle、路由懶載入、長任務、首次有效互動時間。
- Astro：island hydration 數、第三方 widget 與字型下載。
- GPU 頁：Shader compilation、Texture 上傳、Draw calls、device lost、GPU memory、手機溫度。

## 可及性與真正的使用者體驗

- Semantic HTML / Accessibility Tree、鍵盤操作、焦點返回、錯誤訊息、Screen Reader。
- WCAG 2.2 AA 可作驗收基線；自動工具不足以替代人工檢查。
- 尊重 \`prefers-reduced-motion\`、避免動效造成嚴重暈眩或障礙。
- 文字、表格、主要控制項優先放 DOM，而非純 3D Canvas。
- 支援手機觸控大小、縮放、螢幕旋轉與軟鍵盤。

## 可重做的測試設計

1. 固定同一組內容、素材大小、交互、框架版本、裝置與瀏覽器。
2. 做冷／暖快取、弱網、低電量、長時間運作等情況。
3. 記錄 p50/p75/p95、失敗率、錯誤與掉幀；不要只展示最佳單次錄影。
4. 每個建議要附「前／後」差異與代價，才可宣稱優化成功。

來源：
https://web.dev/articles/vitals
https://developer.mozilla.org/en-US/docs/Web/Accessibility
https://www.w3.org/TR/WCAG22/
https://developer.chrome.com/docs/devtools/performance/
