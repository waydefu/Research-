# 14｜10 種頂級 Web 特效：工程拆解、渲染流水線與 5 個 PoC
**更新：2026-11-02**　**證據：來源支援 API／原理；每個配方皆是原創最小算法思路，未部署、未測試。**

## 0. 共通實作契約
- **輸入正規化**：pointer `x,y`、velocity、time delta、scroll progress、touch gesture 將 UI 座標轉 scene 座標；手機沒有 hover，不能把 hover 當唯一操作。
- **畫面層**：可操作 DOM、可用主 CTA、選項、文字 → canvas 只作增強。Shader crash、Context lost、reduced motion 仍保持 Basic 功能。
- **渲染分離**：一個 RAF scheduler；轉場與 idle/offscreen 必須可 pause/cancel；畫質、材質、貼圖皆入 manifest。
- **工程成本分類**：低 = CSS/單-pass；中 = 幾個 GPU passes／1–2 類特殊資產；高 = 需 shader + 資產工具鏈 + 真機驗證；極高 = 流體數值/重度 3D/互動系統。**不把時間成本換算為沒有證據的人天。**

## 1. 效果總覽：10 種不同視覺機制
| 效果 | 視覺語言 | Rendering Pipeline | 所需庫／瀏覽器 API |
|---|---|---|---|
| 01｜Liquid Image Distortion | 圖片表面隨 pointer 產生局部液態折射，扭曲後回彈 | Pointer events → velocity splat → 2D flow field (FBO) → fragment UV offset → color output | WebGL2+GLSL（OGL 或 Three）；可選 WebGPU storage texture |
| 02｜RGB Split / Chromatic Aberration | 速度越快，邊緣 RGB 小幅分離，停下恢復乾淨 | input velocity → shader uniform → sample red/green/blue at offset UV → composite | GLSL/WGSL fragment；CSS 部分可用 pseudo-layer |
| 03｜Image Dissolve / Grain Transition | 雙張圖片經噪聲遮罩逐步溶解，不像單純 crossfade | progress + signed noise texture → smoothstep coverage mask → mix two samplers | WebGL2 fragment，或 CSS mask-image（效果較受限） |
| 04｜Bloom + HDR Cinematic Product | 金屬主產品保有亮部細節與柔和光暈，背景沉穩 | PBR scene → HDR buffer → bright pass → multi-scale blur → blend → tone map | Three.js/PlayCanvas/Babylon + postprocess |
| 05｜Volumetric Rays / Atmospheric Fog | 有方向的光柱穿過霧層，鏡頭移動有空間層次 | depth/volume noise → half-res ray march → temporal blend → upscale/composite | WebGL2 fragment / WebGPU compute；需 3D scene depth |
| 06｜Particle Assemble → Logo / Object | 散亂粒子沿有節奏軌跡聚合成 Logo 或產品輪廓 | pre-sampled target positions → GPU buffer / instanced draw → vertex interpolation | Three.js InstancedBufferGeometry、WebGPU compute 可選 |
| 07｜SDF Morph / Ray-marched Sculpture | 抽象幾何從球體漸變到品牌形狀、光澤自然連續 | fullscreen quad → SDF blend → sphere-trace → estimate normal → shade | GLSL fragment / WGSL；小物件可用 mesh morph 替代 |
| 08｜Interactive Water / Fluid Ink | 觸控後有水波、擴散與流速慣性，形成互動油墨 | pointer splat → velocity advection → divergence → pressure solves → dye advection → render | WebGL2 ping-pong FBO / WebGPU compute |
| 09｜3D Exploded View / Configurator | 產品配件沿真實分解線展開，標籤跟著零件、可選任意部件 | GLB nodes → product rules → interpolation local transforms → raycast selection → DOM overlay labels | Three.js／model-viewer 不一定具拆件 APIs，需專用 scene logic |
| 10｜Scroll-linked Camera Narrative | 捲動跨章節時鏡頭平滑切換主物件、文字保持可讀 | scroll progress → labelled timeline → camera spline / quaternion slerp → scene render → DOM text | GSAP ScrollTrigger 或 CSS scroll timeline + Three camera；使用者可跳章 |

## 2. 每種效果的最小實作思路與降級
### 01｜Liquid Image Distortion
**數學／偽碼：** `flow = decay(flow)+radialImpulse(pointerVelocity); uv2 = uv+flow.xy*strength; color=sample(image,uv2)`

**瓶頸：** Ping-pong texture、fullscreen sampling、透明 overdraw；重採樣易拖慢。**Mobile/Reduced motion：** 降流體網格／只保留 CSS mask ripple 或靜態圖。**難度／投入：** 高；約中高工程投入（需 shader + FBO + UX）。**狀態：**設計推導／未測試，非可直接部署的實作碼。

