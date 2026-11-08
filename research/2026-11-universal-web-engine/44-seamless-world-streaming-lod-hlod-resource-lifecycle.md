# 44｜Web 大世界架構：Spatial Index、Chunk Streaming、LOD／HLOD、資源生命週期與存檔

**研究日期／來源最後核對：2026-11-09（Asia/Taipei）**  
**狀態：Three.js 和 glTF 官方能力已核對；架構契約為工程設計推論，跨區無縫原型與真機量測 NOT RUN。**  
**用途：** 多視角、可自由探索、含船舶與持續世界狀態的瀏覽器場景；設計目標是擴充世界而不把現有高品質場景全部重寫。

## 核心結論

1. **Chunk Streaming 不等於 Culling。** Chunk 是資料和資源的載入／卸載單位；剔除是決定哪些已存在物件參與繪製；LOD 則降低可見物件的幾何／像素成本。它們可以採不同大小、分別演進。
2. **世界狀態不應綁定 Mesh 生命週期。** 渲染物件被卸載後，NPC、撿起的道具、箱子、船的位置與玩家修改必須仍存在於邏輯狀態／存檔層。
3. **優先以兩區域可逆原型驗證契約**，而非先做「無限大地圖」或立即引入 WebGPU；現有小世界未證明 CPU／RAM／VRAM 隨面積惡化前，正式 Streaming 的採用理由仍不足。
4. WebGPU GPU-driven virtual geometry、occlusion、Meshlets 是條件式後續技術，不是地圖一大就必須用的預設元件。

## 1. 先分開四種空間尺度

| 空間尺度 | 單位 | 典型用途 | 不應混用 |
| --- | --- | --- | --- |
| World / Region | 山區、海灣、城鎮、生態地區 | 世界規則、天氣區、地形種子與敘事 | 世界 Region 不一定是載入單位 |
| Streaming Chunk | 可載入的地形／房屋／植被集合 | 依距離／行進方向載入與卸載 | 一個 Chunk 不等於一個 Draw Call |
| Render Cell | 16／32／64 世界單位等候選 | Frustum Culling、批次合併、光影通道 | Render Cell 可比 Chunk 小 |
| Simulation Cell | NPC、環境互動或物理活躍範圍 | 更新頻率／休眠／事件排程 | 角色休眠不等於狀態刪除 |

建議世界座標採**穩定 Global ID + Region/Cell 座標**，GPU 渲染座標可在很遠世界採本地原點／Floating Origin，存檔不可用不穩定的臨時 Scene Object ID。若真實世界超大，遠距離 Transform 精度和物理座標系統需要另行測試。

## 2. 角色清楚的模組契約

`WorldManifest`（只讀）：`schemaVersion`、`worldSeed`、`regionId`、`assetRevision`、Bounding Box、內容摘要和權利來源；不可把「已載入」當作世界存在的定義。

`SpatialIndex`（邏輯）：以位置／Bounds 查詢附近物件、Cell 及鄰域，支援動態物件異動。選型：均勻網格適合小而密度相對均勻地區；Quadtree 適合開闊地與差異很大的密度；BVH 更適合靜態空間查詢和 Raycast，不等同 Streaming Scheduler。

`StreamScheduler`（程序）：依距離、Camera Frustum、速度預測、船舶航向、記憶體預算、互動優先級給資產佇列排序；支援取消過期請求、retry/backoff、限制並行、載入失敗回退。不承諾每個 HTTP 下載都能瞬間中止；要避免取消後的落後結果重新寫進世界。

`ChunkRenderer`（渲染）：將已備妥資產組成 Three.js Object3D，管理 Render Cell、Instance Bounds、LOD、材質共用及 per-pass visibility；載入進入 renderer 必須尊重固定每影格 CPU/GPU Upload Budget。

`WorldState`（邏輯）：持久物件 ID、事件序列、地形變更、NPC 與遊船活躍／休眠狀態，不因 Render Chunk 被 Evicted 而遺失。

`Persistence`：本機保存／匯入匯出／版本遷移；可先定義契約，不要求此階段就做雲端或帳號服務。

`WorldEnvironment`：天空、太陽、海面、世界時間、風場等全域資源一般不按地形 Chunk 複製，避免重複 Renderer Pass 與接縫。

### 示意資料契約（設計草案，不是可直接投入生產的 API）

