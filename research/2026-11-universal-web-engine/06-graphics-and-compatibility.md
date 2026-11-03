# 06｜WebGPU、WebGL、3D、GPU Compute 與相容性

**這是可選的視覺／計算層，不是所有網站的主體。** 對需要空間場景、複雜圖像或計算的產品才值得使用。

## 引擎比較

| 候選 | 強項 | 可能代價 | 驗證要求 |
| --- | --- | --- | --- |
| [PlayCanvas Engine](https://playcanvas.com/products/engine) | WebGPU/WebGL、實時 3D、Compute、Splatting 等生態 | 工程接口與大型場景資產管線需要學習 | 真機 FPS、記憶體、fallback |
| [Three.js + TSL](https://threejs.org/manual/pages/webgpurenderer) | 高自由度的 node material、特效和自訂渲染 | WebGPURenderer 仍標示 experimental；舊 Shader/EffectComposer 需遷移 | 不只測桌機 Chrome |
| [Babylon.js](https://www.babylonjs.com/) | 3D 應用、物理與 XR 功能 | 若不需要完整 3D 引擎可能過重 | bundle、跨瀏覽器、記憶體 |
| 原生 Canvas / SVG / DOM | 2D、圖表與一般 UI | 沒有完整 3D 特性 | 可用性通常最好 |

**不要同一頁面無必要同時載入三個 3D 引擎。**

## 相容性事實

- **WebGPU 在 MDN 仍標記 Limited availability、非 Baseline，且通常須 HTTPS**；Chrome／Safari／Firefox 的硬體與功能支援不應簡化成「所有新手機可用」。
- 不能只判斷 \`'gpu' in navigator\`：仍需 \`requestAdapter()\`、\`requestDevice()\`、所需 features/limits、device lost 回復；如果失敗退到 WebGL 2 / Canvas / DOM。
- Three.js \`WebGPURenderer\` 可回退 WebGL 2，**但 ShaderMaterial/RawShaderMaterial/傳統 EffectComposer 不可原樣移植**。
- WebGPU Compute 和部分後製並不保證有 WebGL 同等功能，需提供簡化算法或關閉效果。
- **OffscreenCanvas** 可將部分 canvas 工作移到 Worker，實際 Renderer／設備支援、事件同步和主執行緒通信仍需測。

## 素材與 GPU 記憶體

- 使用 glTF/GLB，檢查模型拓撲、授權、實際可操作節點與版本。
- 使用 **KTX2 / Basis Universal (\`KHR_texture_basisu\`)** 進行材質紋理壓縮、**meshopt (\`EXT_meshopt_compression\`)** 優化 mesh；需 loader 支援與替代素材。
- 幾何壓縮減少下載不必然減少**所有 GPU RAM**；Textures、Mipmap、解碼與 Draw Calls 是另一組成本。
- LOD、Frustum/Occlusion Culling、Instancing、批次合併、按需載入通常是比「再加 Bloom」更早的工作。

## 四級自適應品質（研究設計）

| 等級 | 特徵 | 退化策略 |
| --- | --- | --- |
| Ultra | WebGPU + 高階材質、後製、GPU Compute | 不支援時自動退 High |
| High | WebGPU 或 WebGL2 + PBR、基本後製 | 適度降低 shadow/texture |
| Balanced | WebGL2/Canvas + 少量效果、動態解析度 | 降低粒子、LOD、後製和更新頻率 |
| Basic | 主要 DOM / CSS，文字、表單、操作可用 | GPU 層完全可關閉 |

**設計原則：** 基本核心功能完整保留，所有特效可按設備性能逐步減量。Quality Tier 不等於目前已通過真機 benchmark。

## 可做的最新探索

- **WebGPU Compatibility Mode** 允許受限特徵集合在舊圖形 API 上運行，Chrome 146 官方提過以 Android OpenGL ES 3.1 起步；是否支援仍以實際 Adapter 為準。
- **Gaussian Splatting** 可用於照片感場景重建，但對需要精確碰撞、可編輯 mesh、邊界清楚的工程模型並非萬能替代品。

## 大型幾何／Virtualized Geometry 參考

- [threejs-nanites：GPU-driven cluster LOD、HZB、software rasterizer、impostor、streaming、temporal upscaling](23-threejs-nanites-gpu-driven-geometry.md) 是目前技術庫的大型場景參考實作。
- 它適合研究「大量 instance + 超高幾何量」的渲染架構；一般網站先做資產壓縮、LOD、culling、lazy loading，不應直接把 Nanite-style pipeline 當預設方案。
- 上游 benchmark 與 38B / 1T full-detail triangle 數字只能視為作者環境證據；正式採用仍需本地真機 PoC。

原始來源：
https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
https://developer.chrome.com/blog/new-in-webgpu-146
https://threejs.org/manual/pages/webgpurenderer
https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
https://github.com/KhronosGroup/glTF/blob/main/extensions/README.md
https://github.com/zeux/meshoptimizer