### 02｜RGB Split / Chromatic Aberration
**數學／偽碼：** `offset = clamp(speed*k,0,maxOffset); rgb=(tex(uv+o).r,tex(uv).g,tex(uv-o).b)`

**瓶頸：** 3 次貼圖採樣+整屏 fill-rate；文字可讀性降低。**Mobile/Reduced motion：** 只應用在主畫面短暫 transition；手機取消。**難度／投入：** 低～中；低工程成本。**狀態：**設計推導／未測試，非可直接部署的實作碼。

### 03｜Image Dissolve / Grain Transition
**數學／偽碼：** `m=smoothstep(p-width,p+width,noise(uv)); color=mix(A,B,m)`

**瓶頸：** 雙圖 decode／GPU texture memory；noise aliasing。**Mobile/Reduced motion：** 只 crossfade／poster，確保 preload 失敗仍可換圖。**難度／投入：** 中；中成本。**狀態：**設計推導／未測試，非可直接部署的實作碼。

### 04｜Bloom + HDR Cinematic Product
**數學／偽碼：** `high=threshold(hdr); blur=MipGaussian(high); out=tonemap(hdr+bloomGain*blur)`

**瓶頸：** HDR render targets、多 pass、depth/alpha artifacts。**Mobile/Reduced motion：** 降低 render scale／pass levels，Basic 直接渲染已輸出的圖。**難度／投入：** 中～高；高藝術校色投入。**狀態：**設計推導／未測試，非可直接部署的實作碼。

### 05｜Volumetric Rays / Atmospheric Fog
**數學／偽碼：** `for step in range(N): accum += density(pos) * lightVisibility(pos) * transmittance`

**瓶頸：** 每像素射線步數與陰影估算；重投影 ghosting。**Mobile/Reduced motion：** 手機取消體積光，改 billboards／CSS gradient light shafts。**難度／投入：** 非常高；高成本。**狀態：**設計推導／未測試，非可直接部署的實作碼。

### 06｜Particle Assemble → Logo / Object
**數學／偽碼：** `pos_i=mix(seed_i,target_i,ease(t))+noiseField(i,t)*(1-t)`

**瓶頸：** 大量透明粒子 overdraw、GPU bandwidth；CPU 逐粒更新造成長幀。**Mobile/Reduced motion：** 降粒子密度、減小點面積；Basic 顯示靜態 logo。**難度／投入：** 中～高；需資產點採樣。**狀態：**設計推導／未測試，非可直接部署的實作碼。

### 07｜SDF Morph / Ray-marched Sculpture
**數學／偽碼：** `d=mix(sdSphere(p),sdTarget(p),t); for raySteps: dist+=d; normal=gradientSDF(p)`

**瓶頸：** 每像素 marching 次數、法向梯度、glancing artifacts。**Mobile/Reduced motion：** 用預渲染影片／mesh target morph 或 CSS 矢量剪影。**難度／投入：** 高～極高；高成本。**狀態：**設計推導／未測試，非可直接部署的實作碼。

### 08｜Interactive Water / Fluid Ink
**數學／偽碼：** `advect(v,dt); div=divergence(v); repeat Jacobi(pressure); v-=grad(pressure); dye=advect(dye,v)`

**瓶頸：** 多輪 Jacobi + render targets，手機 bandwidth 與熱負載。**Mobile/Reduced motion：** 改低解析度波紋 ring，減 solver iterations，Basic 不跑 loop。**難度／投入：** 極高；需要數值穩定性與邊界條件。**狀態：**設計推導／未測試，非可直接部署的實作碼。

### 09｜3D Exploded View / Configurator
**數學／偽碼：** `for node of parts: mat=lerp(assembled[node],exploded[node],t); anchor=project(node.socket); updateDOM(anchor)`

**瓶頸：** draw calls、材質/紋理、文字遮擋、raycast、手機觸控精度。**Mobile/Reduced motion：** 折疊為 2D 零件圖＋列表，仍可查詢零件與選配。**難度／投入：** 極高；3D 資產分件/幾何準確性最昂貴。**狀態：**設計推導／未測試，非可直接部署的實作碼。

### 10｜Scroll-linked Camera Narrative
**數學／偽碼：** `s=clamp(scrollNormalized); cam.position=curve.getPoint(ease(s)); cam.quaternion=slerp(qA,qB,ease(s))`

**瓶頸：** scroll jank、長 pinned sections、scene 每幀渲染、視差暈眩。**Mobile/Reduced motion：** 每章定格圖、簡短 opacity transition；原生捲動不鎖定。**難度／投入：** 高；大量 UX/美術編排。**狀態：**設計推導／未測試，非可直接部署的實作碼。


## 3. 5 個獨立 PoC（**僅設計，尚未實際建立**）