~~~json
{
  "schemaVersion": 1,
  "worldId": "coastal-world",
  "worldSeed": 2048,
  "cells": [
    {
      "id": "coast:0:0",
      "regionId": "coast",
      "boundsXZ": [-32, -32, 32, 32],
      "renderCells": ["coast:0:0:r0", "coast:0:0:r1"],
      "dependencies": ["terrain/common", "buildings/v1"],
      "assetRevision": "sha256:<content-hash>",
      "neighborIds": ["coast:1:0"]
    }
  ]
}
~~~

上例的 2048 和 Bounds 純屬說明資料，**不是**任何正式遊戲的種子或實測大小。Chunk 的世界座標與顯示尺寸分開，來源 URL 需經 allowlist／相對路徑約束，避免把存檔中的任意字串當外部資產網址。

## 3. Chunk 生命週期與不變條件

~~~text
UNLOADED -> REQUESTED -> FETCHED -> DECODED -> RESIDENT -> VISIBLE
               |           |         |           |
            CANCELLED    FAILED    DORMANT <- HIDDEN
                            |            |
                          RETRY         EVICTING -> UNLOADED
~~~

其中 `REQUESTED` 表示資產有排程，`DECODED` 表示解碼完成但不保證 GPU 已上傳，`RESIDENT` 表示渲染資源可用但未必可見。遊戲的邏輯狀態維持獨立表；例如已被玩家打開的箱子，其「已開啟」旗標存在 State Store，不存在「箱子模型的 visible 屬性」。

**關鍵不變條件：**
- 每一個 Chunk 有唯一穩定 ID 和單調遞增 generation token，舊的非同步完成結果不能覆寫新的場景版本。
- 同一份 Shared Geometry／Texture／Material 使用引用計數或明確所有權；不能因卸載一棟屋而 dispose 另一區共用材質。
- Visible Chunk 不得缺乏需要的基礎 Collision 地形；至少保留簡化導航代理面以防掉海／穿牆。
- 遠景 LOD 先載入 → 近景高階逐步替換。高階內容失敗時保留既有遠景代理而不是黑畫面。
- Chunk Eviction 不可寫入或抹除世界資料；資料變更先進 Journal／State Store，再由有版本的 Persistence 進行保存。
- 關閉瀏覽器、失去 WebGL Context、背景分頁恢復、網路 404、慢下載返回等都須可回復或明確中止。
- 主相機、陰影相機、海面反射相機可以有不同的 Render Cell 可見集合，必須防止遠景模型只在鏡面內突兀消失。

## 4. LOD／HLOD：由螢幕誤差決策，不是全部 50m 一刀切

Three.js `LOD` 原生以距離切換不同模型、可設定 hysteresis [S1]，但當世界有成千上萬棵樹時，替每棵樹建立一個需要每幀 Update 的 LOD 物件，可能把 CPU 消耗轉移到物件遍歷。候選方式如下：

- LOD0：玩家近距離，完整樹冠與必要風動畫、建築檐口／凹窗、近景陰影與碰撞。
- LOD1：中距離，以保輪廓的減面模型／簡化枝葉幾何；仍保留主色調、霧度與必要陰影。
- LOD2：遠距離以 Instanced／Batched Tree Crown、Billboard／多視角 Impostor、或 HLOD 的群集模型替代。
- LOD3：超遠地形／群山只保留 Silhouette、天空霧和大地形輪廓，不再有個別零件。遠景水面不應改成獨立的無縫性錯誤材質。

距離只是近似條件；更加穩健的判斷是物件世界誤差投影至螢幕像素的 **Screen-Space Error（SSE）**，搭配滯後切換：

- Perspective：畫面像素誤差與 worldError、viewportHeight 成正比，與 depth 和 tan(FOV/2) 成反比；使用保守 Bounding Sphere 和相機方向。
- Orthographic：像素誤差由固定投影高度決定，不可沿用 Perspective 的 depth 縮放公式。
- 兩個等級門檻間設 hysteresis；相機瞬移、切換投影與後製 Render Scale 時更新投影參數。
- Wind animation、透明貼圖和 Texture Atlas 邊緣需做光影相容測試；遠景 Impostor 可能在日落高光與雲影下暴露破綻。
- 若用 Crossfade／Dither，必須測試透明排序與不同 MSAA／TAA 設定，不可假設手機渲染完全相同。

**HLOD 關鍵：** 以區域為單位建立預計算的群組 LOD；中近景顯示個別可互動物件，遠景顯示統一的群組外觀。它**不能**取代每個物件的持續身分；玩家接近／互動時，從穩定 WorldState 重建細節。

## 5. 地形、碰撞與高速移動

