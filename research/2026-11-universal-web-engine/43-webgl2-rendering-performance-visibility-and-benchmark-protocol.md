# 43｜瀏覽器即時 3D 場景優化：CPU／GPU 基準、空間批次、視野剔除與 Render Pass

**研究日期／來源最後核對：2026-11-09（Asia/Taipei）**  
**狀態：官方 API 與公開原始碼方法已查證；跨硬體基準與 A/B 數據 NOT RUN。**  
**範圍：** Three.js r187／WebGL2 基線；兼顧桌面、Android 與具備第三視角／第一人稱的開放環境。本文是通用研究，不代表已將演算法導入任何遊戲。

## 摘要與可否採用

**已證實（官方文件）：** `InstancedMesh` 能減少同幾何同材質物件的 Draw Calls；`BatchedMesh` 能將相同材質但不同幾何與矩陣的物件合批，且有物件級視錐剔除選項；`LOD` 支援距離分級與 hysteresis；WebGL2 GPU 計時查詢需要可用的 `EXT_disjoint_timer_query_webgl2`，且結果必須非同步讀取。來源見文末 [S1–S5]。

**工程推論（未實測）：** 材質相同就合成橫跨整張地圖的 Mesh，可能讓原本可剔除的遠方幾何跟著繪製。較合理的候選是「空間分桶 × 材質／陰影狀態合批」，並依主相機、反射相機和陰影相機分別判斷可見性，而非只做一份主鏡頭的布林開關。

**未證實：** 任何特定 FPS 提升百分比、在所有設備都較快、所有 Three.js Shader 與 BatchedMesh 完全相容、WebGPU 一定優於 WebGL2。此處的門檻都是候選驗收規格，**不是 benchmark 結果**。

## 1. 優化前先分類瓶頸

影格時間不是單純把 JS Update、Draw Submit、GPU Pass、資產上傳時間相加。CPU 與 GPU 可能排程重疊，RAF 幀間隔亦混有 VSync／排程和背景分頁因素；應分欄紀錄且避免跨不同幀加總。

| 現象與診斷實驗 | 可能瓶頸 | 有條件的處置 | 反例／停損 |
| --- | --- | --- | --- |
| 固定鏡頭降低渲染像素，p95 明顯下降 | Fragment／Fill-rate／後製／頻寬 | 縮低反射與後製 RT；檢討透明 overdraw | 降解析度仍無改善 → 查 CPU/geometry |
| 場景物件增多後 CPU submit 增加、Draw Calls 增高 | CPU 提交／材質切換 | Instancing、分區 Merge、BatchedMesh | Draw Calls 降了但 GPU 三角形與 p95 更差 |
| 山林遠景極慢、畫面解析度變化不敏感 | 幾何／Vertex／剔除不佳 | Frustum、可見群組、LOD、HLOD | 物件本已完全剔除 → 沒有效果 |
| 第一幀／轉角尖峰 | Shader compile／資料解碼／資源上傳 | 預熱、分批上傳、依需求預載 | 幀均值改善但 1% low 更差 |
| 10–20 分鐘後掉幀 | 熱降頻／頻繁 GC／資源累積 | 長時間追蹤、資源釋放、畫質階梯 | 實際機器不暴露溫度時不能硬寫 °C |
| 同場景日落比正午慢 | 全螢幕光束／反射／雲影／DoF | 獨立 Pass A/B 與固定時間狀態 | 僅憑目測不應指認某 Shader 是瓶頸 |

### 必須收集的原始資料

