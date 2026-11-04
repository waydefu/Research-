# 27｜Three.js r187 的視覺天花板：WebGPU／TSL、即時 GI、反射與路徑追蹤

**研究日期與最後核對：2026-11-05（Asia/Taipei）**  
**狀態：**官方文件／上游開源程式與示範存在性已查證；**未完成同場景 GPU 實測或視覺盲測**。  
**範圍：**通用 Web 3D、沉浸式場景、產品視覺化、風格化遊戲。本文是公開技術研究，不依附任何特定產品或專案。

## 先講結論

Three.js 的可達畫質**不是「簡單網頁 3D」的固定上限**。在受控場景內，可以用 PBR 資產、HDR／IBL、精準陰影、進階 TSL 後製與時間累積，打造接近高階即時 3D 展示的鏡頭；另有 WebGPU Compute 的漸進式 **path tracing** 路線，適合高品質靜態展示與拍攝。

但必須區分三件事：

1. **渲染功能上限：**能否製作 GI、軟陰影、光學材質、景深、體積效果、反射與路徑追蹤？對其中不少功能，答案是「能」，但整合成本、效果正確性與支援範圍各異。
2. **可玩即時上限：**60 FPS 的連續移動、動畫、手機散熱與高解析度，**不能**由精緻的單張示範照外推。
3. **美術上限：**光影演算法不會自動補出優秀的地貌、角色、近景細節、構圖或動畫。缺乏資產品質的 10-pass 後製仍會像技術原型。