- 無縫地形：相鄰 Chunk 使用共同生成種子、對齊網格、共享邊界高度資料，LOD 相差時用 Skirts／Morph／邊緣協定抑制 T-junction 裂縫；在天氣與日照各情況截圖。
- 玩家走路與船舶速度不同，應用**移動方向預測的預載扇區**；突然轉頭可快速優先載入低成本遠景。
- Nav／Collision 的可用範圍通常大於可見範圍，以防快速移動穿過尚未載入的地形；若碰撞區還沒就緒，明確阻止跨區或保持安全代理碰撞。
- 記錄 chunk thrashing：玩家在界線前後移動造成不斷 Fetch/Dispose。使用滯後半徑（load radius < unload radius），以及短暫保留時間／LRU。
- 世界原點漂移與精度：若真正擴充至大尺度，測試 Camera、Raycast、粒子、陰影 UV、海面反射和 Position-based Shader 的同一座標原點；不能只偏移網格忘記 Physics／Audio／Cloud Shadow。

## 6. 資產格式與可管理的記憶體

| 候選 | 官方能力 | 有條件收益 | 必測風險 |
| --- | --- | --- | --- |
| GLB/glTF | Three `GLTFLoader` [S2] | 來源、材質、動畫與解析流程標準化 | 動態釋放、CPU decode/parse／首次編譯 |
| Meshopt／gltfpack | `EXT_meshopt_compression` 必須設 decoder [S2–S3] | 縮小下載與緩解部分記憶體使用 | decoder/WASM 下載、網路 vs CPU 成本、屬性變異 |
| KTX2/Basis | `KTX2Loader.detectSupport` 後轉 GPU 支援格式 [S4] | 大量貼圖場景的頻寬／顯存候選 | 並非所有 KTX2 格式都可讀，需原圖品質 A/B |
| Instanced／Batched | Three 官方 [S5–S6] | 群集 Render Cell + Draw Calls | 動態載入／分批時的緩衝碎片與 Bounds |
| Range Request／Service Worker | 瀏覽器平台機制 | 預載／緩存／離線資產 | 版本一致性、CORS、配額、瀏覽器清理快取 |

gltfpack 可能重排節點、合併材質或變更几何精度；若需要穩定互動物件名稱／IDs，要測試保留選項（如 `-kn`／`-ke`），**不可把資產壓縮當成可無損替換所有模型** [S3]。

記憶體預算需要把「下載壓縮 bytes」、「解碼後 CPU buffers」、「GPU buffers + textures + RT + MSAA」、「暫存上傳峰值」區分開。手機 VRAM 若無平台可觀測證據，應保留估算上限而非捏造精確數字。以 `renderer.info.memory` 只能監看部分資源數，不能當作真 GPU memory bytes。

## 7. 世界狀態與存檔：與串流完全解耦

**最容易忽略的風險：** 玩家撿走的魚、開過的箱子、停泊的船，若模型卸載時一起失去資料，載入回來就會複製物品或回復初始狀態。建議最小狀態鍵：

~~~text
worldId / stableEntityId / componentType / componentSchemaVersion
transform + facing + inventoryDelta + interactionFlags
simulationTimestamp + deterministicSeed + dirtyRevision
~~~

- 存檔版本化；讀取不可信 JSON 必須驗證結構、資料大小、關聯 ID、參照的 Chunk IDs；匯入前確認是否覆寫當前存檔。
- 使用小型 State Store／事件日誌紀錄物件增減，Chunk Loader 只將「可見呈現」與「碰撞」附上，不能重置 Entity 的持久狀態。
- NPC 長時間不在附近可採抽象化低頻模擬或事件時間推進，但要明確定義作息決定性、時間跳躍、離線模式；不要把「沒載入」等同「世界沒有流逝時間」。
- 多存檔、備份匯出／導入屬另一套資料完整性議題，基礎介面需預留，但本研究**不代表存檔系統已完成**。

## 8. 可執行 PoC 與驗收門檻（全部 NOT RUN）

