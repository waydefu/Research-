# 十種雲屬的程序生成演算法：從 WMO 氣象形態到 JavaScript／GLSL／WebGPU

**研究與上游核對：2026-11-08（Asia/Taipei）**  
**研究問題：** 在可動態切換天氣的 Three.js／原生 WebGL2／WebGPU 3D 世界中，如何生成卷雲、卷積雲、卷層雲、高積雲、高層雲、雨層雲、層積雲、層雲、積雲與積雨雲，而不是「只有同一張雜訊貼圖改透明度」？  
**查證方法：** 以 WMO／NOAA 原始雲屬定義校對形態，閱讀 `takustaqu/atmosphere` 的真實 TypeScript／GLSL 實作、Unity HDRP 的雲圖／體積技術說明、Guerrilla Games Nubis 與 Three.js 官方示例。**本次未下載／安裝／執行專案、未渲染任何影格、未進行手機或桌機基準測試；方案與參數均為工程推導，不是已通過的性能主張。**

## 1｜氣象學先說清楚：十種「屬」，不等於十個固定高度槽

WMO 2017《國際雲圖》定義十個互斥的雲屬（genus）：Ci、Cc、Cs、Ac、As、Ns、Sc、St、Cu、Cb。**雲屬是觀察形態類別，不是單靠雲底高度即可判定的資料欄位。** 中雲族常含雨層雲，但其雲體可向低／高層伸展；積雲／積雨雲通常雲底偏低，雲頂能跨到中高空。高、中、低層高度隨緯度變化：WMO 列出溫帶高層約 5–13km、中層約 2–7km、低層雲底多在 0–2km。**這些是參考區間，不是各種雲的硬性物理邊界。**

| 氣象雲屬 | 外觀辨識特徵（WMO 與 NOAA） | 建議形態生成法（工程設計） | 合適渲染 |
| --- | --- | --- | --- |
| **Ci 卷雲** | 白色纖細絲狀、羽毛或彎鉤，冰晶為主 | **Filament：** 沿高空風向高度拉伸的各向異性 fBM + 低頻 Domain Warp；主體成束、下風側分裂成細絲，邊緣半透明 | 高層方向投影／薄雲平面，必要時加細薄體積 |
| **Cc 卷積雲** | 極小鱗片／顆粒／波紋，魚鱗天空 | **Fine granular：** 高密度細小顆粒＋成群 patch mask；顆粒尺寸朝片邊緣變小並分離，波狀排列可加方向性頻譜 | 高層投影貼圖／雜訊程序雲 |
| **Cs 卷層雲** | 幾乎連續的透明紗幕；有時形成 22° 日／月暈 | **Thin stratiform：** 寬廣低頻雲幕，低光學厚度＋纖維細節；暈圈另用冰晶光學近似，不能用雲密度直接畫白圓 | 高層透明覆蓋／天空光學層 |
| **Ac 高積雲** | 成群羊毛球／片狀，顆粒角尺度比 Cc 大、常有灰白陰影 | **Medium granular：** 中尺度細胞場／多尺度 Worley 或噪聲 blob、patch breakup、底部灰影；可加成帶或波紋 | 中層 2.5D；接近時簡化體積 |
| **As 高層雲** | 延展灰藍／灰色薄厚雲幕，太陽常成模糊光斑 | **Mid stratiform：** 低頻連續 coverage + smooth thickness，高光學深度；用 diffuse sun、降低天空直接照射 | 大面積層狀雲；必要時厚度切片 |
| **Ns 雨層雲** | 厚、暗而廣，常有持續性降水，遮蔽日月 | **Deep stratiform：** 連續高密度、低頻厚度場，雲底碎雲與雨幕；地面陰影與光照顯著降低 | 中／低層厚雲片 + 局部 3D／雨粒體積 |
| **Sc 層積雲** | 低層大型塊團、波浪帶、捲團，塊間有藍天 | **Coarse granular／roll：** 大顆粒塊團＋方向拉伸、破碎孔洞、底部陰影、較低雲底 | 低層 2.5D 或稀疏體積 |
| **St 層雲** | 接近水平的低雲幕，近地面時可與霧連續 | **Low sheet／fog：** 低頻 coverage、柔和薄層；視點進入雲層時與地表霧密度混合 | 低層片雲 + 高度霧 |
| **Cu 積雲** | 底部相對平坦、頂部明亮花椰菜團，孤立或成列 | **Convective：** 略平的高度底座、向上增加的多球體／3D Perlin-Worley 主形、邊緣細噪聲侵蝕、頂部膨脹 | 真 3D Raymarch；遠距可 2D 近似 |
| **Cb 積雨雲** | 高聳對流雲塔，成熟時可能有砧狀雲頂，雷雨強風 | **Tall convective＋anvil：** 垂直多塔與高度分層，頂部達高空後水平擴散成冰晶絲狀砧台，獨立雷電／雨軸／日光遮蔽 | 優先分區 3D Raymarch + 遠景砧台雲層 |