以 2026-11-05 為核對點，官方 Three.js 最新可查 release 是 **r187（2026-10-30）**。新功能研發焦點是 `WebGPURenderer`／TSL／RenderPipeline，但 `WebGLRenderer` 仍受維護，且官方仍將前者定位為 **experimental**。這不是「全面遷移已經零風險」的證據。來源：[官方 releases](https://github.com/mrdoob/three.js/releases/tag/r187)、[WebGPURenderer manual](https://threejs.org/manual/pages/webgpurenderer)。

## 1｜四種畫質等級，不能用同一個 Renderer 配置硬套

| 路線 | 實際目標 | 技術組合 | 採用判斷 |
| --- | --- | --- | --- |
| **A · Compatibility** | 可在廣泛 WebGL2 瀏覽器載入、光影清晰 | WebGL2＋PBR＋IBL＋陰影＋FXAA/SMAA＋低成本霧＋壓縮素材 | 產品可靠性基線 |
| **B · High Fidelity** | 具體、可信的電影式即時視覺 | WebGPU Renderer/TSL 或 WebGL2 精心實作的 AO/SSR/DoF；HDR/Tonemap、層次霧、反射探針 | 已有官方 API／範例，需逐效果 PoC |
| **C · Ultra / Research** | 追求複雜光線互動、環境與遠景 | SSGI、stochastic SSR＋去噪、SSS、TRA A、體積雲／霧、GPU Compute 波浪、巨大場景可視性管理 | 每項成本都需 GPU-time 與畫質驗證，不直接全開 |
| **D · Progressive Reference** | 靜態／低互動的極高畫質參考 | WebGPU Compute path tracer＋BVH＋多次取樣累積／去噪＋景深／玻璃透射 | 獨立的照片模式／離線品質真值，不宣稱即時可玩 |

**重大誤區：**SSR 是螢幕空間反射，不會自動看到鏡頭外的物件；SSGI 是螢幕空間 GI，不等於 Unreal Lumen 或普適的多次反彈全場景 GI；WebGPU 不代表原生硬體光線追蹤 API；path tracing 的 progressive sample 也不等於每秒都能完整重繪一張無雜訊的高品質新畫面。參見官方 [SSGI Node](https://threejs.org/docs/pages/SSGINode.html) 與 [WebGPU Manual](https://threejs.org/manual/pages/webgpurenderer)。

## 2｜Renderer 路線：真正需要小心的遷移斷層

### WebGLRenderer（可靠基線）

- 仍是純 WebGL2 應用的官方推薦 renderer；可繼續使用 `ShaderMaterial`、`RawShaderMaterial`、`onBeforeCompile()` 與 `EffectComposer`。
- 優點是已有成熟的個別 GLSL Shader、生態支援與 Chromium／Safari 測試策略。
- 較高階 MRT／多 pass 整合複雜，效能可能受 Draw Call、fill-rate、shader permutation 與 texture bandwidth 影響。
- WebGL2 模式的 GPU time 能否量測，取決於 `EXT_disjoint_timer_query_webgl2`；**不支援時只記錄 Unknown**，不可用 RAF time 冒充 GPU time。[MDN extension](https://developer.mozilla.org/en-US/docs/Web/API/EXT_disjoint_timer_query)。

### WebGPURenderer＋TSL（下一代主研究方向）

- `import * as THREE from 'three/webgpu'`，`await renderer.init()`；WebGPU 不可用時 Renderer 可選用 **WebGL2 backend**。但這**不是功能對等保證**：Compute/storage 特性仍要依實際 backend 查 capability。
- `three/tsl` 的 Node Material 與 TSL 可編譯往 WGSL／GLSL；後製改用 `RenderPipeline` 與 `pass(scene,camera)`，可利用 MRT 共享 depth/normal/velocity，避免毫無必要的重複場景渲染。
- **不相容：**舊 GLSL `ShaderMaterial`、`RawShaderMaterial`、`onBeforeCompile` **不能直接交給 WebGPURenderer**；舊 `EffectComposer` 也不能原封套用。必須重寫成 node/TSL／對應 effect chain。
- WebGPU 啟動和裝置遺失都是新增風險。設 `forceWebGL` 是測 fallback 的方法，不是只靠 `navigator.gpu` 存在就宣稱可用。
- WebGPU 仍非所有主流環境的 Baseline API；特別是 App 內建瀏覽器、Android 型號、iOS／Safari，**需要能力探測與真機驗證**。來源：[WebGPU guide](https://threejs.org/manual/pages/webgpurenderer)、[postprocess guide](https://threejs.org/manual/pages/webgpu-postprocessing.html)、[MDN WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)。

### 對特效模組的架構要求

```text
App / Camera / Scene / Interaction
                │
        Renderer Capability Adapter
         ├─ WebGL2 production
         │    ├─ PBR + direct light + IBL
         │    ├─ GLSL materials (legacy)
         │    └─ WebGL2 composer passes
         └─ WebGPU/TSL experiment
              ├─ NodeMaterial / TSL
              ├─ MRT scene pass (depth/normals/velocity)
              ├─ RenderPipeline / ordered effect graph
              └─ Optional compute (only feature-checked)
                │
        Device-specific quality budget
                ├─ static / supported path
                └─ reproducible device-lost fallback
```

上述是**選型架構方案**，不是已建置的跨後端框架。不要在尚無性能證據時維護兩套完整重複 Shader：先做一個「材質＋後製」差異 PoC 再決定主軸。

## 3｜可以做到哪些上限？逐效果盤點

| 技術 | 畫面貢獻 | 官方／開源證據 | 限制／成本 |
| --- | --- | --- | --- |
| **PBR metal/roughness＋normal/AO** | 濕石、木材、漆面、布匹在光下可信 | [MeshStandardMaterial](https://threejs.org/docs/pages/MeshStandardMaterial.html) | 好材質必須搭配正確貼圖與環境 |
| **Physical material layers** | clearcoat、sheen、anisotropy、iridescence、transmission、IOR、dispersion | [MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html) | 單像素成本較高；不要全物件套最昂貴材質 |
| **HDR／IBL＋PMREM** | 岩壁與金屬有一致環境亮度、反射層次 | [PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html) | 需合法 HDRI、校正曝光、管理顏色空間 |
| **CSM / shadow map** | 大場景日照接近／遠處有解析度分層 | [官方 examples](https://threejs.org/examples/) 搜尋 shadowmap/csm | 陰影 cascade 切換、shadow acne、成本 |
| **Contact shadows / SSS** | 角色腳底、窗框、岩縫的小陰影 | [SSSNode](https://threejs.org/docs/pages/SSSNode.html) | 屏幕空間可見性；官方建議短距離，非替代主 shadow |
| **SSGI** | 間接漫射色彩與 ambient occlusion | [SSGINode](https://threejs.org/docs/pages/SSGINode.html)、[官方示範](https://threejs.org/examples/webgpu_postprocessing_ssgi.html) | `sliceCount × stepCount × 2` samples/pixel；有 Screen-Space 漏光與 temporal noise |
| **SSR / stochastic SSR** | 濕地、海水、拋光表面有場景反射 | [官方 WebGPU examples](https://threejs.org/examples/) 搜尋 SSR/SSR denoise | 畫面外資料不存在；rough reflections 去噪、history、mask |
| **DoF（景深）** | 遠近景分離、電影式拍攝鏡頭 | [WebGPU 官方示範](https://threejs.org/examples/webgpu_postprocessing_dof.html) | 不適合長時間第一人稱常駐高強度模糊；前景混合成本 |
| **Temporal AA / TRAA** | 斜線與高頻表面抖動減少 | [TRAANode](https://threejs.org/docs/pages/TRAANode.html) | 需要 depth/velocity；動態角色 ghosting；**TRAA 時關閉 MSAA** |
| **Volumetric fog/clouds** | 山谷霧、光束、逆光雲 | [官方 examples](https://threejs.org/examples/) 的 Fog / Godrays；體積光另需自訂 | ray march 多重採樣、歷史殘影、半透明成本 |
| **GPU Compute** | 大量草木／粒子／海浪頻譜／水流模擬 | [ComputeNode](https://threejs.org/docs/pages/ComputeNode.html)、[StorageInstancedBufferAttribute](https://threejs.org/docs/pages/StorageInstancedBufferAttribute.html) | WebGPU backend／裝置支援；fallback 不保證同算法 |
| **Progressive path tracing** | 複雜反彈光、透明材質、軟陰影與靜態高畫質 | [three-gpu-pathtracer](https://github.com/gkjohnson/three-gpu-pathtracer) | 依 README 需要 WebGPU；場景材質支援有限；不保證動畫每幀低延遲 |
| **Nanite-style virtual geometry** | 極大量森林、岩壁、重複模型的 GPU-driven LOD | [threejs-nanites](https://github.com/VictorZakharov/threejs-nanites) 與本庫 [既有 23 篇](23-threejs-nanites-gpu-driven-geometry.md) | 自訂資產格式、GPU culling、HZB、streaming 成本極高；不是 UE5 Nanite 官方移植 |

### 重要效能事實

官方 SSGI 推薦 temporal-filtered High 為 `sliceCount=3`、`stepCount=16`，這意味著演算法描述的 `3 × 16 × 2 = 96` 次主要採樣／像素。**這是採樣次數，不是 GPU frame time**。同樣，path tracer 的 samples per pixel 和 webgpu Nanite 風格的「理論總 triangles」也不是實際 FPS。[官方 SSGI 文件](https://threejs.org/docs/pages/SSGINode.html)

## 4｜渲染品質的上限其實很常卡在色彩工作流

1. 色彩貼圖（albedo／emissive）使用 sRGB；normal／roughness／metalness／depth 是非色彩資料。HDR 線性資料要與線性工作空間相容。
2. 光照與 PBR 運算應在線性工作空間，**Tone mapping 與輸出轉換只做一次**。WebGPU RenderPipeline 在效果鏈尾會自動處理；手動 `renderOutput()` 時必須依文檔控制開關。
3. 自訂 GLSL ShaderMaterial 不會自動替你正確做所有色彩轉換。原始碼需逐個確認輸出色彩空間與線性／sRGB 混用。
4. Gamma 設定錯誤時，調亮燈光掩蓋問題只會造成其他場景曝光不一致。
5. 「最華麗」並非最大 Bloom／最大 DoF；先建立可辨識材質、照明方向與黑白階，最後再套效果。

證據：[Three.js Color Management manual](https://threejs.org/manual/pages/color-management.html)、[RenderPipeline 色彩處理](https://threejs.org/manual/pages/webgpu-postprocessing.html)。

## 5｜極限畫質的建議組合

**Realtime Cinematic：**
`高品質 GLB/glTF 資產 → PBR/IBL → 方向光與 CSM → 局部補光／contact shadow → MRT（depth/normal/velocity） → 選擇性 SSGI/SSR → 低解析體積霧 → 輕量 Bloom → temporal AA → LUT／tone mapping → sRGB output`。

**Hero / Still Image：**
`高精度近景 PBR → WebGPUPathTracer（獨立研究模式） → 多 sample progressive accumulation → denoise → still image capture`。可當作光照真值參考，**不等於隨時即時 60 FPS**。

**行動高畫質：**
`WebGL2／經驗證的 WebGPU fallback → glTF meshopt + KTX2 → dynamic render scale → IBL＋低成本陰影 → 近景 AO → 替代式霧／海面簡化 → minimal AA + tonemap`。先保證長時間穩定和手感，再逐步啟用重型後製。

如果使用者所追求的是無目標自由探索、峽灣山海這類大型景觀，最能提升畫面的通常不是全開 20 個 passes，而是**地形設計、天空與大氣、遠近 LOD、材質尺度、岸線與動態水面的一致性**。這是研究推導，需要在可重現場景實測。

## 6｜來源與授權界線

| 來源 | 類型與查證 | 可支持內容 |
| --- | --- | --- |
| [three.js r187 release](https://github.com/mrdoob/three.js/releases/tag/r187) | 官方發版，2026-10-30 | 版本快照 |
| [WebGPU Renderer guide](https://threejs.org/manual/pages/webgpurenderer) | 官方文件，2026-11-05 查閱 | TSL、fallback、實驗性與遷移限制 |
| [WebGPU RenderPipeline guide](https://threejs.org/manual/pages/webgpu-postprocessing.html) | 官方文件，2026-11-05 查閱 | MRT、pass composition、color output |
| [WebGPU official examples](https://threejs.org/examples/) | 官方範例索引，2026-11-05 查閱 | SSGI、SSR、DoF、SSS、Compute 存在性 |
| [MDN WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) | 平台文件，2026-11-05 查閱 | Limited Availability、HTTPS、能力探測 |
| [three-gpu-pathtracer](https://github.com/gkjohnson/three-gpu-pathtracer) | 開源第三方；README、MIT 標示 | Progressive path tracing 的可行候選，非內建 Three.js |
| [threejs-nanites](https://github.com/VictorZakharov/threejs-nanites) | 第三方研究；既有第 23 篇已評估 | Virtualized geometry 思路，非 UE5 等同 |
| [Khronos glTF](https://github.com/KhronosGroup/glTF) | 官方格式與延伸規格 | 可移植資產格式；不擔保所有 extension 已有 loader 支援 |

**本研究沒有安裝、執行 path tracer、下載示範資產、宣稱跑出 60/120 FPS 或驗證任何真手機。** 採用第三方程式、示範素材及 HDRI 前必須另查 LICENSE、素材作者權利與版本；引用技術概念不代表有權複製作品外觀。