- `commit_sha`、資產 hash、瀏覽器版本、OS、GPU vendor/renderer（若可取得）、WebGL extensions、頁面是否可見、裝置是否硬體加速。
- CSS viewport、DPR、真正的 drawing buffer 尺寸、render scale、品質檔、MSAA、陰影 atlas、場景時間、天氣種子、鏡頭位置／投影與行走路線。
- Frame interval p50/p95/p99、>16.7ms／>33.3ms 比例、卡頓事件與長幀；CPU update、submit、主場景、反射、雲影、Bloom／DoF／Rays 分項。
- `renderer.info.render.calls/triangles`、`renderer.info.memory.geometries/textures`、載入 bytes、JS heap（若可用）、實際 GPU timer status、Context Loss／Shader Error 數。
- `renderer.info` 是渲染器統計，**不是**實際 VRAM bytes、GPU 百分比或可見像素量。WebGL 記憶體不能靠此 API 完整、跨裝置精確得出。

### 最小可重複實驗規格（建議）

1. 固定三套品質 × 同一個場景／光照／天氣／鏡頭、固定動畫種子與速度；資產檔與 Git revision 不變。
2. 每次先預熱至少 15 秒、採樣 30–60 秒；每一個關鍵實驗至少五個獨立回合。桌面 A/B 順序交錯，記錄任何背景失焦與熱狀態變動。
3. 對 CPU-bound 與 GPU-bound 假設分別設計「只變更一個因素」的關閉／重開測試，保留原始 JSON／截圖及 Chrome tracing（如可用）。
4. GPU 查詢使用 `EXT_disjoint_timer_query_webgl2`：若 extension 不可用、DISJOINT、結果仍 pending，輸出 `UNSUPPORTED`／`DISJOINT`／`INCOMPLETE`，**不得填 0ms**。不同影格的分項不能視為同一影格總和 [S4–S5]。
5. 移動模式應驗證玩家真實世界座標有變，並分別量測固定視角與動態視角；被動畫暫停、操作無效或 renderer fallback 的回合標 `INVALID`。
6. 真 Android 裝置 15 分鐘×3 回合觀察熱降頻、耗電和畫質階梯。Playwright mobile viewport **不是**真實手機 GPU。

## 2. Instanced、Merged 與 Batched 的正確比較

| 策略 | 合適資料 | 好處 | 隱性成本／不適用 |
| --- | --- | --- | --- |
| 個別 Mesh + Frustum | 少數大型建築、互動物件 | 精細剔除、生命週期單純 | Draw Calls／材質切換 |
| `InstancedMesh` | 同幾何／材質的樹幹、葉卡、草、欄杆 | 共享幾何和單次多實例繪製 [S1] | 整批 Bounds 可能太大；改動 Instance Matrix 後要重新檢查 Bounds |
| 全域 `mergeGeometries` | 緊密、永遠共同可見的靜態零件 | 提交次數最低 | 無法單獨剔除／卸載／互動、合併成本與屬性一致性 |
| Spatial Merge | 按座標分桶後的靜態物件 | Draw Calls 與粗粒度剔除折衷 | 分桶數過多增加 draw submit |
| `BatchedMesh` | 同材質且不同幾何的重複場景 | 每件 Instance 可以獨立視錐剔除 [S2] | 幾何屬性佈局必須相容；支援矩陣更新與排序需另驗 |
| HLOD／Impostor | 遠距森林／房屋群／山體 | 遠景簡化幾何、可減記憶體與頂點工作 | 烘焙成本、光照連續性、切換 pop |

**反模式：**「物件愈多，愈要 merge 成一個世界級 Mesh」。若大量物件位於相機 Frustum 之外，這個 Mesh 的整體 Bounding Sphere 很可能一直被看見，失去粗粒度剔除的價值。此為幾何可見性推論，實際收益仍看測量。

### 空間批次化候選實驗

- 靜態物件以世界 X/Z 座標切成 16／32／64 單位的分桶；各區內再依 `material UUID + shadow flags + renderOrder + attribute layout` 合併。
- 優先保留建築／地標的單獨可見性；跨區的大橋或長條海岸視為獨立大型物件，不按中心點硬切，必要時按幾何切分。
- 實例化的樹木按「樹種／LOD／區域」分桶，重新計算 Instance Bounds；保守擴大風動畫可能伸展的半徑；空群組完全隱藏。
- 測試不同視角與主相機、反射相機、陰影攝影機所需的可見物件集合。若靠 `mesh.visible=false` 為主鏡頭剔除，反射和陰影通道可能也失去該物件；應採各 Pass 可見性與 render layer 管理。
- 量測批次數、呼叫數、Submitted Triangles、CPU scene traversal、world build、GC、p95；只用 Draw Calls 作成功門檻會導致錯誤取捨。