| PoC | 操作步驟 | 必過條件 | 回退／失敗注入 |
| --- | --- | --- | --- |
| P0 兩相鄰 Chunk | 載入 A→B→A 100 回，固定玩家位置軌跡 | 不黑屏、無缺地／撞牆、載入穩定，資源數趨於平台 | 網路 404／慢速後備遠景 |
| P1 快速划船 | 航向預載 + 改變方向／瞬移／Camera Cut | 預載和碰撞不阻塞，沒有破綻與跳海 | Request abort、過期 generation |
| P2 HLOD 樹林 | 同景 LOD 0/1/2/3、SSE + hysteresis | 遠景性能真正改善且沒有可見 Pop-in | 強制切換／不同 FOV |
| P3 三相機能見度 | 玩家、陰影和鏡面反射各看不同方向 | 反射和陰影不缺物件 | 移動船／日落快速變化 |
| P4 WorldState | 撿道具、改 NPC、划船，卸載再載入 | stable ID／物品數及時間連續 | 存檔格式錯、版本遷移失敗 |
| P5 Memory Cycle | 3 畫質×2 相機×20 次卸載重載 | 無 GPU Context Lost，記憶體沒有持續單調增長 | Shared Material 重複 dispose |
| P6 Browser Compatibility | Windows/macOS／Android Chrome／Safari 實機 | 正確載入／必要 fallback、可用 WASD／觸控 | 無 WebGPU、無計時擴充 |

**Go/No-Go：** 如 Chunk PoC 增加大量程式、反而令小世界更慢或無需載入時也造成延遲，不應移植主線。先驗證能「穩定且可逆地管理兩個區域」，再逐步擴大世界。網路速度、裝置、素材數量都需以真實測量確定，不能宣稱無縫世界已有 60 FPS。

## 9. 採用階段、獨立工作邊界與風險

| 階段 | 完成定義 | 分工建議 |
| --- | --- | --- |
| A 基準 | 同樣場景、基準版本、可比 CPU/GPU 資料 | 效能驗證與美術審核分開 |
| B Render Cells | 空間剔除和批次 A/B 有效 | 渲染模組單獨 PR |
| C HLOD | 三視角動態、移動中切換無顯著破綻 | 素材／LOD 管線與渲染分開 |
| D State Contract | 兩個相鄰 Chunk + 跨區互動狀態維持 | World State 與 Renderer 使用顯式接口 |
| E Streaming | 受預算控制的背景載入卸載 | 單一整合人負責共同入口 |
| F Device Gate | 實機熱功耗／效能、故障注入、可退版 | 品質 專案決策者 最終批准 |

**不要**在同一個大型 PR 同時重寫 Input、Renderer、World State、Persistence 和 CI；多端無即時溝通時，先決定模組契約、分支基準和具體整合驗收。

## 10. 官方來源與不確定性

| ID | 原始來源 | 查閱日期 | 證據範圍 |
| --- | --- | --- | --- |
| S1 | https://threejs.org/docs/pages/LOD.html | 2026-11-09 | 原生 LOD、hysteresis |
| S2 | https://threejs.org/docs/pages/GLTFLoader.html | 2026-11-09 | glTF2、KTX2／Meshopt／DRACO 註冊介面；不等於解碼已部署 |
| S3 | https://github.com/zeux/meshoptimizer/blob/master/gltf/README.md | 2026-11-09 | gltfpack 的壓縮／簡化方式與權衡；原作者自述，未量測特定場景 |
| S4 | https://threejs.org/docs/pages/KTX2Loader.html | 2026-11-09 | GPU compressed texture 的偵測與轉碼；不代表所有 KTX2 相容 |
| S5 | https://threejs.org/docs/pages/InstancedMesh.html | 2026-11-09 | 同幾何多實例與 Bounds 管理 |
| S6 | https://threejs.org/docs/pages/BatchedMesh.html | 2026-11-09 | 異幾何批次與個別可見性、屬性一致性 |
| S7 | [本庫 23｜GPU-driven 研究](23-threejs-nanites-gpu-driven-geometry.md)、[29｜資產串流／效能驗收](29-rendering-ceiling-benchmark-and-adoption-gates.md) | 2026-11-09 | 舊研究交叉比對，非現場效能測量 |

## 結論／授權／修訂

- **優先設計：** 先 Render Cells 和適度 LOD；Streaming Lifecycle／World State 契約及兩 Chunk 原型排在真正大世界重構之前。
- **待核實：** SSE 門檻、固定 Chunk 大小、實際 FPS、GPU memory、多人同步、長時間手機熱、透明材質的 HLOD 視覺品質。
- **尚未批准實作**：新 Loader、Server、GPU compute、第三方模型與套件均未授權安裝／部署。此文件只提出研究與驗收設計。
- **2026-11-09**：首版公開技術研究，無第三方素材複製，無基準實測。

> **修訂註記（2026-11-09）：** 將內部決策者與研究批次的稱呼改為通用工程語彙；研究結論與待驗證界線不變。