### PoC-1｜液態圖片／折射表現力
- **比較：** A: 一張 WebGL2 fullscreen quad + flow FBO；B: CSS/SVG mask + pointer spring。
- **素材：**同一張合法圖片（固定尺寸與色彩管理），測不同 pointer 速度。
- **驗收：**基本文字/CTA 不被遮擋；Android 觸控與 desktop mouse 都能觸發；離開頁面 GPU buffers dispose；禁動畫時靜態圖仍可看。
- **量測：** production bundle、首輪 shader compile stutter、幀時間 p95、10 分鐘持續互動、網路弱環境載入；未填任何預估 FPS。
- **Go/No-go：** 如果 60 FPS 目標不達且無法降 tier，採 CSS 或靜態；若錯誤狀態僅黑屏直接失敗。

### PoC-2｜產品 PBR + 爆炸圖
- **比較：** GLB 真實分件 + meshopt/KTX2 vs 未壓縮 GLB；保持幾何、光源、相機一致。
- **核心測試：**每個配件節點 transform 正確；點按/鍵盤列表選配可返回同一個部件，部件命中與影像一致；貼圖壓縮的材質偏差由人工審核。
- **驗收：**桌面滑鼠、Android touch、iPhone Safari 真機；context loss 退回可操作的 2D 拆件示意。
- **量測：**傳輸 bytes、decode 時間、GPU texture memory（工具可讀才報）、draw calls、frame p95、裝置溫升；不做假 benchmark。
- **注意：**不能由 GLB 單一 mesh 推稱支援真拆件。

### PoC-3｜Scroll Story + View Transitions（無 3D 與小 3D 各一）
- **比較：**CSS scroll-driven + View Transitions、GSAP ScrollTrigger + Three 小相機。
- **驗收：**原生 scroll、back、錨點與手機鍵盤、焦點復原、reduced motion，沒有長時間不可用；支援 API 的能力切換正確。
- **量測：**INP、長任務、p95 frame time、scroll restore 錯誤率；手機弱網仍可直接閱讀文章章節。
- **Go/No-go：**若交互好看卻讓內容找不到位置，淘汰該方案。

### PoC-4｜GPU 粒子聚合：WebGL2 ↔ WebGPU Compute ↔ Static
- **同內容：**同量 target positions，三種 tiers 都要呈現同一 Logo／品牌意義。
- **驗收：**能力探測／requestAdapter 缺失／required feature 不符／WebGPU device.lost → 正確退回，basic 不丟失 CTA。
- **對照：**每幀粒子動畫 vs idle/static；改變粒子數、點半徑、render scale，觀察透明 overdraw。
- **測試：**Android Chrome 與 Safari 的最新可用版本；不把桌機 compute 的優勢外推手機。
- **Go/No-go：**若 Compute 方案不能有效證明相對成本收益，保留成熟 WebGL2 版。

### PoC-5｜品牌系統與「反 AI 模板」人體審查
- **三種品牌**：科技工具（HUD、密度）、奢侈品（攝影、材質）、編輯型（排版、留白）；內容與 CTA 一致，換 design tokens／art direction。
- **盲測**：無動態／無 GPU 的首屏、5 秒品牌識別、3 次 click 主任務、鍵盤＋螢幕閱讀器、不同文字長度與 CJK 斷行。
- **驗收：**辨識度不依賴通用漸層與玻璃卡；WCAG 2.2 AA 的可自動檢項及人工流程分開記；每個狀態都有可見回饋。
- **Go/No-go：**若移除動畫後失去層級和品牌識別，視覺設計退回，不靠堆 shader 掩蓋。

## 3.1 五個 PoC 的可重現性測試矩陣（設計方案；尚未執行）

**共通基線**：在開始前鎖定 Git SHA、依賴 lockfile、資產 hash、解析度／DPR、瀏覽器 build、OS、電源與測試網路；固定相同素材、畫面面積與輸入節奏。每組情境至少重複 **3 次冷啟動 + 5 次暖啟動**，較長的持續動畫另進行每次 **10 分鐘 × 3 回合** 觀察熱穩定；上述只是預先宣告的採樣計畫，不是完成的數據，也**不足以單獨宣稱統計顯著性**。

