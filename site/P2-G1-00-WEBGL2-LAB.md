# P2／G1-00｜低風險 WebGL2 研究核心驗證實驗室

> **階段狀態：已提交隔離 PoC 候選；P2 完整 G1 尚未通過。** 此原型使用原生 WebGL2，**未使用 Three.js**；不能冒稱已實現選定的 Three.js／Blender 方案，也不是 Active Theory 級完工頁面。

## 可驗證成果

- 隔離 URL（PR 合併後才可能上線）：`/Research-/v3/atlas/g1/`。無主站導覽變動、`noindex`，不覆蓋 Sanctum 或閱讀館。
- 真正的 WebGL2 頂點／片段 shader、原創雙環與八面體、2700 ms 由遠及近的透視鏡頭；無外部 CDN、字型、3D 模型或新增 npm dependency。
- Canvas 關閉或 GPU 不支援時保留可見的手工 SVG poster、研究入口、完整文字與操作說明；可用 `?forcePoster=1` 重現失敗降級。
- 尊重 `prefers-reduced-motion`、分頁不可見暫停、使用者播放／停止、節能 DPR 模式、`webglcontextlost`／restored 事件。
- GitHub CI Playwright 覆蓋 320／393／768／1440、無 JavaScript、強制 fallback、減少動態與互動控制。Headless Chromium 的 GPU 支援不代表實體手機性能。

## 不宣稱完成

| G1／P2 Gate | 此包狀態 |
| --- | --- |
| 離線原創場景／靜態可讀路徑 | PoC 有基本 DOM + SVG 退化 |
| WebGL2 shader 幾何和鏡頭 | 有實際原創程式；仍須 browser CI 證據 |
| Renderer / device context lost | 程式含監聽及 fallback；需要真實錯誤注入與真機 |
| Three.js r187 / TSL / WebGPU | **未實作**；引入前要核對版本、授權、lockfile、設備 fallback |
| Blender GLB、PBR／IBL、金屬材質與星圖 | **未實作**；當前只有程序化幾何 |
| GSAP／Director 跨頁飛行 | **未實作**；此路由僅單次短距鏡頭 |
| GPU timer／FPS p95、熱量、功耗 | **未量測**；不得用 RAF 代替 GPU time |
| Owner 美術 Golden／Android／iOS | **未簽核、未實測** |
| 正式主站部署／P2 完成 | PR 必須人工 review；不自動上線 |

## 下一個 G1 工作包

1. 鎖 Three.js 正式版及 MIT 授權和 npm lockfile，驗證 WebGPU 與 WebGL2 fallback；保留此原生 WebGL2 lab 作對照基線。
2. 將原創幾何轉成單一 glTF／GLB，執行 glTF-Transform、KTX2/meshopt 的實際資產檢查。
3. 實作可取消的鏡頭、圖形上下文恢復和 quality state machine；加入 benchmark 的原始採樣輸出。
4. 通過 #72 的獨立驗收後再進 P3。不得把 #65 的 R0 文獻當成 P2 產品完成證據。
