# 11｜Web Motion × WebGL/WebGPU × 電影級效果原理
**查證：2026-11-02**　**類型：工程研究／建議方案；本文沒有實機 GPU Benchmark。**

## 1. 架構：不要讓渲染器接管整個網站

\`\`\`text
Semantic HTML + CSS (SEO, nav, forms, focus, screen reader)
  ├─ Design tokens / CSS layout (desktop + mobile)
  ├─ UI state & input normalizer (mouse/touch/keyboard/gesture)
  ├─ Motion director (CSS/WAAPI/GSAP/Motion, 只選必要層)
  └─ Scene adapter (isolated canvas; can be disposed)
       ├─ frame scheduler + visibility / quality policy
       ├─ WebGPU or WebGL2 renderer (只選一個主引擎)
       ├─ scene graph / GPU buffers / assets
       ├─ postprocess graph (bounded passes)
       └─ fallback poster + accessible text
\`\`\`

**設計原則：** 導覽、語意、表單不變成 GPU texture；UI 綁定 scene state，但 WebGPU device lost 不得造成站點不可用。風格由美術系統定義，GPU 是一個可替換的實作。參考 [Three WebGPURenderer](https://threejs.org/manual/pages/webgpurenderer) 與 [MDN WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)。

## 2. 主要渲染引擎選型與限制

| 引擎／介面 | 最佳使用情境 | 真正能力與 trade-off | 風險／選擇 |
|---|---|---|---|
| Three.js WebGLRenderer | 自訂品牌場景、GLSL、普遍 WebGL2 | Scene graph、PBR、ShaderMaterial、postprocessing | 3D 管線可控；仍需量測 draw calls、記憶體 |
| Three.js WebGPURenderer + TSL | 新 shader、GPU Compute 候選 | WebGPU 優先、WebGL2 fallback；TSL 產生 WGSL/GLSL | 官方仍稱 experimental；GLSL ShaderMaterial、legacy EffectComposer **不直接相容** |
| React Three Fiber | React 已為主 UI 且 3D 需要宣告式生命週期 | React 封裝 Three，搭配 Drei | 不使 Three shader 自動變快，防止逐幀 React setState |
| Babylon.js | 複雜 3D 互動、物理、較完整引擎功能 | 完整物件、材質、XR 模組化 | 一般純廣告頁常不需要全部能力 |
| PlayCanvas Engine | 重度 3D 應用、遊戲、XR | WebGL + WebGPU 生態，物件生命週期 | 與團隊既有 three 資產和程式碼生態要驗證 |
| OGL | 少物件、全螢幕 fragment shader、圖片液化 | 精簡低抽象 WebGL | API 與官方 release 節奏較少，須自己處理完整 3D pipeline |
| WebGL2 / GLSL ES 3 | 自訂多 pass 2D/3D GPU 效果 | fragment/vertex shaders、FBO、Instancing | CPU→GPU 傳輸、同步、狀態管理 |
| WebGPU / WGSL | compute particles、GPGPU、複雜 render graph | Compute pass、storage buffer、pipeline | Browser support 非 Baseline；feature/limit/device lost 必須逐台檢驗 |
| Canvas 2D / OffscreenCanvas | 文字筆觸、2D 粒子、剪影、過渡 | Worker 轉交部分 Canvas；非所有路徑可在 worker | 大量逐 pixel readback 慢；保留 DOM |
| CSS / SVG / WAAPI | 文字、UI、遮罩、相容型高質感動效 | 原生動畫和合成層，少套件 | 大濾鏡、大 blur、複雜 filter 仍可能高成本 |

**WebGL2 fallback 不等於 WebGPU Compute 的 fallback。** 如果用 compute shader 維護大量粒子位置，降級需改成 CPU Worker 或 ping-pong FBO（可用的 WebGL 浮點 texture/extension 需檢測），必要時減量或換靜態圖。來源：[Three WebGPU migration](https://threejs.org/manual/pages/webgpurenderer)；[WebGPU device lost](https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/lost)。

## 3. Shader、材質、光影與後製層

| 效果 | 可執行的基礎算法 | 主要瓶頸（非 benchmark） | 一般商業網站適用性 |
|---|---|---|---|
| PBR 金屬／粗糙度 | GGX BRDF + IBL（prefilter env map、BRDF LUT）+ normal/roughness map | 多光源、reflection lookup、texture bandwidth | **高**：產品主展示；控制光源與貼圖 |
| HDR Environment / ACES tone mapping | HDR cubemap → PMREM/prefilter → scene linear HDR → tone map → sRGB | HDR 解碼、cubemap storage、filtering | **高**：只在主物件使用 |
| SSR／近似光線追蹤 | 深度與法線重建 view position，再沿反射向量 screen-space ray march | 大量 texture taps、遮擋缺失、螢幕外反射無法表示 | **中**：desktop 額外 pass；mobile disable |
| Bloom | HDR 亮度擷取→mipmap blur→合成（保亮部層次） | 多 render target、fill rate、blur | **高**：低強度，避免全域發光 |
| Depth of Field | depth→CoC→多尺度 scatter/gather blur→composite | 多次 sampling；透明物件 artifacts | **中**：場景轉場或定格，互動 UI 避免 |
| Motion Blur | 前後幀 motion vectors + depth velocity gather | vector texture、多 taps、ghosting | **低～中**：短 cinematic 鏡頭，手機關閉 |
| Volumetric Fog／Lighting | depth ray marching、3D noise/froxel、temporal reprojection | step count、bandwidth、噪點／reprojection | **偏高階**：縮步數+降分辨率，不可強行全覆蓋 |
| Glass / refraction | 透射 IOR + env/background sampling + roughness | 多層透明排序、背景 texture read、overdraw | **中**：主 Hero 小區塊 |
| SDF／Ray marching | 距離函數場沿 ray sphere tracing，法向梯度估計 | 每像素步數 × 覆蓋面積，錯誤距離造成破面 | **中／高階**：小面積抽象 art object |
| Fluids | 速度場 advection→divergence→pressure Jacobi→gradient subtract→dye advection | 多 ping-pong passes、texture read/write | **偏高階**：local pointer field，手機弱化 |
| GPU particles | storage buffer／transform feedback／texture FBO 更新，再 instanced draw | 粒子更新、透明 overdraw、排序 | **高**：可採點精靈／低覆蓋 |
| Morph / deformation | attribute morph weights、vertex displacement、skinning | 頂點數、法線重建、CPU upload | **高**：真實模型轉場 |
| Instancing／LOD／culling | 重用 mesh/material、instance matrices、遠距 mesh simplification | draw-call CPU 降低但 raster/fill 仍存在 | **非常高**：先做，再決定增加效果 |
| GPU compute | Compute pipeline dispatch → storage buffers → render | pipeline compile、sync、硬體 fallback | **高階且有條件** |

### 3.1 GPU Frame Graph（僅示意，順序依 alpha／TAA 方案而變）
\`\`\`text
Assets decode / KTX2 transcode (loading; outside frame)
→ update visible state + Worker inputs
→ depth pre-pass (only if profiling justifies)
→ opaque PBR scene + shadow maps + environment
→ transparent pass / particles (watch overdraw)
→ optional SSAO / fog / bloom / DoF / SSR (each separately budgeted)
→ TAA/AA or resolution upscaling (engine-specific)
→ tone mapping + color management
→ UI DOM compositing, not drawn into 3D framebuffer
\`\`\`

**不得把「光追感」寫成硬體 ray tracing：** SSR、IBL、SDF ray marching 都能模擬某些反射／空間視覺，但與 path tracing / hardware RT 不同。詳見 [glTF PBR](https://www.khronos.org/gltf/)。

### 3.2 線性空間、色彩與素材
- albedo／一般照片為 sRGB → shader 計算轉 linear，normal/roughness/metallic **不得**當 sRGB 色彩貼圖處理；最後 tone map＋輸出轉換。
- 依 Khronos [KTX Artist Guide](https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXArtistGuide.md)，\`KTX2\` 比 PNG/JPEG 更可能保留 GPU 壓縮狀態；但 **傳輸檔案不保證更小**，轉碼成本需測。
- 建議 glTF/GLB、\`KHR_texture_basisu\`（KTX2）、\`EXT_meshopt_compression\`；高品質 normal 選擇 UASTC 候選；色彩圖可以試 ETC1S。建立 visual golden image，確認壓縮 artifacts。
- 建議每個資產帶 \`license/source/version/materials/lods/texture_formats/fallback\` 中繼資料；不要誤把素材庫存視為全部可商用。

## 4. Web 動態與互動「做什麼、花什麼」

| 技術／效果 | 原理／同步策略 | 工作量（相對） | 成本與 UX 注意 |
|---|---|---|---|
| CSS transition/animation | compositor-friendly transform/opacity | 低 | 用 design tokens；少量延遲，拒絕 hover-only |
| Web Animations API | browser-managed timeline，cancel/finished | 低～中 | focus 與狀態改變不必等待動畫結束 |
| GSAP / timeline | imperative clock + scrub + labelled sequence | 中 | 複雜電影鏡頭與多元素調度；需 scope/cleanup |
| ScrollTrigger | scroll progress → timeline、pin、scrub | 中～高 | pin 會改變閱讀節奏，測鍵盤／回上一頁位置 |
| CSS scroll-driven | scroll/view timeline → CSS animations | 中 | 漸進增強；支援缺口時直接正常顯示 |
| Motion | layout measurement / spring / gesture、React 或 JS | 低～中 | React 生命週期；重 layout 時測重排 |
| Rive state machine | compiled vector art + events + states | 中 | 品牌角色或按鈕互動，素材 runtime 和授權查核 |
| Lottie / dotLottie | authoring JSON/二進位動畫播放器 | 低～中 | 複雜遮罩可能慢，避免大量同時播放 |
| Native View Transitions | old/new DOM snapshot → pseudo-element blend | 低～中 | 不支援時直接導航；focus/scroll restore 不能忽略 |
| Shared element | 同一識別元素跨視圖成對與位置差值 | 中 | 要保持元素穩定 identity，避免 layout shift |
| Smooth scroll / Lenis | 重新分配 wheel/touch 的滾動慣性 | 中 | 非必要；anchor、native selection、accessibility 謹慎 |
| Kinetic typography | 字元／單詞分層、timeline + overflow mask | 中 | 語意仍留原文、避免讀屏重複 |
| Text reveal / Split Text | line/word segmentation + clip | 中 | 換行／字型載入改變需要重建；文字可選 |
| Image sequence | scroll/time → image decode frame | 中～高 | 大量圖片、記憶體、網速；用 video/AVIF poster 替代 |
| Cursor/hover/magnetic | pointer velocity → spring position/deformation | 中 | 無 pointer 的裝置停用；不能移走可點擊 hit target |
| Gesture/camera | drag velocity → quaternion/camera easing + clamp | 高 | 需要可鍵盤控制、reset view、避免眩暈 |
| Transition choreography | prefetch → exit→update→enter→focus restore | 中～高 | 鎖輸入時間短、故障保證導覽成功 |

**排序：** DOM/CSS 基礎 → 有必要才使用單一 Motion Director → WebGL → WebGPU Compute。對技術選型，不能只比較 npm package 大小；還要量測 parse/eval、動畫 long tasks、GPU render passes。

## 5. 可重複利用的高階特殊效果
- **液態圖片／屈折**：將滑鼠軌跡寫入 velocity/normal map；fragment \`uv += flow * amplitude\` 後對原圖取樣。對應手機改單次 ripple 或 CSS mask。
- **RGB Split／色差**：各色頻道以不同方向偏移取樣，幅度依速度，不要常駐高亮造成閱讀干擾。
- **Glitch／數位雜訊／Film Grain**：用受控 deterministic noise + row offsets，低強度且只作用於背景層；禁在主要字上長時間閃爍。
- **粒子聚合**：每粒 \`mix(startPos,targetPos,easedProgress)\`；動畫結束恢復靜態圖形。尺寸有級差，避免粒子填滿手機螢幕。
- **玻璃／全息／金屬**：玻璃以實際環境反射、透射、厚度／色散近似；全息掃描線僅為 art direction，不是 PBR 自然材質。
- **SVG + Canvas + GPU**：DOM 文字／控件前景、SVG 路徑剪切、GPU shader 背景。對 pointer/scroll 使用同一標準化輸入，不要每層各掛全域 listener。
- **實體回饋**：彈簧模型 \`a=(target-x)*k-v*c; v+=a*dt; x+=v*dt\`，必須對 \`dt\` clamp，tab 切回不能瞬間爆炸。
- **3D 爆炸圖**：以產品邏輯節點和拆裝約束決定路徑，動畫以零件局部座標 + easing；不應只播放不可操作的 FBX 影片。
- **Render-to-texture image reveal**：雙 sampler 紋理與 mask mix、少量 noise/displacement；緩慢網路直接顯示 alt/poster。

## 6. 三類不同的證據
- **官方明文可確認：** WebGPU MDN Limited availability；Three WebGPURenderer fallback/TSL/migration constraints；CSS compositor 建議；WCAG 2.2 AA（見來源）。
- **研究推論：** 全螢幕重 blur、重度 fog、SSR 與透明 overdraw 通常增大 fill-rate/memory bandwidth；這是 GPU 架構推論，**非跨裝置 FPS 排名**。
- **未測試／Unknown：** 每個 engine bundle exact size、真機 p95 frame time、Mali/Adreno/Apple GPU 的特定效果優劣、WebGPU Compute 在所有 Android／Safari 的可用性。

## 7. 原始文獻
- https://threejs.org/manual/pages/webgpurenderer
- https://threejs.org/docs/pages/WebGLRenderer.html
- https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/lost
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- https://web.dev/articles/animations-guide
- https://github.com/KhronosGroup/glTF/tree/main/extensions
- https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXArtistGuide.md
- https://github.com/zeux/meshoptimizer
- https://r3f.docs.pmnd.rs/
- https://www.babylonjs.com/
- https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://motion.dev/
