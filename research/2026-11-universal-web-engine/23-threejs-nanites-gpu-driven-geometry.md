# 23｜threejs-nanites：WebGPU GPU-driven Virtualized Geometry 參考實作

**查證日期：2026-11-03（Asia/Taipei）**  
**上游：** [VictorZakharov/threejs-nanites](https://github.com/VictorZakharov/threejs-nanites)  
**授權：** MIT（已核對上游 LICENSE 與 GitHub metadata）  
**定位：** Three.js / WebGPU 的 **Nanite-style GPU-driven cluster LOD 技術示範**。不是 Unreal Engine 5 Nanite 的官方移植，也不應宣稱與 UE Nanite 完全等價。

## 一句話結論

這個專案最有價值的地方，不是「能顯示很多樹」，而是示範如何把 **cluster DAG LOD、GPU culling、HZB occlusion、indirect draw、software rasterization、impostor、asset streaming、temporal upscaling 與自動畫質控制** 串成一套可在瀏覽器執行的大型場景渲染架構。

對本技術庫而言，它應歸類在：

> **WebGPU / GPU-driven rendering / virtualized geometry / massive-scene rendering**

而不是一般 UI 動畫或單純 Three.js 特效。

## 核心技術

### Cluster DAG LOD
- 幾何切成約 **128-triangle clusters**，逐層合併、簡化、重新切分形成 DAG。
- 每幀依 screen-space error threshold `τ` 選擇 DAG cut，而不是替整個物件切固定 LOD。
- 目標是降低 per-object LOD 的突跳與裂縫。

### GPU-driven culling + indirect draw
- chunk、instance、cluster 層級的可見性與 LOD 決策大量搬到 GPU compute。
- draw 使用 indirect drawing，並從 storage buffer 做 vertex pulling。
- 核心價值是降低 CPU 每幀逐物件提交與 LOD 決策成本。

### HZB occlusion
- 使用 hierarchical depth buffer 做兩階段遮擋剔除。
- 利用前一幀與當前幀深度減少被遮住的 geometry。

### Software rasterizer
- 對畫面上只佔少量像素的微小三角形，專案可改走 compute + visibility buffer，再統一 shading。
- 這是處理大量 micro-triangle 固定 raster cost 的高階做法，值得研究，但維護成本也很高。

### Impostor
- 遠距離樹木改用多角度、帶法線與光照資訊的 impostor。
- geometry → impostor 以 dither cross-fade 過渡。
- 極遠 tiny impostor 可直接 splat 進 software rasterizer 的 visibility buffer。

### Asset streaming
- PLY / glTF / GLB / OBJ 可離線處理成自訂 `.nm`。
- DAG 資料會 quantize 並使用 meshopt 壓縮。
- 檔案前段先放 coarse model，可先顯示低精度版本，再串流完整資料。
- 上游以 Lucy 4M triangles 為例，README 聲稱完整 LOD 檔 gzip 後約 **16.1 MB**，前 **0.44 MB** 可先提供 128k triangles coarse copy。這些是**上游數據，不是本 Repo 實測**。

### Temporal AA / Temporal Upscaling
- jittered camera、depth reprojection、wind motion vector、history clipping。
- 低於螢幕解析度渲染，再用 temporal history 重建輸出。
- 可類比 TSR / FSR 2 的思路，但**不能宣稱演算法或品質與 UE TSR / AMD FSR 2 相同**。

### Auto quality
上游 README 預設：
- desktop GPU budget：**5.5 ms**
- touch / phone：**14 ms**
- 動態調整 `τ` 與 render resolution。

這種「看實際 GPU frame time 再降畫質」比只用 UA 判斷 Desktop/Mobile 更值得借鑑。

### WebGL 2 fallback
此專案**不是 WebGPU 失敗就完全不能用**。上游有 reduced WebGL 2 mode：
- fixed DAG cuts 的 instanced meshes
- 同一套 impostors
- 無 WebGPU compute occlusion
- 無 software rasterizer
- Lucy forest 僅 WebGPU

因此它也是能力分級與 graceful degradation 的好案例。

## 上游展示規模（只視為作者環境證據）

| 場景 | 上游宣稱規模 | 判讀 |
| --- | --- | --- |
| Forest | 1M trees + 1.5M bushes；full detail 約 38B triangles | 並非每幀真的 rasterize 38B |
| Lucy Forest | 250,000 個 4M-triangle Lucy；full detail 理論約 1T triangles | 依 LOD / impostor / culling 大量裁減 |
| 作者桌機 | RTX 4070 Ti，1920×1080，144 FPS vsync-capped | 不能外推其他 GPU |
| 高空 Forest 範例 | 808k plants 用 impostor，GPU 5.1 ms | 作者單機、單場景 |
| Lucy 近地範例 | 1.7k geometry statues + 6.7k impostors，GPU 4.0 ms | 非本 Repo benchmark |

**重要：**「38B / 1T triangles」是原始全精度資產的理論幾何量，不代表瀏覽器每幀直接畫數百億或一兆 triangles。

## 對 Creative Web 最值得借鑑

1. **screen-space error LOD**：用視覺誤差決定細節，而不只看距離。
2. **GPU-driven rendering**：大量 instance / geometry 時減少 JS 主執行緒 submission。
3. **hierarchical culling**：chunk → instance → cluster 多層裁減。
4. **impostor + geometry hybrid**：森林、城市、建築遠景很實用。
5. **coarse-first streaming**：大型 3D landing 不必等完整資產下載完才開始。
6. **GPU-time adaptive quality**：比固定 preset 更精細。
7. **temporal upscaling**：fill-rate / resolution 成瓶頸時的另一條性能路徑。

## 不應直接照搬

- 一般企業站、文件站、商城沒有理由導入 Nanite-style geometry pipeline。
- 單一 Hero 3D 模型先做 meshopt / KTX2 / LOD / lazy loading 通常更合理。
- software rasterizer、visibility buffer、GPU compute culling 會大幅增加 shader、debug、相容與維護成本。
- scene complexity 不足以讓 CPU draw submission / micro-triangle 成為瓶頸時，這套架構很可能過度工程。

## 與現有技術庫的關係

```text
Astro / App Shell
        │
        ├─ DOM / CSS / semantic content
        │
        └─ Three.js renderer
                │
                ├─ normal mesh / PBR / post FX
                │
                └─ massive-scene path
                     ├─ cluster DAG LOD
                     ├─ GPU culling
                     ├─ HZB
                     ├─ indirect draw
                     ├─ software rasterizer
                     ├─ impostor
                     ├─ streaming
                     └─ temporal upscaling
```

它與 GSAP / Motion / Lenis 解的是不同問題：
- **GSAP / Motion / Lenis：**時間、互動、scroll、DOM / canvas choreography。
- **threejs-nanites：**大型 3D 世界在 GPU 端如何被裁減、選 LOD 與繪製。

可搭配，但不應混成同一層技術。

## 採用評級

**研究價值：A（強烈保留）**  
**直接產品依賴：C（先 PoC）**

理由：
- 架構與原始碼公開，MIT。
- 對瀏覽器 massive-scene rendering 有很高研究價值。
- 直接搬入一般網站成本過高。
- WebGPU limits、shader correctness、device/context loss、手機熱功耗仍需真機驗證。
- 自訂 `.nm` 資產管線會新增 build / cache / versioning 負擔。

## 若未來導入，最低 PoC Gate

至少驗證：
1. 桌面中高階 GPU / iGPU / Android 高階機。
2. WebGPU 與 WebGL2 fallback 是否都能完成同一內容路徑。
3. 1% low、GPU time、CPU main-thread time、記憶體與載入流量。
4. device/context lost。
5. tab background → foreground。
6. resize / DPR / orientation change。
7. coarse-first streaming 對 first meaningful 3D 是否真的有改善。
8. impostor transition 視覺品質。
9. adaptive quality 是否 oscillate。
10. `prefers-reduced-motion` 與完全關閉 3D 的 Basic fallback。

## 最終判斷

**值得收錄，而且是目前技術庫 WebGPU 方向的高價值參考。**

真正值得拆的是：

> **Cluster DAG + GPU culling + HZB + impostor + streaming + adaptive resolution**

software rasterizer 與 temporal upscaling 屬於更高階層級，應在 PoC 證明瓶頸後才導入。

## 原始來源

- [VictorZakharov/threejs-nanites](https://github.com/VictorZakharov/threejs-nanites)
- [上游 README](https://github.com/VictorZakharov/threejs-nanites/blob/main/README.md)
- [上游 MIT LICENSE](https://github.com/VictorZakharov/threejs-nanites/blob/main/LICENSE)
- [Live Demo](https://victorzakharov.github.io/threejs-nanites/)
- [Three.js WebGPU Renderer](https://threejs.org/manual/pages/webgpurenderer)
- [meshoptimizer](https://github.com/zeux/meshoptimizer)

**證據界線：** 本條目核對上游 README、Repository metadata 與 LICENSE；尚未在本 Repo 重跑作者 benchmark，也沒有完成手機／桌機同條件性能重現。