### Frustum、Occlusion 與 HZB 不是同一回事

- **Frustum Culling**：用相機六個平面和 Bounds 判斷是否可能在畫面內，CPU 成本相對低；但相機內、完全被牆遮住的物件仍可能提交。
- **Occlusion Query**：WebGL2 有非同步 Query（如 ANY_SAMPLES_PASSED）；會有一幀以上延遲、Query Overhead、渲染順序和保守錯誤問題。不能把所有小物件各發一個 Query。
- **HZB／Depth Pyramid**：在 GPU 上根據階層深度做保守遮擋；通常需要多層 Depth 資源、上一幀歷史、camera-cut reset、動態遮擋物處理。WebGL2 下不保證比簡單 Frustum 更省。
- 海岸、山谷、室外遠景的主要遮擋較弱；室內、巷弄、密集建築較有 Occlusion 研究價值。是否採用以實測 visible-set reduction 與同步／延遲成本決定。

## 3. GPU Render Pass 與 Shader 成本模型

海面 Reflection Pass 不是一張免費的貼圖；可能再次渲染大量世界幾何。Cloud Shadow、Bloom 下採樣鏈、Sun Rays、DoF、Composite 等也是額外目標與頻寬。應建立明確 Frame Graph，記錄：
- 每個 Pass 的輸入／輸出、尺寸、格式、samples、更新頻率、依賴順序、GPU 計時覆蓋率。
- 固定鏡頭時依序關閉 Reflection、Cloud Shadow、DoF、Rays、Bloom，再測量獨立成本與交互作用，不以全部關閉的結果代替單一效果成本。
- 反射與陰影不必在每一影格更新：可研究鏡頭移動閾值、時間間隔與內容變更觸發；但海浪、船、日照方向及鏡面邊緣會造成畫面不一致，應先做動態 A/B。
- 透明葉片、草卡、泡沫和玻璃需要看 Overdraw／AlphaTest／Alpha-to-Coverage 與材質 shader 數。單純降 Draw Calls 不一定減少 Fragment Cost。
- 降低 Render Target 尺寸通常按**像素面積**節省一部分工作，若寬高縮至 0.75，面積為 0.5625；這不是 FPS 可直接提高 43.75% 的證據。
- 色彩／曝光／Tonemapping 的精確對照要固定線性色彩空間、雜訊種子及截圖流程。

## 4. 何時考慮 WebGPU、GPU-Driven Rendering 或 Virtual Geometry？

Three.js 官方 `WebGPURenderer` 有 Node Material／TSL，並具 WebGL2 fallback；然而 `ShaderMaterial`、`RawShaderMaterial`、`onBeforeCompile` 與既有 EffectComposer Pass **不能不加移植就沿用** [S6]。現成 WebGL2 自訂海水／天空／後製的相容成本可能高於短期收益。

GPU-Driven Culling、Meshlet／Virtualized Geometry、Compute-driven indirect draw 等適用於巨量獨立幾何且已證明 CPU submission 或 GPU Geometry 是主瓶頸的情況。WebGPU 功能、GPU 寄存器／帶寬、部署平台差異、Fallback 平行維護及授權也需計入。公開的 Nanite-style 候選**不是**「裝了套件就取得 Unreal Nanite 品質與 FPS」的證據。

**決策：** WebGL2 為先行基線；WebGPU 保持獨立 sandbox PoC，需同場景 GPU/CPU/visual parity + 真機結果方可提升優先級；不直接替換 Production Renderer。

## 5. 圖形正確性與驗收閘門（設計規格，NOT RUN）

