# 29｜Three.js 極限渲染驗收：GPU 預算、資產串流、手機降級與開源方案分級

**研究日期／來源最後核對：2026-11-05（Asia/Taipei）**  
**狀態：**官方能力與原始專案存在性已核對；下述硬體預算是**預先設計的驗收門檻／容量估算，不是任何裝置實測數字**。  
**定位：**前續 [27｜視覺能力天花板](27-threejs-r187-ultra-rendering-ceiling.md)、[28｜進階 Shader 配方](28-advanced-shader-pipeline-and-hd2d-recipes.md) 的工程決策和驗收規格。

## 決策摘要

1. **渲染品質上限**可以用 SSGI／SSR／體積光／路徑追蹤往上推；但**即時遊玩上限**主要由 fill-rate、draw calls、GPU bandwidth、資產顯存、長時間熱功耗與裝置 backend 制約。
2. **三條技術通道最合理**：Production WebGL2、受測的 WebGPU/TSL High／Ultra、獨立的 progressive path-traced Still/Photo。不要把 progressive photo mode 宣稱為高幀率即時 RT。
3. **優化順序**：先修資產／色彩／相機／構圖，再 profile GPU；如果是 Fill-rate bottleneck 就降效果解析度、如果是 Draw-call bottleneck 才強化 batching/instancing、如果是幾何瓶頸才導入更重 LOD/HZB/virtual geometry。
4. 沒有實機、沒有 GPU timer、沒有同場景對照，就只能寫**設計假說或未測**，不能填百分比或聲稱達到任何畫質評級。

## 1｜先量測：用數學理解畫質預算

總影格時間由 CPU update、CPU submission、GPU rendering、display pacing、resource upload 等不同瓶頸組成；**不能**把每階段相加就假設一定等於 RAF interval。它們在 pipeline 中可重疊，並有同步、buffering、VSync 與 CPU/GPU frame lag。

| 刷新／體驗目標 | 一幀的可用時間 | 注意 |
| --- | ---: | --- |
| 120 FPS | 8.33 ms | 對長時間手機高規模 3D 是**目標**而非承諾 |
| 60 FPS | 16.67 ms | 需要 CPU、GPU、presentation 與偶發編譯都留安全裕度 |
| 45 FPS | 22.22 ms | 作為較弱裝置自適應參考需實驗確認 |
| 30 FPS | 33.33 ms | 高畫質保底目標仍須穩定 pacing、輸入低延遲 |

**顯存／頻寬成本（理論估算）：**

- 1920×1080 的 **RGBA16F（8 bytes/pixel）單張 color render target ≈ 15.82 MiB**。
- 同尺寸 **32-bit depth/velocity 等 4-byte 格式單張 ≈ 7.91 MiB**（實際 attachment format 與 GPU alignment 需另查）。
- **三張 RGBA16F 全解析 history buffers ≈ 47.46 MiB**，還未包含 MSAA、depth、shadow maps、mip chains、SSGI/SSR、材質紋理、幾何或暫存 ping-pong。
- 線性寬高縮為 `0.75`，像素面積變成 `0.5625`；**只代表理論像素數減少 43.75%**，實際 FPS 可能仍受 vertex、CPU、透明排序或 memory bandwidth 限制。
- 這些是可算出的 capacity/traffic 模型，**不是 profiler 得到的 VRAM 佔用或實測加速比**。

## 2｜三種硬體等級與執行方案（待測 profile，不是推薦任何手機型號）

| Profile | 後端 | 畫質／效能策略 | 不應預設 |
| --- | --- | --- | --- |
| **Mobile Stable** | WebGL2 或經驗證的 WebGPU fallback | PBR+IBL、單一主影、少量燈光、近距離 AO、低成本水、height fog、材質壓縮、保守 RenderScale | 全解析 SSGI、全解析 SSR、多光源 shadow、長時間 120 FPS |
| **Desktop High** | WebGL2 高品質版，或 WebGPU/TSL 經 PoC 後啟用 | CSM、接觸陰影、HDR/LUT、選擇性 SSR/SSGI、半解析體積霧、TAA/TRAA、適量 Bloom | 所有 pass 同時常開必然更漂亮 |
| **Experimental Ultra** | 能力驗證通過的 WebGPU | 更高 GI 採樣、SSR denoise、Compute wave/particles、雲霧 Temporal、場景 GPU culling | 把 WebGPU adapter 存在當成可承擔所有工作 |
| **Progressive Still** | WebGPU Compute path tracer（獨立） | 多次路徑採樣、動態重置 sample history、HDR 合成與靜態截圖 | 靠一次 sample 就得到電影級乾淨畫面、可玩 60 FPS |

