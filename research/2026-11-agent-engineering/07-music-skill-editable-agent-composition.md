# music-skill：AI Agent 逐音符編曲、離線渲染與可編輯配樂產線

**來源最後核對：2026-11-06（Asia/Taipei）**  
**分類：Agent Skills／可編輯配樂／離線音訊渲染／影片與遊戲音樂**  
**狀態：** 已閱讀官方 README 與 music-production SKILL.md；本次**沒有安裝套件、下載音源、執行合成、聆聽音檔或獨立驗證音質**。

## 1｜這不是文字轉音訊生成模型

[owoevan-dev/music-skill](https://github.com/owoevan-dev/music-skill) 是以 Agent Skills 工作流程驅動的**逐音符作曲與音樂製作工具**。Agent 將音高、節奏、力度、表演偏差與混音參數寫入專案資料；工具鏈檢查樂譜，用採樣樂器及合成器合成聲音，再混音、母帶處理、量測與匯出。

這與直接輸出 waveform 的文字轉音樂模型不同：可定位到小節、音符、樂器與分軌進行修改。**可編輯／可重複渲染不等於保證旋律、編曲或音色符合專業音樂品質。**

## 2｜可由上游程式文件支持的功能

| 階段 | 作者提供的流程 | 證據限制 |
| --- | --- | --- |
| 作曲與編曲 | Agent 寫旋律、和聲、樂器聲部與曲式至 JSON／生成 Python 腳本 | Agent 是否寫得好需要人工聆聽 |
| 樂譜檢查 | validate、review、profile 檢查結構與和聲衝突 | 數學異常不等於音樂錯誤 |
| 人性化表演 | per-part timing、velocity、swing、legato、pitch bends | 上游模型與演奏真實感未盲測 |
| 樂器渲染 | FluidSynth、SoundFont、內建 synth／drum、可選 Surge XT | 免費採樣音源品質／授權／覆蓋不一致 |
| 混音與母帶 | bus mixing、reverb、limiter、響度／頻譜／立體聲分析 | LUFS／峰值達標不代表好聽 |
| 交付 | WAV、FLAC、MP3、MIDI、stems、工程檔；遊戲 loop WAV／Ogg | 依實際配置、外部執行工具及格式驗證 |

[官方 SKILL.md](https://github.com/owoevan-dev/music-skill/blob/main/skills/music-production/SKILL.md) 列明最多 30 分鐘、64 聲部等工具設計限制，且明確要求人類聽完整首作品。官方示例有交響樂、house、爵士、synthwave、lo-fi、chiptune 等，但這些都是**作者自製展示**，非公開盲測品質排名。

## 3｜安裝與使用路線（只記錄指令，未執行）

上游 README 的 Claude Code 安裝順序是先透過插件市集加入 owoevan-dev/music-skill，再安裝 music-skill@music-skill；Codex 與其他 Agent Skills 工具可使用 npx skills add owoevan-dev/music-skill。執行端需要 Python 3.10+、NumPy、FluidSynth、FFmpeg、SoundFont；Surge XT 選用。

作者目前列出約 **3.4 GB 音色庫下載量、安裝後約 8 GB**，並建議預留約 12 GB 包含來源包；這是**上游文件的估值**，不是本次測量。官方記載工具以 CPU 離線渲染，不需要 GPU 或音訊生成模型；初次安裝需要網路下載，取得的執行檔和音色庫需固定版本與雜湊。

建議先在隔離環境跑 doctor、selfcheck，再用 20–60 秒的原創短片背景配樂做 PoC，輸出可編輯 MIDI、分軌與母帶。全程保留創作 brief、score JSON、版本號、來源授權和人工聆聽紀錄；**不要因文件列出安裝命令而自動執行。**

## 4｜適用／不適用情境與可驗證指標

**適用候選：** 遊戲迴圈 BGM、影片需要按秒或場景轉折對齊的背景音樂、無人聲的片頭／過場、需要編曲逐音修改的製作流程。

**不適合：** 必須即時產生人聲、逼真流行演唱、直接重建受版權保護歌曲、依賴自訂 VST3 鏈、追求不須審聽便能發布的流程。

試驗設計：固定 45 秒曲目，提交同一份 brief，對照 Agent 寫譜時間、合成時間、第一次可用率、改一個小節的返工成本、音源標註完整性、循環接點爆音，以及不同裝置的播放相容性。音質要用人工盲聽，不可把 loudness、frequency spectrum 或作者提供的 examples 當作作品已合格的替代證據。

## 5｜安全、授權與權利界線

[上游 LICENSE](https://github.com/owoevan-dev/music-skill/blob/main/LICENSE) 宣稱主要程式碼及文件 MIT；獨立的 Surge XT host 採 GPL-3.0-or-later，其餘音色庫保留原作者授權。作者文件列部分音色庫 CC0、Iowa 樣本免費使用、MuseScore MS Basic MIT 並建議確認致謝。**MIT 主專案不保證整條採樣／合成鏈及任何輸入樂曲都無著作權風險。**

按 [THIRD_PARTY.md](https://github.com/owoevan-dev/music-skill/blob/main/THIRD_PARTY.md) 與 [PRIVACY.md](https://github.com/owoevan-dev/music-skill/blob/main/PRIVACY.md) 核查每個部署版本的外部工具、下載來源與資料處理。曲目由 Agent 寫成時，聲音產出及著作權地位仍依人工創作程度、資料來源、使用地區與用途分別判定；不作全面可商用保證。

## 6｜採用結論

**建議收錄為 Agent 音樂製作流程候選，暫不直接安裝到正式影片／遊戲產線。** 技術優點是逐音符可修訂、分軌、離線渲染及時間軸精準控制；主要風險是作曲品質、音色庫覆蓋、第三方權利、CPU 與記憶體成本。

**未驗證：** 作者示例是否具專業品質、OS 套件相容性、標準音色能否足夠表達複雜編制、首次安裝成功率、真實音量一致性與授權法務；沒有在任何其他 repository 啟用。

## 來源台帳

- [官方 README 與範例](https://github.com/owoevan-dev/music-skill) — A：作者功能及安裝自述。
- [music-production SKILL.md](https://github.com/owoevan-dev/music-skill/blob/main/skills/music-production/SKILL.md) — A：工作流、限制、產物定義。
- [Setup 指引](https://github.com/owoevan-dev/music-skill/blob/main/skills/music-production/references/setup.md) — A：作者的跨 OS 安裝流程。
- [THIRD_PARTY.md](https://github.com/owoevan-dev/music-skill/blob/main/THIRD_PARTY.md)、[LICENSE](https://github.com/owoevan-dev/music-skill/blob/main/LICENSE) — A：作者列示的工具及授權範圍，非獨立法律意見。
- [PRIVACY.md](https://github.com/owoevan-dev/music-skill/blob/main/PRIVACY.md) — A：作者資料傳輸宣稱，未監測網路封包。
- [原創示例 Releases](https://github.com/owoevan-dev/music-skill/releases/tag/examples-1) — A：作者示範；尚未人工聆聽。
- 評估設計及採用順序 — C：本文工程建議，**NOT RUN**。
