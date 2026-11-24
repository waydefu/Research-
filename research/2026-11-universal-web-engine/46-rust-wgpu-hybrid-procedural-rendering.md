# 純程式 3D 的混合架構：Rust、wgpu、WebGPU 與 Wasm

查核日期：2026-11-24。來源為 2026-11-17 公開研究 PR 的描述及可見原始報告差異；本文沒有獨立執行上游、重跑 benchmark 或重新確認所有上游授權。

## 比較兩種程序化場景

| 案例 | 原研究記錄的技術 | 邊界 |
| --- | --- | --- |
| Abyssal Garden | 原生 WebGPU、WGSL compute 密度場與地形、植被、品質分級、固定飛行探針 | 小 HTML 不代表 GPU 記憶體小；作者數據不是獨立實測 |
| Crimson Loong | Three.js r180 / WebGL2、程序幾何與材質、instancing、載入時烘雲、鏡像水體、HDR 後製及動態 DPR | 固定敘事鏡頭不是自由探索遊戲；vendor MIT 不等於完整作品授權 |

原研究列出 Abyssal Garden 固定來源 a596354eff400d458bc2aeb9bdf5e0a9734b2bcf（MIT 記載），Crimson Loong 固定來源 264b9d1c63f298a206f53d18ddc1e49d0b10c334（整體授權未確認）。只研究方法，不移植資產或程式碼。

## 混合而不是重寫

TypeScript 負責 UI、輸入及平台 API；Rust/Wasm 候選負責可批次化的 CPU 熱點，如 ECS/SoA 資料布局、地形生成、空間索引與模擬；WGSL compute 及 render pipeline 負責 GPU 大量並行。盡量保持 GPU-resident buffer、間接繪製、明確資源生命週期；避免逐物件 JS/Wasm 往返及每幀 CPU/GPU 同步 readback。Worker、雙緩衝快照與 Simulation LOD 必須計入跨執行緒傳輸、記憶體與延遲成本。

wgpu 可以作為 Web 及原生 GPU 後端的共同抽象，但 WebGPU、WebGL2、Vulkan、Metal 的能力不完全相等；不保證所有 compute、indirect-first-instance 或 worker 功能可用。共享 Wasm 記憶體／多執行緒涉及 cross-origin isolation，需測實際部署 headers，而非假設靜態主機預設支援。單檔 HTML、Wasm 載入、安全上下文與離線 file:// 必須獨立驗證。Rust 不會自動降低像素 shader、陰影或過繪成本。

## 採用實驗

同等畫質、解析度、鏡頭、裝置、場景與光照比較 A：Three.js/WebGL2；B：TS/WebGPU；C：TS + Rust/Wasm + WebGPU；D：C + Worker/SIMD/Threads。逐項開關、記錄 CPU/GPU 分布、記憶體、功耗、熱降頻、輸入延遲和載入時間。測不支援功能及裝置失效回退。未驗證 C/D 有淨收益，不全面改寫既有引擎。不同後端的功能缺失與畫質差異必須公開，不拿低畫質結果與高畫質基準比速度。

## 來源

- [公開研究變更 #149](https://github.com/waydefu/Pixel-Games/pull/149)：仍開放；查閱其報告差異及架構補充，不代表已採用。
- [Abyssal Garden 固定版本](https://github.com/Noniv/abyssal-garden/tree/a596354eff400d458bc2aeb9bdf5e0a9734b2bcf)、[其 LICENSE](https://github.com/Noniv/abyssal-garden/blob/a596354eff400d458bc2aeb9bdf5e0a9734b2bcf/LICENSE)。
- [Crimson Loong 固定版本](https://github.com/ChetasLua/crimson-loong/tree/264b9d1c63f298a206f53d18ddc1e49d0b10c334)、[vendor LICENSE](https://github.com/ChetasLua/crimson-loong/blob/264b9d1c63f298a206f53d18ddc1e49d0b10c334/vendor/LICENSE)。
- [wgpu Web 文件](https://wgpu.rs/doc/wgpu/documentation/platforms/web/index.html)、[MDN SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)。上游連結轉錄自原研究及技術文件入口，需在正式採用時重新查核。
