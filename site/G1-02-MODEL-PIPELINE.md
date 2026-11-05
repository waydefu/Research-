# G1-02｜天文儀 GLB 美術資產管線與官方資料交叉驗證

> 2026-11-05；狀態：PR 工程審查候選。**不是 Blender 原生工程檔或已通過的美術／真機作品。**

## 1. 官方資料核對

| 官方來源 | 已採納的技術事實 | 工程決策 |
| --- | --- | --- |
| [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) | GLTFLoader 支援 glTF 2.0，會解析內含材質和具名節點，對外部 decoder 有明確要求 | 採無 Draco、無 KTX2、完全內嵌 BIN 的標準 GLB，避免手機多下載與外部 WASM |
| [Three.js 材質手冊](https://threejs.org/manual/pages/materials.html) | Metallic/Roughness 是實際 PBR 參數，增加 Physical features 有渲染成本 | 深黃銅與氧化銅分層，壓住過曝；金屬 roughness 分材料設定，而不是只改 CSS 色值 |
| [Khronos Blender glTF exporter](https://github.com/KhronosGroup/glTF-Blender-IO/blob/main/docs/blender_docs/scene_gltf2.rst) | glTF 的基礎材質支援 Base Color、Metallic、Roughness、AO、Normal 和 Emissive；出口會將網格三角化 | 使用可直接由未來 Blender 模型替換的 glTF 2.0 載入契約；本包尚未建立 UV、Normal/ORM 貼圖或 Blender 原稿 |

## 2. 真正做出的結構

- `site/scripts/generate-observatory-model.mjs` 是唯一原始幾何碼：四組寬幅雙面立體天文環，每環具金屬邊框、刻度、羅馬數字立體字、固定鉚釘，中央有齒輪與 32 根輪輻、分層雕塑機座、低矮環形地台裝飾；既有背景圖負責建築空間，不再生成懸浮柱廊。
- 建置由 `site/scripts/preflight.mjs` 產出 `site/public/observatory/observatory-v1.glb` 與 `model-manifest.json`。兩者是可重生的忽略檔，**沒有再把舊版網站、GLB 備份或另一套模型源碼塞入 Repo**。
- GLB 模型是本 repo 程式化建模，具固定節點 Orbit_Outer、Orbit_Meridian、Orbit_Inner、Orbit_Ecliptic、Mechanism、Pedestal、Hall，採 glTF PBR Metallic/Roughness。
- `site/src/experience/observatory/scene.js` 以官方 GLTFLoader 在進入 viewport 後讀取 GLB；載入前保持在庫高細節美術 poster，完全無 WebGL2 時不阻塞搜尋／研究；CPU 幾何組裝不再發生於一般使用者瀏覽器。
- 資產以單一嵌入 binary buffer、不依賴遠端 decoder 或外站授權資產；產生的 manifest 提供精確 bytes、材質和 Mesh 數、SHA256、`blenderExported:false`。

## 3. 實際截圖審核與修正\n\n首輪 393px 與 1440px CI 渲染確實呈現 GLB 刻度與機座，但人工作圖檢查發現前景懸浮柱廊破壞構圖；本次已移除、改以地面基座銜接原始美術，並降低核心的白色光球。這是**工程美術修補**，不是 Owner Golden 簽核，也不能保證與原高細節參考圖完全同級。\n\n## 4. 可執行驗收與風險

| 項目 | 可機械驗證 | 尚需人工／實機 |
| --- | --- | --- |
| glTF 格式 | `node --test tests/observatory-glb.test.mjs` 檢查 magic、version、buffers、部件與 PBR、SHA | Blender 格式回匯及資產美術品質 |
| V3 網頁 | build 會產出 GLB；Playwright 預覽頁要求 WebGL2 可用時確實切換到 Three.js | POCO F8 Ultra 長時間穩定性、iPhone Safari |
| 行動版後備 | `?poster=1` 不請求 GLB；無 JavaScript 仍可讀文字和來源 | GPU context lost、弱網極限、長時間熱 |
| 美術 | 物理厚度、立體刻度與深黃銅材質可用 DOM/模型檔確認 | 是否達到最初參考圖高度：**尚未通過** |
| 效能 | 產物 GLB 上限 4.5 MB，測試可讀 SHA；renderer 節能 DPR 機制保留 | 真機 GPU time / FPS p95 / INP、功耗／熱 |

## 5. Blender GLB 的後續接入介面

這套生成器不是 Blender，也不能假稱有 `.blend`；但模型節點、GLB URL、顯示與退化路徑都已分離，未來使用 Blender 可匯入同規格 GLB，確認 UV/ORM/Normal、授權及尺度，再用同組場景名稱實作旋轉。真正精雕仍需資產生產與人工構圖審核。

**上線策略**：此包僅更新 `/Research-/v3/observatory/` 新版預覽，不改根首頁、研究原文、舊版轉址、CI Workflow 或權限。PR 合併仍需 Owner 批准；CI 的綠燈不能替代美術與實機測試。
