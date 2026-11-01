# 07｜AURORA 空間音訊：DSP 工具研究與測試設計

**十月來源：** `waydefu/MUSIC` 的 AURORA 技術討論、50+ 開源技術研究要求、純程式驗證與失真議題。  
**判定：工程研究與候選工具目錄，不宣稱這些技術已全部整合。**

## 真正的目標

1. 在立體聲輸入下產生有辨識度的聲場／空間感，**不能只靠增益或簡單延遲就宣稱 3D**。
2. 控制 48 kHz／低延遲處理時的峰值、相位、CPU、失真和聆聽可接受度。
3. 依序建立可重現 baseline、客觀量測和盲聽評估，避免只因好聽就判定無失真。
4. **未持有真實設備量測，不代表不能寫單元測試；但純程式不能推論真實耳機上的主觀音場**。

## 研究價值最高的工具族群

| 類別 | 專案／來源 | 作用與注意 |
| --- | --- | --- |
| HRTF / SOFA | [libmysofa](https://github.com/hoene/libmysofa) | SOFA HRTF 的載入、查詢與處理；需核對取樣率與內插 |
| 空間聲學 | [Steam Audio](https://github.com/ValveSoftware/steam-audio) | HRTF／空間化／環境聲學；整合與授權另查 |
| 聲學研究 | [pyroomacoustics](https://github.com/LCAV/pyroomacoustics) | 模擬房間脈衝響應；非即時引擎開箱即用 |
| 聲學／測試 | [pyfar](https://github.com/pyfar/pyfar) | 音訊測量、濾波與空間資料處理 |
| 響度 | [libebur128](https://github.com/jiixyj/libebur128) | EBU R128 響度分析 |
| 響度 | [pyloudnorm](https://github.com/csteinmetz1/pyloudnorm) | Python LUFS 分析，可當自動回歸指標 |
| Audio DSP | [PFFFT](https://bitbucket.org/jpommier/pffft/) | FFT 加速候選；需要實測平台收益 |
| Audio DSP | [CamillaDSP](https://github.com/HEnquist/camilladsp) | 即時 DSP pipeline 與濾波設計參考 |
| 品質比較 | [ViSQOL](https://github.com/google/visqol) | 客觀音質評估參考；不等於完整主觀聽感 |
| 性能量測 | [pytest-benchmark](https://github.com/ionelmc/pytest-benchmark) | 可追蹤處理延遲與回歸 |

其他十月研究線索：SPARTA、Spatial Audio Framework、sofar、slab、OpenAL Soft、MoSQITo、Signalsmith DSP、FFTConvolver、pyperf、py-spy、Hypothesis 等；逐一使用前需再查版本、平台及授權。

## 應先建立的可重現測試

| 層次 | 輸入 | 指標 | 不可誤解 |
| --- | --- | --- | --- |
| 基本信號 | 1 kHz 正弦、chirp、白噪、脈衝 | RMS、Peak、THD+N、LUFS | 單頻通過不能證明音質好 |
| 立體聲 | L/R 相同與反相訊號 | 相關係數、相位、Mono 兼容性 | 擴張音場可能犧牲單聲道相容 |
| HRTF | 多角度、不同 SOFA 資料 | 時延、頻響、峰值、聲像穩定 | 資料來源會改變結果 |
| 即時處理 | 持續串流、多緩衝尺寸 | P50/P95/P99、underrun、CPU | 平均 60 ms 並非即時可靠性 |
| 音量放大 | 低／高增益、不同頻段 | true peak、clip count、失真 | 100% UI 音量沒有通用失真定義 |

## 對當時「100% 開啟有失真」的正確解讀

不能直接判定「正常」。可能是輸出 clipping、過度增益、HRTF FIR 頻響過衝、相位／混音、裝置路徑、float→int 轉換或播放器限制。必須紀錄輸入峰值、增益、輸出 true peak、訊號路徑與量測音檔再定位。

### 原始來源

- [MUSIC／AURORA 專案](https://github.com/waydefu/MUSIC)
- [Steam Audio](https://github.com/ValveSoftware/steam-audio)
- [libmysofa](https://github.com/hoene/libmysofa)
- [pyroomacoustics](https://github.com/LCAV/pyroomacoustics)
- [ViSQOL](https://github.com/google/visqol)
