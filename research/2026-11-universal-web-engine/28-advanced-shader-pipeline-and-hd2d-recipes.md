# 28｜高階 Shader 工程手冊：海水、峽灣大氣、GI、反射、材質與 HD-2D 混合渲染

**研究日期／最後核對：2026-11-05（Asia/Taipei）**  
**證據狀態：**公式與可行 API 由官方文件或圖形技術原理支持；以下配方、參數與架構為**原創設計推導，尚未實測**。  
**用途：**可直接作為圖形工程師的 PoC 實驗規格；公開通用，不針對特定私人產品。前置閱讀：[27｜Three.js r187 視覺天花板](27-threejs-r187-ultra-rendering-ceiling.md)。

## 0｜不要把效果當清單亂開：先建立 Frame Graph

**推薦的 WebGPU/TSL 高品質實驗管線（概念設計）：**

```text
Authoring: glTF meshopt/KTX2, normal/roughness, light probes, LOD
                         ↓
PBR Opaque Scene + Main Shadow (CSM/PCF) + IBL
                         ↓
MRT Scene Beauty / Depth / Normal / Velocity
          │                 │                │
          ├─ short-range SSS│                ├─ TRAA reprojection
          ├─ AO/SSGI ←──────┘                └─ history rejection
          ├─ SSR + probes / environment fallback
          ├─ Water / transparent / particles [must define order and depth]
          └─ low-resolution volumetric fog + temporal accumulation
                         ↓
      Selective Bloom → Color Grade/LUT → Tonemap → Output Color Space
                         ↓
           2D HUD / Accessibility UI (DOM layer)
```

這是**架構草圖，不是已驗證的 render-pass 執行順序**。半透明水面、反射水面、SSGI、與重投影相互依賴，需先確認 renderer 的 depth、color history、alpha 和透明物件能否進入對應 pass。別在架構審查時將整張流程圖誤當可直接複製的程式。

### r187 Renderer 改版重點