切換時最重要的是**視覺連續性與回退行為**：降低 SSGI 可以退回 AO / baked indirect，降低 SSR 要保留天空反射與 probe；降低體積霧不應把遠山完全移除；近景角色不應因 TAA 被模糊到看不清。

## 3｜診斷表：先知道 GPU 為什麼慢

| 症狀 | 假設根因 | 優先操作 | 不要立即做 |
| --- | --- | --- | --- |
| 高解析度掉幀嚴重，低解析度改善 | Fullscreen pixel shading／overdraw／postprocessing | 半解析 AO/SSR/fog、降低 DPR、透明物件排序 | 新增更昂貴 GI pass |
| 高密度城鎮／森林卡頓，降解析度不改善 | CPU draw calls 或場景更新 | InstancedMesh／BatchedMesh、frustum/chunk culling、合併材質、profile JS | 一口氣引入 Nanite-style pipeline |
| 尖細山脊／瓦片閃爍、角色邊緣抹糊 | Mipmaps、TAA history、texel density、LOD transition | PBR 3D 用 mipmap/anisotropy；像素 sprite 保 nearest；比較 TAA on/off | 對整個畫面加更多 Bloom |
| 海面反射在畫面邊緣突然消失 | SSR 螢幕外資訊缺失 | IBL/probe fallback、roughness、fade、重投影 reject | 宣稱 SSR 等於真實反射 |
| 10 分鐘後才嚴重降 FPS | 溫度／功耗、記憶體累積或背景更新 | 長時間回合、低頻資訊紀錄、DPR/quality 階梯、resource disposal | 只看開場 5 秒的平均 FPS |
| 切鏡頭出現上一畫面殘影 | Temporal history / velocity invalid | 重置 TAA/SSGI/SSR/volumetric history、更新 projection matrices | 降低 frame rate 掩蓋 |
| 看得到場景卻看不到某個 Shader 效果 | Shader 編譯/連結失敗、材質 side、pass order、深度 | debug effect-only、console errors、buffer visualization | 只用 render calls > 0 作為驗收 |

## 4｜資產管線比追超昂貴 Shader 更容易先見效

### Geometry/LOD

- 單一小場景先利用 `InstancedMesh`、`BatchedMesh`、mesh/primitive 合理分組；別把整個島合成不可裁切的一張巨大 mesh。
- 大型地形／峽灣採 **chunk/quadtree、screen-space geometric error、可見性、LOD morph/dither、impostor**。近景高精度、遠景視覺連續，才會有巨大山河的真實尺度。
- 對非常大量的模型，研究先前的 [threejs-nanites](23-threejs-nanites-gpu-driven-geometry.md)，但以實測 CPU submission 和 micro-triangle bottleneck 作導入前提。
- 視角 raycast／物理近距離遮擋可考慮 [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh)。它解決的是**幾何空間查詢與部分 GPU BVH 工具**，不是一安裝就免費得到電影級全域光。

### 紋理與 Scene Streaming

