# 05｜Web 動效、Shader、3D：對手機 AKM 專案的技術選型

**價值：高**。曾於十月比較大量選項；不能因為效果漂亮便忽略效能、素材比例、授權與資料真實性。

## 技術分類

| 技術 | 原始來源 | 特點 | 研究定位 |
| --- | --- | --- | --- |
| Motion (原 Framer Motion) | https://motion.dev/ | JS／React／Vue 動畫、layout／spring／scroll | 可作簡潔狀態轉場 |
| GSAP / ScrollTrigger | https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | Timeline、捲動驅動 | 適合複雜編排，需控制需求 |
| Anime.js | https://animejs.com/ | 以 JS 處理時間軸和 DOM 動畫 | 備選 |
| Theatre.js | https://www.theatrejs.com/ | 場景與動畫編輯 | 重型編排時才考慮 |
| Rive | https://rive.app/ | 互動向量動畫與狀態機 | UI 動效參考 |
| Lottie | https://airbnb.io/lottie/ | 向量動效內容播放 | 小型動效素材 |
| Three.js | https://threejs.org/ | 3D 場景、相機、材質、WebGL | 真 3D 可用，但需模型資產 |
| React Three Fiber | https://r3f.docs.pmnd.rs/ | Three.js 與 React 整合 | 只在已選 React 時 |
| OGL | https://github.com/oframe/ogl | 小型 WebGL 庫 | 輕量 shader 候選 |
| Lenis | https://lenis.darkroom.engineering/ | 平滑捲動 | 非必要；可能影響原生互動 |
| WebGL2／WebGPU | https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext | GPU 渲染介面 | 依設備與相容性評估 |
| View Transition API | https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API | 原生頁面／狀態轉場 | 優先驗證瀏覽器支援 |

其他曾比較：Paper Shaders、Spline、Unicorn Studio、Codrops、Active Theory、curtains.js、GSAP 子插件、3D PBR／HDRI／Postprocessing。

## AKM 最重要的工程教訓

1. **2D 比例優先。** AKM 的座標與槍身比例應依 `data/weapons/akm-geometry.json` 與實機證據；動效不得掩蓋幾何不正確。
2. **真 3D 分件 ≠ 貼圖假替換。** 模型 GLB 真實 mesh 拆分、材質與配件相容性要分別驗證；單一 mesh 的 iframe 模型不能宣稱「已支援真改槍」。
3. **資料與動畫分開。** 球形軌跡或後座力線條如果沒有實機量測，必須顯示「研究示意」，不應變成正式彈道。
4. **效能成本。** 手機需測 FPS、長時間溫控、WebGL context loss、低階瀏覽器 fallback 與 reduced-motion。
5. **素材授權。** GLB、HDRI、照片、音效等各自記錄授權與來源，不能因為可嵌入就當作可再散布。

## 推薦分層

- **第一層：** 原生 CSS／Web Animations API，保留低成本、可退化的微互動。
- **第二層：** 有明確複雜編排需求時選 Motion 或 GSAP，避免重疊。
- **第三層：** 必須有真實空間模型、可驗證 mesh 和效能測試，才引入 Three.js／3D pipeline。
- **第四層：** PBR／特效只有在確實改善展示且量測成功時上線。

### 專案與來源

- [DELTA LAB 原始專案](https://github.com/waydefu/delta)
- [GSAP ScrollTrigger 官方](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Motion 官方 GitHub](https://github.com/motiondivision/motion)
- [Three.js 官方](https://threejs.org/)
- [Codrops](https://tympanus.net/codrops/)