**「通常好天氣」不等於「Cu 一定無雨」：** 有些積雲會繼續發展為降水雲。日暈亦不必然出現在每片 Cs；需特定冰晶幾何與太陽高度。以上粒度、顏色、雲底與降水是**雲屬辨識的形態線索**，不是能從單一雲種預測精確天氣的物理模擬。

## 2｜找到真正在程式碼中實作十種雲的專案：takustaqu／Atmosphere

- 上游：[takustaqu/atmosphere](https://github.com/takustaqu/atmosphere)，**MIT**；查閱 [LICENSE](https://github.com/takustaqu/atmosphere/blob/main/LICENSE)、[package.json](https://github.com/takustaqu/atmosphere/blob/main/package.json) 及 2026-11-06 的正式版 `0.12.0` 原始提交 `01223085dc0bb6a0ab3def2c303b54ff8d5b4c38`。
- 真正的入口：[src/clouds.ts](https://github.com/takustaqu/atmosphere/blob/main/src/clouds.ts)：雲屬 ID、形態、層級、預設遮蔽、`defaultCloudMix(cover,precipitation,convection,haze)` 與 `aggregateCover`。
- 核心 Shader：[src/shaders/sky.ts](https://github.com/takustaqu/atmosphere/blob/main/src/shaders/sky.ts)：`stratiform()`、`granular()`、`filament()`、細胞 `flocks()`、積雲／積雨雲、日照、雨幕、光暈與投影。
- [src/quality.ts](https://github.com/takustaqu/atmosphere/blob/main/src/quality.ts)：`high {cloudScale:1,cumulonimbus:'auto'}`、`balanced {0.75,'auto'}`、`low {0.5,'2d'}`，**這是作者選定的品質設定，不代表在其他硬體已達任何 FPS**。
- [src/renderer.ts](https://github.com/takustaqu/atmosphere/blob/main/src/renderer.ts)、[src/features.ts](https://github.com/takustaqu/atmosphere/blob/main/src/features.ts)：特效 shader variants、按需編譯、雲快取／相機方向投影、積雨雲 2D／volume 選型及資源生命週期。
- 原作者 README 明言「不是物理精確天氣模擬」。主渲染器為**單一 WebGL1 fragment shader**、多雲屬按不同高度的平面和視線方向投影取得近似空間層次；**不代表全部十種雲都是可穿越 3D volume**。積雨雲塔另有選擇性 3D Raymarch。
- 作者提供按 `clouds: {cirrus:0.5,cumulus:0.3}` 表示多層雲混合、`renderCubeFaces` 做六面 Skybox，以及隨 weather `set()` 平滑轉場。若要用在 Three.js，應先確認 canvas context 隔離、Skybox 更新頻率、光照及雲影取樣一致性；不能假定直接當 WebGLRenderer shader 內掛即可。

**最重要的結論：** 可先研究、重用這個 MIT 專案對**四種形態 × 三個高度帶**的細分和動態 weather mix，但若要求第一人稱玩家能飛進每一團 Cu／Cb／Ns 雲，仍須額外完成 3D 密度、光照、遮蔽與相機穿雲。

## 3｜共同 Density 設計：高度分布 × 水平覆蓋 × 形狀場 − 侵蝕場

為每層定義 `CloudLayer {genus,baseHeight,topHeight,coverage,density,scale,wind,seed}`。不同雲屬由不同的**形態函數**決定，而不是套同一個 noise threshold。

```ts
type CloudForm = 'filament' | 'granular' | 'stratiform' | 'convective';
type CloudGenus = 'Ci'|'Cc'|'Cs'|'Ac'|'As'|'Ns'|'Sc'|'St'|'Cu'|'Cb';
type CloudLayer = {
  genus: CloudGenus; form: CloudForm; base: number; top: number;
  coverage: number; extinction: number; scale: number;
  windLevel: 'high'|'mid'|'low'; seed: number;
};
// Cloud height is terrain-relative or sea-level-relative by design, never mixed.
// WMO ranges guide authoring; each real layer can overrun its family's interval.
```

工程近似：`h = clamp((p.y-base)/(top-base),0,1)`；`verticalProfile(genus,h)` 控制每層上下界，`coverageMap(xz,genus)` 控制橫向分布，`formNoise(p,genus)` 控制組織形態；密度經小尺度侵蝕：
```text
advectedPosition = worldPosition - integratedWind(worldPosition.y, time)
baseDensity = max(0, verticalProfile(genus,h) *
                     coverageMask(xz,genus) *
                     shapeField(advectedPosition, genus))
density = extinction * max(0, baseDensity - erosionStrength * detailNoise(p))
```
上式是實用的**設計骨架，並非上游程式碼逐字複製**。實作時 `coverage` 與雲形閾值的關係須校準：雲量 80% 是整片天被遮蔽的比例，不等同 `density=0.8`；多種雲混合不能直接把所有 alpha 加起來當雲量。對大量重疊雲層，應以透射率 `T_total = ∏ T_i` 複合。

### 四套獨立形態演算法

1. **Filament（Ci）**：`fBM(x*0.3,z*1.8)` 等各向異性頻率、低頻 `domainWarp` 產生弧狀羽毛；以 `windDirection` 旋轉局部座標，再沿風向拉絲，叢集密度決定羽柄與細絲多寡。
2. **Granular（Cc／Ac／Sc）**：Cellular／Worley 或基於 fBM 的局部 blob；先形成大片不規則 patch，再以不同顆粒尺度切碎。Cc 小顆粒；Ac 中顆粒＋陰影；Sc 大而相連的 roll、大片孔洞。若近景過度規則，疊加 cell jitter 及低頻 domain warp。
3. **Stratiform（Cs／As／Ns／St）**：`smoothstep(thresholdLo,thresholdHi,fbm2(xz))` 控制橫向連續性；形態差異由高度、厚度、破裂率、局部侵蝕和光學深度控制。Cs 薄透明冰晶幕；As 太陽暈散成模糊光斑；Ns 厚且暗並接降雨；St 低矮近地面霧。
4. **Convective（Cu／Cb）**：位置在底部扁平、往上由寬到窄／多峰，使用三維 `Perlin-Worley`（或多球體 SDF 近似）塑形，再用細 3D 噪聲侵蝕。Cu 有清楚平底與鼓脹雲頂；Cb 要加入**有上升流方向的多塔、垂直深度、雨幕，以及達對流層頂後水平方向的 anvil**，其中 anvil 為平流帶走的冰晶絲狀雲，不可使用原本花椰菜噪聲延伸整個砧台。

## 4｜真正體積雲：相機射線與光照的最小可讀演算法

對進入雲層的像素，計算射線進出雲體包圍盒或球殼的 `tNear/tFar`；逐步採樣密度 `ρ(p)`，依 Beer–Lambert 定律累積透射和散射：

```glsl
// PSEUDOCODE — illustrative; assumes world-space cloud intersections,
// density sampling, phase and cloud lighting helpers already exist.
vec3 radiance = vec3(0.0);
float T = 1.0;
for (int i = 0; i < MAX_STEPS; ++i) {
  vec3 p = rayOrigin + rayDir * t;
  float rho = sampleCloudDensity(p);        // physical-ish, NOT alpha
  if (rho > 0.001) {
    float tau = rho * sigmaExtinction * stepLength;
    float segmentT = exp(-tau);
    vec3 source = sunColor * lightTransmittance(p, sunDir)
                * phaseHG(dot(rayDir, sunDir), g)
                + ambientCloudLight(p);
    radiance += T * (1.0 - segmentT) * source;
    T *= segmentT;
    if (T < 0.02) break;
  }
  t += stepLength;
}
vec3 color = radiance + T * backgroundColor;
```

- `T=exp(-σ_t∫ρ ds)` 表示穿過雲後剩下的光；`phaseHG` 是 Henyey–Greenstein 散射相函數的一種常見近似。實作時要確認相函數方向約定及 normalization，不把 `g` 或 `σ_t` 的美術值當物理量測常數。
- 陽光進入雲體時可用較少步的 light march 計算 `lightTransmittance`；另加天空環境光或近似多重散射，避免雲背面黑成石頭、薄雲邊緣過曝。
- 前後景、雨霧、太陽方向與相機前後積分的正確順序都重要；多個不同高度雲層的組合要按深度或透射率合成。
- 層狀雲只供 Skybox 遠景時用 projected 2D noise 會便宜得多；**只有必要的近場／厚積雲／積雨雲開 3D Raymarch**。玩家飛進雲時需內部能見度、深度與局部霧，不能只使用 skybox 雲幕。
- [Guerrilla Games／Horizon Zero Dawn 的 Nubis 技術簡報](https://www.guerrilla-games.com/read/the-real-time-volumetric-cloudscapes-of-horizon-zero-dawn) 是可借鑑的分層、噪聲與近似散射架構；其中約 2ms 是**作者當年目標／原環境敘述**，不是當代 WebGL2／Android 指標。

## 5｜產業既有架構：Unity HDRP 的 Cloud Map + LUT + Shaping/Erosion

[Unity HDRP 的 Volumetric Clouds 技術文件](https://docs.unity.cn/Packages/com.unity.render-pipelines.high-definition@17.0/manual/volumetric-clouds-volume-override-reference.html) 把體積雲分為三個資料源：

1. **Cloud Map（俯視 2D）**：R = coverage、G = rain/darkening、B = cloud type；控制位置、降水區域和雲類型。
2. **Cloud LUT（雲型高度 Profile）**：R = 隨高度的 density coverage、G = erosion/shaping、B = ambient occlusion。
3. **Cloud Volume**：真正 3D 密度占用空間。先以大尺度噪聲形成主體（shaping），再用小尺度噪聲侵蝕邊界（erosion）。

這可作為 JavaScript 渲染資料合約的範例：以地圖／高度／形態的分離，避免每個雲種各寫一份難維護的渲染器；但 Unity HDRP 的 Cloud Map channel 與 **Cloud Layer Skybox** 的 RGBA 雲圖不是同一格式，不能混用。Unity 的 `Sparse／Cloudy／Overcast／Storm` 是雲量／天氣預設，**不是 WMO 十種雲屬的完整命名集**。 

## 6｜風、雲影與天氣動態：同一狀態、多種物理反應

建議 `WeatherState` 持有各雲屬占比、風向／風速／陣風／垂直風切、濕度 proxy、降水、能見度、日照，並由 `CloudDirector` 決定哪些層啟用；**任一即時氣象 API 的 cloudCover 僅是雲量，不代表可以推定十種雲屬各占多少**。自動映射 genus mix 屬啟發式，應明確標示為視覺生成。

```ts
type CloudWeather = {
  clouds: Partial<Record<CloudGenus,number>>;
  totalCover: number; rainRate: number; convection: number;
  windByAltitude: (heightMeters:number,timeSeconds:number)=>[number,number];
  sunDirection: [number,number,number];
};
```

- **雲團平流**：`uv -= integral(windAtAltitude,dt)`，而非只讀 `wind * time`；避免風向變化時雲團瞬移。高空 Ci 與地表 Cu 可不同風速，但共用大尺度天氣狀態。
- **形變**：低頻 domain warp 和連續的時間噪聲緩慢改變塊團，降雨不只是透明度調暗。Cu 能垂直長高；Cb 過程是雲塔成長 → 平頂砧雲擴散 → 降雨／衰減。
- **地面雲影**：以 cloud density／light transmittance 沿太陽方向投影到地面和海面；低階可改用雲量光照遮罩，但必須標示它是藝術近似，不能讓它與可見雲逆向飄移。
- **光學現象**：Cs 的 22° 暈圈／幻日需要額外冰晶折射分布近似，不是每個 Cs 都出現。Cu／Cb 的背光銀邊依 phase、透光度與日照角度決定，不是沿所有 silhouette 畫固定白線。
- **天氣音訊**：對外發布 `windAt(player)`、`rainRate`、`stormDistance`，給草地、樹葉、海浪、海鷗和 Web Audio 聲景使用；由各子系統用不同平滑時間常數反應。

## 7｜Three.js 最可行的混合渲染方案與效率 Gate

| 品質 | 雲層與場景 | 必做驗證 |
| --- | --- | --- |
| Low（行動裝置預設） | 分層 2D/2.5D 程序天空／低解析 Skybox；Ci、Cc、Cs、Ac、As、St 為遠景；Cu／Cb 用便宜 silhouette 替代；雲影低頻更新 | 非 WebGPU 的 Android／WebGL2 能正常顯示，沒有 Skybox 動畫卡頓、上下層排序錯誤 |
| Balanced | 層雲及高雲保持 2D／2.5D；對近場 Cu／Sc 小範圍厚度與侵蝕做少量 Raymarch；低解析度雲影 | GPU pass 與 shader variant 不會拖慢主要場景；resize、device loss、頁面恢復可降級 |
| High（桌機 GPU） | Cu／Cb／厚 Ns 使用雲體積、低解析度 Raymarch、重投影／歷史過濾、光照積分；高雲維持絲狀薄層而非全量重體積 | 量測 GPU p50/p95、sampling noise、TAA 殘影、最大雲量、雷暴效果及長時間變天 |
| 超高品質研究 PoC | 雲形分類和氣象事件的跨層耦合、多重散射近似、陰影與高度風切、玩家穿越雲團 | 個別 genus 的 WMO 參考照片對照、真實裝置效能、場景畫質人工驗收 |

**按內容而非只按 FPS 驗收十種雲：** 需至少為 Ci／Cc／Cs／Ac／As／Ns／Sc／St／Cu／Cb 各建立「獨立雲型」視覺回歸場景，加 2–3 種高低雲混合、晴轉陰、雨停、積雨雲發育／崩解；用固定時間與種子擷取相同相機的上／下／逆光、地平線及近景對照。

### 程式品質與邊界

- 固定 seed、世界座標、投影平面、sun direction、wind integration 及視線空間，避開相機平移造成雲朵跳躍、uv precision 漂移與雲影錯位。
- 以 Weather Map / Cloud LUT 和 Genus Registry 區隔描述層及渲染器，避免十份 Shader fork。
- 體積 shader 要做：空間包圍求交、空區跳步、光學深度、低解析度、歷史重投影和 quality tier，並對 TAA 失效情況重置歷史。
- 若引用 Atmosphere MIT 程式碼，保留 Copyright/Licence，確認不與自有 Three.js renderer 重複擁有 WebGL context；不要將它的獨立 Canvas 渲染當成已與 3D 陽光／陰影整合。
- **未經實測不宣稱 WMO 物理準確、1–2ms、60FPS、任何手機相容、十種皆是真 3D 或音效已接上。**

## 8｜來源台帳（氣象定義 A；作者實作 A／作者性能主張 B；推導 C）

- [WMO 國際雲圖：十雲屬](https://cloudatlas.wmo.int/en/principles-of-cloud-classification-genera.html)、[高度與雲屬範圍](https://cloudatlas.wmo.int/en/clouds-definitions.html)、[辨識圖](https://cloudatlas.wmo.int/en/cloud-identification-guide.html) — A：官方氣象分類，WMO 2017；不代表視覺模型已達精確氣象模擬。
- [NOAA Ten Basic Clouds](https://www.noaa.gov/jetstream/clouds/ten-basic-clouds)、[香港天文台繁中雲類教育](https://www.weather.gov.hk/tc/education/weather/clouds/00099-the-classification-and-nomenclature-of-clouds-1.html) — A：十種外觀、雲底與高度的比對來源。
- [takustaqu／Atmosphere README](https://github.com/takustaqu/atmosphere)、[clouds.ts](https://github.com/takustaqu/atmosphere/blob/main/src/clouds.ts)、[sky.ts](https://github.com/takustaqu/atmosphere/blob/main/src/shaders/sky.ts)、[quality.ts](https://github.com/takustaqu/atmosphere/blob/main/src/quality.ts)、[LICENSE](https://github.com/takustaqu/atmosphere/blob/main/LICENSE) — A：真實 MIT 原始碼和 0.12.0 功能／形態規則；**本次未執行或 benchmark**。
- [Unity HDRP：Volumetric Clouds Override](https://docs.unity.cn/Packages/com.unity.render-pipelines.high-definition@17.0/manual/volumetric-clouds-volume-override-reference.html)、[Cloud Layer vs Volume](https://docs.unity.cn/Packages/com.unity.render-pipelines.high-definition@17.0/manual/understand-clouds.html) — A：CloudMap/LUT、shaping/erosion 與分層策略；**Unity 技法，不表示已有可直接使用的 Three.js 程式碼**。
- [Guerrilla Games Horizon Zero Dawn Cloudscapes](https://www.guerrilla-games.com/read/the-real-time-volumetric-cloudscapes-of-horizon-zero-dawn)、[Three.js WebGPU 雲體示範](https://threejs.org/examples/webgpu_volume_cloud.html)、[WebGL 雲體示範](https://threejs.org/examples/webgl_volume_cloud.html) — A：真實技術公開說明與官方示範；性能目標及演算法均未獨立本機驗證。
- 四類 morphology、密度式、跨層 WeatherState、光學與渲染 tier、驗收測試設計 — C：本文推導之工程方案；**NOT RUN**。


## 9｜原始碼深讀：形狀錯誤、抗鋸齒與雲影邊界（0.12.0）

本節依上游 **`01223085dc0bb6a0ab3def2c303b54ff8d5b4c38`** 的實際 `src/clouds.ts`、`src/shaders/sky.ts`、`src/quality.ts`、`src/features.ts`、`src/renderer.ts` 查核。屬於**程式碼靜態閱讀**，不代表已在任何裝置執行或認可視覺效果。函式名、變數與行號指向**固定 commit**；分支 `main` 可能改變。

### 9.1｜兩種可重現的失敗模式與根因

| 失敗現象 | 上游註解及程式碼能確認的原因 | 通用修正原則 |
| --- | --- | --- |
| **放射狀「窗簾」或手指狀雲條** | `cuField` 上方註解指出：單純把一張連續 noise field 依單閾值裁切，會出現蜿蜒片層、狹長條紋與藍天通道；接近地平線後，平面透視將它們拉向消失點。僅將上、下兩個截面各畫一次，也會成為兩張位移後的雲影輪廓。 | 以**分立的單雲塊 envelope** 混入連續形態場，並在單一輪廓／有限厚度 slab 內合成，避免把兩片相似 alpha 直接疊起。 |
| **魚鱗雲變方格、編織或壁紙** | `granular` 註解指出規律格點產生壁紙感、混合太多 fBM 倍頻會改變顆粒尺度；`flocks` 註解指出窄閾值的單格線可顯露方形鋸齒織紋。 | 以**接近單尺度的顆粒**控制統計形狀，再由低頻 patch 控制分布；對需要細顆粒的 Cc／Ac，混合**不同角度**的雜訊採樣與次級細節，不以固定格點本身作為可見顆粒邊界。 |

這些是**作者在註解中明確描述的設計問題**，不是本研究用截圖獨立重現的缺陷。即使採用同一方法，實際效果仍需檢查地平線、相機 FOV、顆粒頻率和像素 footprint。

### 9.2｜各函式的實際責任與可遷移演算法

| 原始函式與固定來源 | 經確認的工作原理 | 容易誤述的地方 |
| --- | --- | --- |
| [`cloudField`：sky.ts L845–881](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L845-L881) | 先用受 `u_evo` 驅動的 2D domain warp 移動座標，再合成大尺度與細節 `fBM`；以 threshold／ramp 得 alpha；對不可能超過閾值的區域提早退出，避免無用雜訊讀取。 | 這是天空方向投影的**雲形與明暗近似**，不是整片天空的 3D 光學模擬。 |
| [`cuLump`／`cuField`：L928–988](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L928-L988) | `cuLump` 用粗尺度、單個雜訊 octave 和柔化閾值產生**分立雲塊**；`cuField` 將它與 warped `fBM` 場混合，常數 `CU_ENV=0.45`（約 45% 權重給 lump，**不是恰好一半**）。雲心的細節強度降低，避免挖出不自然藍洞。 | 分立雲塊與場在**同一扭曲座標**求值；若各自使用不同 warp，輪廓易分離。 |
| [積雲主組裝：L6335–6391](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L6335-L6391) | 對雲底與雲頂兩個高度平面計算雲形，並沿相機射線在 **4 個相對高度（含兩端）** 評估形狀；以隨高度收窄的 dome 關係統一輪廓和陰影。這種 **2.5D slab／view-dependent 近似**使底部較平、頂部有圓拱。 | 積雲**不只是普通平面貼圖，也不是完整的 3D volume Raymarch**；不能把四次高度估計寫成完整 3D 物理密度積分。 |
| [`stratiform`：L2401–2423](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L2401-L2423) | 低頻連續 `fBM`，按 `breakup` 打洞、按 `turb` 加 warp 和煙霧表面；回傳 coverage 與 thickness，服務 Cs／As／Ns／St 各種厚薄片雲。 | 不應替所有層雲套用同一厚度和透明度。 |
| [`granular`：L2425–2471](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L2425-L2471) | 使用較集中的顆粒尺度、窄 `smoothstep` 閾值、弱高頻侵蝕和大尺度 `patch`；朝太陽方向偏移再採樣以估計顆粒亮暗，特別服務較大的 **Sc／roll** 雲塊。 | 這個函式**並沒有直接使用兩組旋轉約 60° 的格線**；那是 `flocks` 的另一組技法。 |
| [`flocks`：L2473–2566](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L2473-L2566) | 用低頻 `T` 決定「羊群」聚集區；向邊界逐漸提高顆粒門檻，使顆粒**變小、分開、透明**而非裁成固定邊界。使用兩組不同旋轉方向的雜訊樣本（作者註解稱相隔約 60°）加較細一層來打破格線。主要用於 **Cc／Ac**。 | `flocks` 的門檻與 alpha 漸變**故意比 `granular` 寬**，兩者不能簡單合併成同一個窄閾值公式。 |
| [`filament`：L2568–2586](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L2568-L2586) | 各向異性 fBM 拉成細絲，低頻扭曲造成彎曲；再以較粗 noise 形成密集的「羽柄／結點」，在下風側延伸稀疏尾絲，以 `head`／`tail` 分開控制。 | 不是只把一張 Perlin 圖拉長；卷雲的稀疏空隙與尾端密度是主要辨識特徵。 |

### 9.3｜便宜的立體明暗，不必等於完整光線追蹤

`cloudField` 在 **L875–880** 先求雲密度，再以 `q + lightDirection * 0.16` 重新求鄰近的密度，計算 `clamp((dcomb-dl)*2.5,-1,1)` 作為明暗方向。
`granular` 在 **L2462–2470** 用沿光向的鄰近噪聲差求 `lit`；`flocks` 的採樣在 **L2561–2565**，`cuField` 還會連同 lump 斜率一起使用。

**正確描述是「額外做一次沿光照方向的局部場估計」；不保證 GPU 只增加一個 texture fetch。** `fBM` 往往由多個 octave／採樣組成，實際耗時要以 Shader 編譯器和 GPU 計時確認。此法提供立體感的**高度場式視覺線索**，無法取代真正的透射積分、多重散射或雲內陰影。

### 9.4｜抗閃爍與精度：地平線是特殊情況

- [`planeUV`／`planeFoot`：L2389–2399](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L2389-L2399) 依視線和平面高度計算投影及每個像素在雲平面上的 footprint；越接近地平線，同一像素涵蓋的地面／雲面範圍越大。
- [`flocks`：L2513–2552](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L2513-L2552) 用 footprint 改變 `hc`、`h0`、`h1`，把超過像素可分辨尺度的高頻樣本**收斂至平均值 0.5**，同時放寬遮罩過渡，避免遠處雲粒閃爍。
- [`vnoiseHQ`：L884–916](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L884-L916) 為**另一個**與 footprint 不同的精度問題：作者發現 GPU 內建雙線性插值的有限精度，讓積雨雲輪廓與動畫逐格跳動；改為同次讀出四角格點，再用 shader 的高精度插值。不是每種雲都一定需要這條高成本路徑。
- 高度 0 附近的近水平射線需限制分母及最大投影距離，並量測視角變化、畫面縮放、手機 GPU 的 precision 與 temporal stability；不要以「關掉細節」掩蓋過度平滑或輪廓消失。

### 9.5｜共用光照、日暈與海面雲影：驗證到哪個邊界？

- [`cloudLight`／`cloudColor`：L2708–2742、L2790–2830](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L2708-L2742)：`cloudLight` 同時輸出 ambient、sun、shade、pink afterglow、moon 與 overcast diffuse；高雲可在太陽落到地平線下方後仍照到日光，低雲較早變灰。厚度決定暗面顏色而不是固定一層陰影貼圖。
- [`iceHalo`：L701–728](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L701-L728)：卷層雲冰晶日暈以 `sunAng - 0.379` **弧度**為主要角度差（約 **21.7°**），`smoothstep` 控制內側略紅的銳利邊緣，`exp` 處理外側衰退；亮度還乘以卷層雲薄幕的空間分布，**不代表每片 Cs 都一定有日暈**。
- [海面 `cloud shadows`：L6974–7018](https://github.com/takustaqu/atmosphere/blob/01223085dc0bb6a0ab3def2c303b54ff8d5b4c38/src/shaders/sky.ts#L6974-L7018)：作者從**海面位置向太陽方向回投至低雲平面**，對積雲 `cloudField` 與層積雲 `granular` 求遮光，再減弱水面陽光／反射的直射貢獻。**這是內建海水著色部分，不是可直接掛到任意 3D 地形、山地、屋頂的雲影圖。**
- 另外要注意：海面雲影在部分條件用 `cloudField`，而近景積雲可見形狀透過 `cuField/cuLump` 生成。若用於需要高精度同形雲影的場景，必須進一步建立**同一 canonical density／mask** 的天空和陰影讀取流程，不能無條件宣稱原海面雲影與所有可見雲輪廓完全一一重合。

### 9.6｜抽象成通用、可測試的移植契約

```ts
interface CloudSample {
  opacity: number;       // [0,1], silhouette/visibility
  thickness: number;     // [0,1], stylized optical depth proxy
  sunFacing: number;     // [-1,1], local directional-light estimate
}
interface CloudShapeModel {
  sample(viewRay: [number,number,number], weatherTime: number): CloudSample;
  sampleSunOcclusion(worldXZ: [number,number], sunDir: [number,number,number]): number;
}
// The second method must share canonical cloud coordinates and weather clock
// with the first. It is a *design requirement*, not an Atmosphere API.
```

**移植策略：** 把「分離雲塊 vs 連續紋理」「不同角度細顆粒 vs 方格」「方向差分明暗」「像素 footprint 濾波」「光照統一調色」「共用雲密度投影雲影」拆成**彼此獨立、可 A/B 量測的原理**；先以低成本天空層建立十雲屬辨識和檢查品質，再以真正體積 Renderer 補足近景厚積雲、雲內穿越與三維陰影。禁止把一份原始碼的近似效果當作 WMO 物理正確或跨 GPU 效能保證。

**建議測試矩陣（NOT RUN）：** 天頂／中仰角／地平線、廣角／窄 FOV、單 Ci／Cc／Ac／Sc／Cu／Cb、晴天／日落／陰天、靜風／風向反轉、不同解析度／Device Pixel Ratio；以固定 seed 比較 silhouette、顆粒形狀、雲頂陰影、遠距 temporal flicker、額外 noise taps、透射率／雲影空間同步和 GPU frame p95。每項記錄參考圖片權利與裝置配置；無實際畫面不得標為 PASS。


## 結論

最佳設計不是為十種雲各做十套獨立光照和渲染器，而是**十種雲的形態／光學參數 Registry + 四種密度家族 + 高／中／低層 Weather Field + 遠景 Sky Layers／近景 Volumetric Raymarch 的混合系統**。Atmosphere 0.12.0 提供可讀的十雲屬實作起點；Nubis／Unity HDRP 補足真正可穿越體積與雲影的架構，兩者應先以相同場景測試，再決定複用原始碼或獨立實作。
