# Noniv / Web Ocean：如何用原生 WebGPU、FFT 與物理式光照渲染海面？

**研究日期／來源最後核對：2026-11-06（Asia/Taipei）**  
**上游定位：** [Noniv/web-ocean](https://github.com/Noniv/web-ocean)，已閱讀 GitHub 原始碼 `a07c7fd522ef0a897601c114f927a49d93d95520` 版（README、LICENSE、`js/main.js`、WGSL 模組、`build.mjs`）。  
**分類：** 原生 WebGPU／GPU Compute／海洋波譜／LOD／即時光學與後製。  
**證據邊界：** 程式碼中的構造與數值可直接核對；美術感受、行動裝置 FPS、作者自報效能及線上 Demo 的執行結果**未獨立驗證**。本研究不安裝、複製或部署原作者程式。

## 1｜作品到底做了什麼？

[Web Ocean 線上互動展示](https://ocean-noniv.vercel.app/) 是一個以原生 WebGPU 呈現無邊界海面、夕陽倒影、浪花、天空雲層與自由飛行鏡頭的技術作品；[官方 Repo](https://github.com/Noniv/web-ocean) 直接提供可讀的 JavaScript 與 WGSL 模組。它**沒有使用 Three.js 或其他 3D 渲染引擎**，適合作為學習低階渲染流程的案例，而非即插即用的 React 元件或完整遊戲引擎。

作者 README 說明以 Claude Code（Opus 5.5）協助完成，並透過無頭 Chrome 截圖及批判代理迭代視覺。這是**作者的開發過程描述**，不能從成果推論模型可穩定獨立做出相同水準。

## 2｜從頻譜到畫面的實際管線

| 工程階段 | 在原始碼中的依據 | 能解決什麼／不能推論什麼 |
| --- | --- | --- |
| 頻譜初始條件 | [sim.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/sim.js)：JONSWAP、Donelan–Banner 方向展寬及長週期湧浪 | 海浪有風場與波向的統計依據；不等同真實海岸 CFD |
| 頻域隨時間演進與反 FFT | `SIM_EVOLVE`、`FFT_ROWS`、`FFT_COLS` WGSL compute pass | 將各波數的振幅與相位換成可採樣位移；需 GPU Compute |
| 多尺度位移 | [common.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/common.js) 定義 `N=256`、`CASCADES=6`；[main.js](https://github.com/Noniv/web-ocean/blob/main/js/main.js) 有六個 patch 尺度 | 六層 256×256 瀑布式頻譜覆蓋大浪到微小波紋；不是「所有波都能物理正確重現」 |
| 幾何 LOD | [ocean.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/ocean.js)：CDLOD morph 與視點相對頂點位移 | 用四叉樹靠近相機提高密度，遠處節省幾何；作者報告 17 階、160 km，未獨立量測 |
| 水面反光 | [ocean.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/ocean.js) 的水面著色、波面坡度統計、environment cube sampling | LEAN 一二階斜率矩和 mipmap 用來抗閃爍與近遠粗糙度過渡 |
| 泡沫／浪尖 | [sim.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/sim.js) 的泡沫生成與更新、`FOAM_UPDATE` | 以位移 Jacobian、壽命及風向讓白浪持續存在，而非純白色貼圖 |
| 天空、雲與後製 | [sky.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/sky.js)、[post.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/post.js) | 大氣 LUT、兩層程序雲、HDR、Bloom、AgX；並非 volumetric cloud 或完整全球天氣模擬 |

**易讀錯的地方：** `js/main.js` 首行舊註解寫「5 cascades」，`js/wgsl/sim.js` 首行舊註解寫「4 cascades」，但 **實際常數是六層**，`main.js` 也明列六個尺度 `[1103.0,211.3,39.7,7.43,1.393,0.2617]`。本篇按*可執行的常數與資料結構*解釋，不把過期註解視為當前規格。README 所述 6 cascades 與有效常數一致。

## 3｜視覺品質取決於多層光學協作

- **Sun glitter：** 用斜率統計、各向異性分布、太陽視角及遮蔽項控制夕陽高光，不只是給水材質一個亮色。
- **環境反射：** 天空 cube map 隨場景更新，多級 roughness filtering 抑制遠景反光鋸齒。
- **空氣透視：** 多重散射大氣 LUT、薄霧與太陽方向的雲層遮蔽，使水平線能融合海面與天空。
- **近岸限制：** 作品模擬外海；**沒有海岸線、岸邊碎浪、物體互動或真實流體碰撞**。要做港灣或陸地交界，需另外設計 shallow-water／岸線泡沫模型。

可對照既有 [高階海洋 Shader 配方](28-advanced-shader-pipeline-and-hd2d-recipes.md)，理解頻譜海浪與近岸模型的差異；本作品證明原始碼**存在此工程架構**，不是獨立驗證視覺或效能上限。

## 4｜建置、相容性、授權及實際限制

[官方 build.mjs](https://github.com/Noniv/web-ocean/blob/main/build.mjs) 會合併 `index.html`、`js/main.js` 和 WGSL 模組，輸出單檔 `ocean.html`、`ocean.min.html`；作者稱後者約 **61 KB**（非本次壓縮實測），能從 `file://` 開啟。正式運行仍依賴支援 WebGPU 的瀏覽器與 GPU；**單檔／無引擎 ≠ 所有裝置都能跑**。

作者 README 自報在 RTX 5070 Ti、2560×1440 解析度、同時有其他 GPU 工作的情境，約 **6–8 ms GPU time / frame**。缺少獨立 GPU trace、測試場景及多裝置數據，不能直接推導成手機 120 FPS 或穩定 60 FPS。需分別驗證 WebGPU adapter、`timestamp-query` 支援、GPU lost、背景／前景恢復、電池與熱降頻；缺 WebGPU 時應保留靜態海面圖或其他相容模式，不可假定可以自動轉成 WebGL2。

[LICENSE](https://github.com/Noniv/web-ocean/blob/main/LICENSE) 標示 MIT，版權歸屬為 **Maksymilian Dendura（2026）**。重用原始碼需保留著作權及授權聲明；外部素材、來源圖片、商標與展示平台條款仍應逐項核對。此處僅保留原始連結，沒有重製作者截圖、模型或 Shader。

## 5｜可重現的驗收設計（尚未執行）

| 檢查 | 測試方式 | 最低要保留的證據 |
| --- | --- | --- |
| C1 海浪 | 同一 seed、風速／湧浪／攝影機初始值比對畫面 | 上游 commit、擷取時間點與影像、Shader 編譯紀錄 |
| C2 反光與白浪 | 低／高太陽仰角、0／高風速、關閉與啟用泡沫 | 同一畫面尺寸的差分及主觀誤差紀錄 |
| C3 幾何與精度 | 近海面與 30 m 高處、遠景、低速飛行 | Quadtree patch 數、接縫、畫面閃爍紀錄 |
| C4 效能 | 桌機 GPU 與 Android 裝置相同畫質／相同時間軸 | 平均與 p95 GPU time、FPS、解析度、溫度與耗電 |
| C5 降級 | 無 WebGPU、瀏覽器分頁隱藏、device loss | 可閱讀錯誤狀態、恢復或可用 fallback |
| C6 權利 | 檢查工程原始碼與每個額外素材 | LICENSE、第三方來源台帳、發布用途 |

**採用結論：** 推薦作為原生 WebGPU 海洋渲染的高品質*原始碼研究候選*；不建議直接完整嵌入一般內容頁或手機遊戲，直到固定條件基準、權利與行動裝置熱／電耗驗證通過。**尚未安裝、運行、部署或實機驗證。**

## 來源台帳（2026-11-06）

- [Noniv/web-ocean 官方 README](https://github.com/Noniv/web-ocean/blob/main/README.md) — A：作品敘述、作者自報效能、限制與使用方法；自報值非獨立量測。
- [common.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/common.js)、[main.js](https://github.com/Noniv/web-ocean/blob/main/js/main.js)、[sim.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/sim.js)、[ocean.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/ocean.js)、[sky.js](https://github.com/Noniv/web-ocean/blob/main/js/wgsl/sky.js)、[build.mjs](https://github.com/Noniv/web-ocean/blob/main/build.mjs) — A：直接閱讀的程式碼構造；未編譯／實際執行。
- [MIT LICENSE](https://github.com/Noniv/web-ocean/blob/main/LICENSE) — A：上游原始碼授權文字；非第三方素材的完整法律清查。
- [線上展示](https://ocean-noniv.vercel.app/) — 原作者作品連結；本研究環境無法可靠執行其 WebGPU 畫面。
- 採用與 benchmark 規格 — C：本文工程推導；**NOT RUN**。