| PoC | A/B 對照場景 | 輸入與測試資料固定方式 | 可比較的主要輸出 | 錯誤注入與退出條件 |
| --- | --- | --- | --- | --- |
| 1 液態折射 | WebGL2 flow FBO vs CSS/SVG spring | 固定同圖 hash、畫面尺寸；重播相同 5 段 touch/mouse 軌跡與速度 | JS gzip、首次 shader compile、p95/p99 frame time、畫面相似性、觸控命中 | 關閉 WebGL2、移除 canvas、切 reduced motion；無遮 CTA、能回靜態圖 |
| 2 PBR 爆炸圖 | 分件 GLB + meshopt/KTX2 vs 同幾何未壓縮資產 | 固定攝影機、光源、拆件矩陣、配件數、貼圖品質容忍範圍 | 傳輸量、decode、顯存（可得才填）、draw calls、配件選取正確率 | 遺失/損壞 GLB、WebGL context loss、鍵盤操作；2D 零件列表仍能選配 |
| 3 Scroll Story | CSS scroll-driven + View Transitions vs GSAP + 小型 Three 場景 | 相同篇章文字、單一腳本捲動距離、錨點及 back/forward 任務 | 任務成功、跳章/回上一頁正確性、長幀／INP、JS parse/eval | 關閉各 API、禁動畫、錯誤導航與低速網路；主內容仍可讀 |
| 4 粒子聚合 | WebGPU Compute vs WebGL2 更新 vs 靜態 Logo | 同 target point 雜湊、初速種子、粒子數、像素覆蓋與渲染比例 | 每秒更新／顯示幀、p95 frame time、粒子 count、穩態功耗（可得才填） | requestAdapter=null、device.lost、編譯失敗；禁無限重試，回退 WebGL2／靜態 |
| 5 品牌 UI | 科技 HUD、奢侈品、編輯排版三種 Art Direction；有／無特效 | 相同文案、CTA、資訊架構；測試順序輪替避免學習偏差 | 首屏品牌回憶、CTA 完成、誤點、鍵盤／螢幕閱讀器可用性 | 禁用字型／動態／GPU，切換中英+CJK 長文；結構仍可辨識 |

### 測試環境與量測解讀

- **必要裝置覆蓋**：高階桌機、一般整合顯示筆電、高階 Android、中階 Android、iPhone Safari、WebGPU 不支援環境；無法取得真機時標 `NOT TESTED`，不可由桌面模擬假裝 Safari 真機結果。
- **Chrome/Edge DevTools** 記 Network／Performance trace、draw calls、Long Animation Frames（支援時）、GPU context loss；Safari Web Inspector／Android trace 用各自支援的資料。無法量測硬體 GPU memory／power 的欄位用 Unknown。
- **FPS／p95**：指定刷新率和互動區間，不把 `requestAnimationFrame` 間距直接視為 GPU 時間；60Hz 約 16.67ms 僅為理論預算。比較兩方案前分別標記 GPU 與 Main Thread 的瓶頸；無實測不提供 FPS 勝負。
- **資料與隱私**：腳本化假資料、不上傳訪客識別資訊；暈眩測試需明示可退出；不在未授權環境蒐集硬體指紋。
- **可合併的 Go/No-go 記錄**：每組填 `PASS / FAIL / UNKNOWN`、理由、trace 路徑與 SHA。主導航、鍵盤可用性、基本 CTA、減少動態、GPU 失效退場若失敗即 `NO-GO`；純美術偏好由人體評審與一致性問卷另列，不用跑分取代設計品質。
- **變更控制**：先完成 PoC-1、2、3 的比較；只有遇到 WebGL2 的可重現性能限制時才研究 PoC-4 GPU Compute 的收益。每次測試輸出同一模板，保存失敗案例供回歸。

## 4. PoC 的統一測試報表模板
| 欄位 | 內容 |
|---|---|
| commit SHA / dependency lock | 精確可重做版本 |
| device / browser / GPU | 型號、OS、browser 版本、GPU Adapter（可取得才填） |
| resolution / DPR / tier | 物理與 CSS 像素區分 |
| asset baseline | GLB/圖片 checksum、texture format、shader feature |
| quality | 目標／實際受控畫質設定、render targets、pass 數 |
| CWV | Field RUM p75；沒有真實訪問樣本標 Unknown |
| frames | p50/p95/p99 frame time、jank、shader first-use stutter |
| resources | JS gzip+parse、net bytes、memory、功耗／溫度（可取得才填） |
| UX | nav、focus、scroll restoration、reduced motion、touch |
| negative tests | no WebGPU、no WebGL2、lost context、network fail、tab idle |
| evidence | trace/screenshot/video/console log、測試日期、執行人 |
| decision | adopt／defer／reject，並附原因、回退方法 |

## 5. 參考依據（非演算法唯一實作）
- [WebGL2](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext) · [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
- [Three.js Examples](https://threejs.org/examples/) · [Three WebGPU TSL](https://threejs.org/manual/pages/webgpurenderer)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) · [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Khronos glTF + PBR](https://www.khronos.org/gltf/) · [KTX2](https://www.khronos.org/ktx/)
- [Paper Planes 原作者的 GPU Instancing + Web Worker 比較](https://medium.com/active-theory/paper-planes-6b0008c56c17)
- [Chrome Rendering DevTools](https://developer.chrome.com/docs/devtools/rendering/performance) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