- glTF/GLB 先保有 **合法來源與授權清單**，以 [gltfpack/meshoptimizer](https://github.com/zeux/meshoptimizer/blob/master/gltf/README.md) 進行幾何量化、簡化、meshopt 壓縮；`EXT_meshopt_compression` 必須確認 loader/decoder 支援。
- `KTX2Loader` 可將 Basis Universal container 轉成裝置支援的 GPU 壓縮格式；不應誤稱所有 KTX2 自動支援。 [官方 KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html)
- 近景角色/物件在畫質最重要的位置載入高細節資產；遠山採粗 LOD/雲霧／impostor。以 Chunk streaming 與 prefetch 隱藏載入延遲。
- 對瞬間切換材質、日夜、相機位置的物件，材質變體管理和 shader precompile 要一起測，避免首次出現才卡頓。

### 開源候選採用分級

| 技術／專案 | 主要作用 | 現階段建議 | 已驗證程度 |
| --- | --- | --- | --- |
| [Three.js r187](https://github.com/mrdoob/three.js/releases/tag/r187) | Renderer、TSL、PBR、後製與場景 | **A：首要官方研究與基礎** | 官方文件／release |
| [Three WebGPU examples](https://threejs.org/examples/) | 同版本範例與 API 用法 | **A：PoC 參考** | 官方範例存在，未跑相同測試 |
| [gltfpack](https://github.com/zeux/meshoptimizer/blob/master/gltf/README.md) | 資產量化與壓縮 | **A：資產 pipeline 候選** | 原作者文件，未比較檔案品質 |
| [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) | 空間查詢、raycast、BVH | **B：需要高效 raycast 時 PoC** | 上游 README，非本研究實測 |
| [three-gpu-pathtracer](https://github.com/gkjohnson/three-gpu-pathtracer) | WebGPU 路徑追蹤／高品質 still | **B：獨立 photo-mode 研究** | 上游 README，WebGPU 必要，未跑 |
| [threejs-nanites](https://github.com/VictorZakharov/threejs-nanites) | Virtualized geometry / GPU culling | **C：大型場景受證明後才導入** | 本庫第 23 篇已有詳細限制 |
| 非官方 SSR/GI/Volumetric 框架 | 額外特效 | **C：先驗證 LICENSE、版本、改進幅度** | 目前未做同場景技術優劣 benchmark |

**A/B/C 是研究採用優先度，不是對開源作者品質的評分，也不是已完成安全/授權稽核。**

## 5｜驗收矩陣：真正把「最高畫質」變成工程決策

### 固定基準場景（需新建，不得挪用未授權圖片／遊戲素材）

| 場景 | 必含要素 | 觀察項 |
| --- | --- | --- |
| **S1｜室外岩岸** | 近景高頻石材、粗糙木材、海浪、日光與天空 | 材質法向、HDR、波紋閃爍 |
| **S2｜大型山谷** | 遠近五級山脈、谷底霧、海灣、森林 LOD | 可視距離、distance haze、LOD pop |
| **S3｜低光／夜港** | 局部燈具、燭光、木屋、濕地、角色 | 間接光、陰影漏光、tonemap highlight |
| **S4｜透射玻璃與室內** | glass、fabric、metal、rough floor、反射表面 | PBR transmission/SSR/GI |
| **S5｜第一人稱快速移動** | 近壁幾何、透明角色／UI、180° 轉頭 | 景深眩暈、TAA ghosting、碰撞遮擋 |
| **S6｜靜態參考路徑追蹤** | 與 S4 同資產、固定光照／相機 | WebGPU progressive vs realtime screenshot 差異 |

### 版本與裝置

- **引擎與 assets：**鎖 Three.js tag / SHA、依賴 lockfile、Shader hash、glTF hash、KTX2 decoder 版本、攝影機與光源。
- **瀏覽器：**桌面 Chrome / Firefox / Safari（依能力分級）、Android Chromium 實機、iOS Safari 實機；手機 viewport 模擬**不是**真機。
- **後端：**WebGLRenderer、`WebGPURenderer({forceWebGL:true})`、WebGPURenderer 的 WebGPU backend；相同畫面不保證可完全共用實作，需標示 feature parity。
- **解析度：**固定 viewport、輸出 DPR／render scale / HDR buffer format、是否 MSAA、是否 TRAA。
- **視角：**Static / Walk / Rotate / Zoom / Teleport / 2.5D Orthographic / Perspective。正交 SSGI 不可直接假設支援。
- **錯誤注入：**低顯存、WebGPU 初始化失敗、device/context lost、tab visibility、resize、網路分段失敗、暫存資產缺失、GPU timer unavailable。

### 驗收輸出欄位（原始表格規格）

```text
case_id, scene_sha, engine_tag, shader_hash, browser, os, device, backend,
width, height, dpr, render_scale, mode, features, asset_bytes, gpu_memory_unknown,
cpu_p50_ms, cpu_p95_ms, cpu_p99_ms, gpu_p50_ms_or_unknown, gpu_p95_ms_or_unknown,
frame_p50_ms, frame_p95_ms, frame_p99_ms, fps_1percent_low_or_unknown,
draw_calls, triangles_submitted, shader_error_count, webgpu_device_lost,
startup_seconds, stable_minutes, thermal_observation_or_unknown,
visual_review_author, visual_review_notes, pass_fail, evidence_link
```

**不能**把 GPU-timer 欄位填成 CPU RAF interval；`renderer.info.render.triangles` 代表提交幾何統計而非每幀實際 shader-work/光追樣本/LOD 前的理論三角形數。設備若不暴露 thermals，寫 `Unknown`，避免假精準。

### 採樣和 Go/No-go

建議每場景：**3 次 cold start + 5 次 warm start**，每個長時間遊玩模式再做**10–15 分鐘 × 3 回合**；固定操作腳本、接上或拔除電源狀態、環境溫度、運行排序並交錯 A/B。這只是**研究測試計畫**，並非已取得測量結果，也不自動具有統計顯著性。

**Go（產品啟用）** 需同時通過：效果明顯提升且可辨識、所有已承諾裝置能回退、shader error=0、GPU/CPU time 具余裕、無 fatal leaks、所有輸入/交互仍能完成、色彩與影像人工審核通過。

**No-go（退回）**：畫質肉眼不可辨識卻明顯增加 GPU time；沒有降級路徑；移動時嚴重拖影；Shader fails silently；10 分鐘後因熱降頻長時間卡頓；照片模式干擾主要遊玩。

## 6｜階段化研究轉成採用順序

| 階段 | 工作包 | 退出條件 |
| --- | --- | --- |
| **R0 Evidence** | 鎖官方 API/release、原始來源、風險、數據欄位 | 本三篇研究完成；不用安裝套件 |
| **R1 Correctness PoC** | PBR/IBL＋Color Management、WebGPU/TSL 最小材質、Renderer fallback | 同場景不出現黑畫面、錯誤色彩或失敗的 shader |
| **R2 Ocean & Atmosphere** | 水面 W0→W2、height/volumetric fog、SSR probe fallback | 視覺 A/B 變好，成本與回退可量測 |
| **R3 GI/Postprocess** | MRT、SSGI、SSR denoise、TRAA、DoF、SSS | 以動態鏡頭評估邊界鬼影與正交相容 |
| **R4 Mega-scene** | Chunk/LOD、Instanced／Batched、meshopt/KTX2、可選 HZB | 有真實可見性/幾何 bottleneck 證據 |
| **R5 Reference render** | WebGPU Compute path tracer 靜態版 | 與即時場景同光源/材質，輸出可比較截圖 |
| **R6 Device gate** | 桌面/WebGL fallback/Android/iOS 真機反覆測 | GPU/CPU、FPS、熱、畫質與操作各自達標 |

**本次只完成 R0 的文獻研究內容**，不是完成任何 R1–R6 工作。

## 7｜來源台帳與追溯

| 主張 | 一手／原始來源 | 查閱 | 證據評級 |
| --- | --- | --- | --- |
| WebGPURenderer、TSL、WebGL2 fallback 及 GLSL/Composer 限制 | [Three 官方 WebGPU Manual](https://threejs.org/manual/pages/webgpurenderer) | 2026-11-05 | A：官方 API 文件 |
| RenderPipeline/MRT/velocity與輸出轉換 | [Three 官方 Postprocess](https://threejs.org/manual/pages/webgpu-postprocessing.html) | 2026-11-05 | A：官方 API 文件 |
| SSGI samples／相機類型 | [Three SSGINode](https://threejs.org/docs/pages/SSGINode.html) | 2026-11-05 | A：官方 API 文件 |
| TRAA/MSAA 互斥 | [Three TRAANode](https://threejs.org/docs/pages/TRAANode.html) | 2026-11-05 | A：官方 API 文件 |
| WebGPU Limited Availability、HTTPS | [MDN WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) | 2026-11-05 | A：平台文件 |
| WebGL2 GPU query 非所有設備都有 | [MDN Disjoint Query](https://developer.mozilla.org/en-US/docs/Web/API/EXT_disjoint_timer_query) | 2026-11-05 | A：平台文件 |
| glTF 幾何壓縮與外部解碼需求 | [meshoptimizer gltfpack](https://github.com/zeux/meshoptimizer/blob/master/gltf/README.md) | 2026-11-05 | A：原作者文件 |
| KTX2/Basis 向裝置支援格式轉碼 | [Three KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html) | 2026-11-05 | A：官方 API |
| BVH 查詢、主要非靜態幾何限制 | [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) | 2026-11-05 | B：上游開源 |
| WebGPU progressive path tracing 的功能與限制 | [three-gpu-pathtracer](https://github.com/gkjohnson/three-gpu-pathtracer) | 2026-11-05 | B：上游開源 |
| GPU-driven Nanite-style LOD 理念 | [threejs-nanites](https://github.com/VictorZakharov/threejs-nanites)、[本庫既有研究](23-threejs-nanites-gpu-driven-geometry.md) | 2026-11-05 | B：上游文件＋歷史研究 |
| 本文 Profile/成本/PoC 順序 | **研究作者工程推導** | 2026-11-05 | C：尚未實測 |

**不要把上述「理論量、官方範例、上游自報數據、作者推導」混成同一種測試成績。** 本報告沒有聲稱第三方實作為本 Repo 已安裝依賴，也沒有更動任何遊戲、網站、CI、Secrets 或 GitHub Rulesets。