官方 WebGPU 範例採 `RenderPipeline`、`pass(scene,camera)`、`mrt({output,velocity})` 和 `outputNode`；Post chain 的 tone-mapping 與 output color transform 有自動處理邏輯。SSR、SSGI、TRAA 必須與 depth／normal／velocity 的相同鏡頭矩陣、解析度、前幀 history 和曝光相符。[官方 RenderPipeline manual](https://threejs.org/manual/pages/webgpu-postprocessing.html)

- **TSL 路線**：Node Material 以 `three/tsl` 表示數學與材質節點，renderer 視後端編成 WGSL/GLSL。
- **傳統 GLSL 路線**：WebGL2 `ShaderMaterial`＋`EffectComposer` 或自訂 pass；不直接與新的 WebGPU Renderer 通用。
- **後製互斥**：官方 `TRAANode` 明定使用 TRAA 時須關閉 MSAA。切換視角、FOV、重設 DPR 或 teleport 時，應清除 temporal history，否則會鬼影。
- **Camera Caveat**：官方 `SSGINode` constructor 明確標示 `PerspectiveCamera`；不要直接假設可套到所有 Orthographic 2.5D 相機。若要支援正交鏡頭，須做獨立效果相容性 PoC 或選擇 GTAO／baked GI 等替代。

## 1｜PBR 的藝術品質比堆後製更重要

### 必要貼圖

| Map / 屬性 | 類型 | 建議用途 | 容易犯的錯 |
| --- | --- | --- | --- |
| Base Color / Emissive | **sRGB Color** | 木材、石灰、濕地、燈窗顏色 | 將 sRGB 當線性數字，整體變亮／變暗 |
| Metalness / Roughness / AO | **Non-color Data** | 决定光澤、金屬和凹槽 | 非色彩資料錯誤啟用 sRGB |
| Normal / Height / ORM | **Non-color Data** | 裂縫、木紋、凸凹細節 | Tangent space / Y channel 混用 |
| Transmission / IOR | Physical Material | 玻璃、薄水層與清澈材質 | 大量水面直接以透明 PBR 取代專用 Shader |
| Environment Map | HDR / PMREM | 間接光與反射底色 | 沒有環境圖，卻只靠反射強度調高 |

[Three.js Color Management](https://threejs.org/manual/pages/color-management.html) 和 [MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html) 均有官方描述。

**美術流程**：材質先在 neutral light 測試（albedo/roughness/sRGB 正確），再以同一光源和曝光比較 dry vs wet、day vs dusk。SSR/DoF/Bloom 不可用來補救破損模型和錯誤法線。

## 2｜海洋方案：從漂亮到真正可信

### W0 · 可用的低成本近岸水

使用**兩組不同方向的 Gerstner waves** 或少量頻率波形，搭配 Fresnel、深度分層與海岸 foam。相比只在 UV 上疊 `sin()` 的白條紋，頂點 displacement＋正確水面法向會讓高低反射跟隨波形變化。

深度與顏色模型可從以下**原創概念公式**開始：

```text
N = normalize(∂P/∂x × ∂P/∂z)              // 波面法向
F0 = ((n_water - n_air)/(n_water + n_air))² // 常見介質 Fresnel 正入射反射率
F  ≈ F0 + (1 - F0) × (1 - dot(N,V))⁵      // Schlick 近似
T(d) = exp(-absorptionRGB × d)             // Beer-Lambert 顏色吸收近似
water = mix(refractedScene × T(d) + scatter, reflectedScene, F)
foam = shorelineMask × breakIntensity × advectedNoise
```

此式僅為建模出發點，並非 Three.js 內建水體方程或可直接貼用的 GLSL；`d` 取自可用的 scene depth/水面 depth，需處理 near/far、正交／透視與透明深度。

### W1 · 高品質可玩海面

- **低頻大波**：頂點 Gerstner 或網格 displacement 讓船身微幅起伏；海岸線幾何不要看起來像一片硬切平面。
- **高頻細波**：循環法向貼圖或 procedural normal；粗糙度控制波峰閃光。
- **環境反射**：天空 IBL、遠處地貌 reflection probe，局部鏡面用平面反射或 SSR，**SSR 缺畫面外資訊時要 fallback 到 probe/sky**。
- **水下折射與透明度**：深度漸層、色吸收、泡沫與岸邊濕岩。透明水面要訂清楚 sorting / depth prepass 策略。
- **屏幕解析度**：近景薄泡沫要 anti-alias，不要每移動一格就跳動；對 Half-res effect 用上採樣與穩定度驗證。
- **船隻**：水面位移／法向採樣同一波浪來源，船的剛體姿態至少由前後左右波面差估算，避免桅杆與船殼分離。

### W2 · 頂級研究：頻譜海浪與海灣混合

可以研究 **Tessendorf spectral ocean + FFT**：頻域生成風場波譜、GPU Compute 反轉為 displacement 和 slope 圖，再依地形深度對近岸改用 shoaling／foam 模型。

**不能過度承諾**：純 FFT 海洋通常偏外海統計性波面；**淺灘破碎波、岩壁反射、港口靜水**仍要單獨的海岸模型。完整 CFD／SPH／shallow-water 多區域耦合已是研究級成本，不適合無條件拿來當瀏覽器遊戲的基本水。

**原創 PoC：**同一場景比較 W0／W1／W2，記錄 camera 可見面積、波形密度、陰影與反射、GPU 每 pass 時間、船隻相容性、手機熱降頻。沒有數據就不聲稱哪個「快 10 倍」。

參考：[Three.js WebGPU Compute samples](https://threejs.org/examples/)（compute birds/cloth/particles/fluid）、[WebGPU ComputeNode API](https://threejs.org/docs/pages/ComputeNode.html)。

## 3｜峽灣／山谷大氣：高度決定視覺說服力

### A0 · 基礎：高度霧＋距離霧（手機優先）

```text
density(p) = baseDensity × exp(-heightFalloff × max(p.y - seaLevel, 0))
transmittance = exp(-integral(ray, density))
color = sceneColor × transmittance + fogColor × (1-transmittance)
```

高度霧應與相機視線方向、谷底濕度與天氣一致，不是把整個場景加灰。當場景沒有真實山脈 silhouette，任何雲霧都無法讓水平平面變成峽灣。

### A1 · Mid/High：半解析度體積霧

- 使用 depth-aware raymarch，累積散射、透射與主太陽光 visibility。
- 以 **half/quarter resolution** 降 pixel sample cost，使用 blue noise jitter + temporal reprojection。
- 離屏與薄物件需要深度邊緣 upsample；光源接觸陰影與體積 fog shadow 使用一致太陽位置。
- 觀景與第一人稱切換時重置 temporal history，避免殘留前一鏡頭的雲霧。

### A2 · Ultra：體積雲＋地形氣流

- 低頻 Worley/Perlin FBM 控制大雲團，高頻 erosion 控制邊緣；以天氣／高度場分配雲層，避免等距飄浮的球狀雲。
- 天空散射可研究 Rayleigh/Mie 近似，讓太陽低角度、海平線、山脈遠景自然銜接。
- 低解析體積 marching 仍有 Ray × Steps × Lights 的乘法成本，**不是把 100 個步進全開就會最好看**。建議保留 A0 為非 compute 的安全回退。

## 4｜陰影、AO 與全域光：要有分工

| 層次 | 來源 | 作用 | 局限 |
| --- | --- | --- | --- |
| 大範圍日照陰影 | CSM / directional shadow | 建築、岩壁、樹木的主要遮蔽 | Cascade transition、陰影貼圖解析度 |
| 近距離接觸 | WebGPU `SSSNode` | 窗框、屋簷、角色腳部 | 只看得到畫面內物件、短距離才合理 |
| AO | GTAO / HBAO 類 | 縫隙暗部、物體接觸面 | 不是真實多次反彈光 |
| GI | WebGPU `SSGINode` | 間接漫射色彩／場景局部 bounce | 螢幕外資料缺失、漏光、temporal instability |
| 參考照明 | path tracer | 幾何反射、軟陰影和多次 bounce 的高品質 benchmark | Progressive／算力需求，非固定 60 FPS |

官方 SSS 記載 shadow map 應作基礎、screen-space shadow 只補細節，並提醒最大陰影距離若超過約 1m 開銷會迅速增加。[SSSNode](https://threejs.org/docs/pages/SSSNode.html)

官方 SSGI 的 `sliceCount × stepCount × 2` 是採樣推導，renderer 可使用 temporal filter；**增加 samples 不一定線性改善視覺，卻能增加成本**。[SSGINode](https://threejs.org/docs/pages/SSGINode.html)

## 5｜反射：三種來源混合才比較可信

1. **Probe / IBL：**便宜且提供螢幕外環境，適合作為各材質 baseline。
2. **Planar reflection：**鏡面水池、建築窗戶與小鏡子，可用鏡像相機額外 render；對大片不規則波海要小心成本、clip plane 和視差錯誤。
3. **SSR：**相機可見幾何的局部反射；用深度 ray-march、粗糙度追蹤、厚度判斷與 temporal denoise。超出畫面時 blend 到 probe，避免反射邊緣直接消失。

對金屬濕地與海水，建議**先做好 IBL/probe** 再比較 SSR；不應要求每個螢幕像素都跑最昂貴 stochastic trace。官方 [WebGPU SSR 範例](https://threejs.org/examples/) 存在，但不能只因官方示範可跑，就推定能穩定處理所有半透明海水。

## 6｜HD-2D 的高階品質不等於所有物件都像素化

```text
角色（作者原創 sprite / animation）
   ├─ texel density 固定，Nearest 放大
   ├─ 方向幀／骨架風格協調
   └─ alpha-to-coverage / alphaTest / depth 及軟陰影調整
環境（高品質 3D）
   ├─ glTF PBR、normal/roughness、mipmap/anisotropy
   ├─ 清楚的遠景地形 silhouette 與材質物理尺度
   └─ 高度霧、間接光、陰影、反射
後製（區域式）
   ├─ 背景與高光可低強度 Bloom / DoF
   ├─ 角色/UI 邊緣保留銳利像素；避免全螢幕 TAA 抹糊人物
   └─ 以固定的 color LUT 統一角色和場景的美術色票
```

**關鍵衝突：**場景的 TAA／TRAA 擅長減少高頻抖動，但像素角色需要保留清楚的方塊輪廓。若把銳利 2D Sprite 放在同一 temporal pass，鏡頭移動時可能拖影或變糊。可以比較「3D 場景先做 temporal resolve，再 overlay 角色／UI」與「角色寫 motion vector＋透過 temporal AA」兩種方案；哪個更好要拿實際動態影片比，而非只比靜態截圖。

技術來源：[Luminati HD-2D 既有研究](26-luminati-hd2d-browser-engine.md)、[TRAANode](https://threejs.org/docs/pages/TRAANode.html)、[Color Management](https://threejs.org/manual/pages/color-management.html)。

## 7｜當 Shader 後製失效時，如何證明不是「背景色恰好很像」？

每個自訂效果都要至少 4 種輸出模式：

1. `beauty`：正常效果。
2. `depth／normal／velocity`：判斷 MRT／深度資料來源是否真的有效。
3. `effect-only`：只顯示海水波紋、GI、AO、SSR、fog 或 bloom。
4. `disabled`：同場景關閉單一效果的可重現 A/B。

**可接受的測試策略（設計，尚未執行）**：

- 在桌機 WebGPU、強制 WebGL2 backend、原 WebGLRenderer 中逐一啟動；不支援者必須有明確訊息。
- 擷取瀏覽器 Console 的 compile/link/validate errors；不能只看成功 draw call。
- 以固定快照 camera + seed 比較 A/B PNG、深度／法線 RenderTarget 有效像素和場景差異。
- 驗證 viewport／DPR／camera mode 改變後 history 清空、effect resize、render-target dispose。
- 以 `GPU timer`（可用時）和 frame interval 分開記錄；無 GPU timer 的欄位留 Unknown。
- 無需目標資產授權時**不要**抓取第三方遊戲貼圖當自己的測試素材。改用原創基準場景。

### GLSL 編譯、連結與精度回歸

WebGL2 自訂頂點與片段 Shader 的共享 uniform 名稱、型別、精度、輸出結構必須相容；即使 `renderer.info.render.calls > 0`，仍可能存在單一材質的 link/validate failure。**驗收時收集 WebGL warning/error、program compile/link log，對水面及體積效果輸出 effect-only 的像素差異**。尤其要測試以下負向案例：

- 模擬頂點／片段 `uTime` precision 不一致，確認 CI 能抓到失敗並阻止 release。
- 故意輸入不存在的 Shader import、錯誤 uniform 或少一張 depth texture，確認不是默默退回背景色。
- 視角從正交切透視、DPR 改變與 framebuffer resize 時，檢查 shader 的 projection/depth/uniforms、history clear 與 target disposal。
- WebGPU Node/TSL 不要偷用舊 GLSL `ShaderMaterial`；對應 backend 未實作時提供可見替代而不是黑畫面。

這是**測試設計**，不是聲稱已執行上述錯誤注入。平台來源：[WebGPURenderer Migration](https://threejs.org/manual/pages/webgpurenderer)、[Three.js ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html)。

## 8｜可直接立項的三個高價值 PoC

**PoC-W｜水面影像正確性：**`W0 Gerstner+Fresnel+foam` vs `W1+SSR/probe+depth` vs `W2 FFT Compute`。用同一峽灣與天氣、相機路徑與動態船隻。必須通過 Shader compile、近岸遮擋與反射缺失回退。

**PoC-F｜峽灣大氣與 GI：**`Fog height only` vs `volumetric half-res` vs `volumetric+SSGI`，確保戶外逆光時山谷的層次有提升，而不是只是更暗／更霧。

**PoC-P｜混合像素與 3D：**比較物件透明 alpha edge、Nearest/Mipmap、TRAA 的角色拖影，以及 2D/3D 分 pass 的影像穩定性。以走路／轉鏡頭影片和放大裁切做人工盲測，不能只看 1 張漂亮圖。

## 來源、效力與限制

- [Three WebGPURenderer](https://threejs.org/manual/pages/webgpurenderer) — WebGPU/TSL 相容與不相容的正式說明；2026-11-05 查閱。
- [Three RenderPipeline](https://threejs.org/manual/pages/webgpu-postprocessing.html) — MRT／velocity／RenderPipeline／色彩輸出；2026-11-05 查閱。
- [Three SSGINode](https://threejs.org/docs/pages/SSGINode.html) — SSGI 為 Screen-Space、constructor PerspectiveCamera、採樣數；2026-11-05 查閱。
- [Three SSSNode](https://threejs.org/docs/pages/SSSNode.html) — screen-space shadow 的官方限制；2026-11-05 查閱。
- [Three TRAANode](https://threejs.org/docs/pages/TRAANode.html) — velocity、depth、MSAA 互斥；2026-11-05 查閱。
- [Three WebGPU ComputeNode](https://threejs.org/docs/pages/ComputeNode.html) — GPU compute node 支援概念；2026-11-05 查閱。
- [Three MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html) — 多層 PBR 與成本；2026-11-05 查閱。
- [MDN WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) — 平台支援與 API 能力；2026-11-05 查閱。

**研究不含實際 GPU Benchmarks、Shader 成品、安裝命令執行或任何其他 Repo 修改。** 建議配方是研究輸出，部署前仍須自行進行法線、色彩、相容、效能與美術驗收。