| Gate | 事前假設 | 合格證據 | 不通過時 |
| --- | --- | --- | --- |
| G0 Baseline | 能找出主瓶頸 | 可信 CPU/GPU／Draw Calls／截圖／版本，至少三個獨立有效回合 | 不做架構重寫 |
| G1 Spatial Merge | 遠景提交三角形下降，CPU 不大升 | 16/32/64 空間桶 A/B、鏡頭轉動、碼頭、樹林、村莊 | 回退到原 Merge |
| G2 Instance Culling | 不見的樹木不浪費提交 | Bounds 單測、風動畫、影子／反射檢查、真機 A/B | 關閉該樹種新剔除 |
| G3 Pass Budget | 可降低不必要 RT 負擔 | 分 Pass timing、視覺逐幀對照、GPU Query status、動態相機 | 不減少關鍵畫質 |
| G4 No Regression | 不影響玩法 | WASD／Pointer Lock／觸控、游泳／船、釣魚、天氣、相機、CI、真機 | PR 不合併 |
| G5 Resource Cycle | 無新記憶體累積 | 往返場景與品質切換，幾何／貼圖／programs 趨於穩定 | 查引用計數與 dispose |
| G6 Stop Rule | 優化的價值大於複雜度 | p95 改善超過量測波動；10–15% 只是候選有感門檻 | 提交 A/B 報告後停止採用 |

畫質不退化指的是沒有肉眼可見的幾何消失、陰影／海水反射缺失、LOD 閃爍、透明葉片異常；不禁止經人工確認的「不可見工作」減少。對無法測得的手機熱／GPU 時間，應填 `NOT_RUN`／`UNKNOWN`。

## 6. 原始來源、邊界與相關研究

| ID | 一手證據 | 查閱日期 | 可以支持／不能支持 |
| --- | --- | --- | --- |
| S1 | https://threejs.org/docs/pages/InstancedMesh.html | 2026-11-09 | 同幾何實例化、Bounding Sphere 說明；不能保證 FPS |
| S2 | https://threejs.org/docs/pages/BatchedMesh.html | 2026-11-09 | 多幾何批次與屬性條件、per-object culling；不能保證所有 Shader 相容 |
| S3 | https://threejs.org/docs/pages/LOD.html | 2026-11-09 | 距離 LOD 與 hysteresis；不能直接替代 SSE/HLOD |
| S4 | https://developer.mozilla.org/en-US/docs/Web/API/EXT_disjoint_timer_query | 2026-11-09 | GPU 計時特性與裝置相容限制 |
| S5 | https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/ | 2026-11-09 | WebGL2 extension 規格；不是特定 GPU 可用性證明 |
| S6 | https://threejs.org/manual/pages/webgpurenderer | 2026-11-09 | TSL 與 Renderer 移植限制；不支持「WebGPU 必然快」 |
| S7 | https://github.com/mrdoob/three.js/blob/r187/examples/jsm/utils/BufferGeometryUtils.js | 2026-11-09 | 合併幾何工具的公開原始碼入口；未於本輪執行 |
| S8 | [既有 29｜渲染驗收研究](29-rendering-ceiling-benchmark-and-adoption-gates.md)、[既有 23｜GPU 驅動幾何](23-threejs-nanites-gpu-driven-geometry.md) | 2026-11-09 | 提供早期研究與假說；本篇未冒充其未跑的 benchmark |

## 採用狀態、反證條件和修訂

- **採用建議（待 Owner 批准）：** 先做完整基準與「空間分區 batching + Instance Bounds」的受控實驗，再依 Pass 耗時調整海面反射／後製；Occlusion／WebGPU 是進階候選。
- **不採用條件：** 實際 p95 改善低於統計波動；CPU／記憶體成本增加；海面反射或陰影遺失；真機熱穩定性惡化；不得用低畫質的對照誤導。
- **2026-11-09**：首版通用技術研究。沒有下載第三方商用程式、沒有引用第三方截圖、沒有部署、沒有實際效能測試。
