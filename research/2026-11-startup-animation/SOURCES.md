# 開機動畫研究：原始碼、樣本與權利來源索引

最後核對：2026-11-11（Asia/Taipei）。每一項均為當時版本快照；GitHub 的開源託管不等於可自由使用所有媒體、角色、音效、字型。

| 來源 | 本次核對版本 | 可支持的主張 | 不能支持的主張 |
| --- | --- | --- | --- |
| [dsh-boot-animation](https://github.com/lxj5820/dsh-boot-animation) | `6c2ef4b1d5ca4b791323d247fea5b7f6e272cc71` | `entry.js`、`src/boot-screen.js`、`src/renderers.js`、`src/screensaver.js` 與 LICENSE | Android OS 可直接執行／所有影片可商用 |
| [dsh-550c-boot](https://github.com/yannicksong0106/dsh-550c-boot) | `df7d202f62088897f476961ef87f408fb525b1ac` | `src/show.js`、`src/client.js`、`lib/index.js`、`docs/ARCHITECTURE.md`、`CREDITS.md` | 所有宿主／所有機器的首幀毫秒相同 |
| [HALOFLUX](https://github.com/Ryder191/haloflux) | `02174503d0f391b1bb2537b8cad75e8e5f9997f2` | `lab.html`、`mobile.html`、`README.md`、`LICENSE` | 手機 FPS、商用授權 |
| [Codex Dragon 社群 R16](https://github.com/HanwenZhang-George/codex-startup-animation/releases/tag/community-v34-r5) | tag `community-v34-r5`，實際版本 `34.16.0.0` | `FilmSplashV2.cs`、`PulseReveal.cs`、`CinematicScene.cs`、`renderer.js`、`VERIFICATION.txt`、`SOURCE-PROVENANCE.txt` | 已逐幀解碼六部 Release MP4 或保證 Windows 相容 |
| [AOSP bootanimation FORMAT](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/cmds/bootanimation/FORMAT.md) | refs/heads/main，於本次研究引用 | 通用 Android 開機動畫格式與封裝方法 | POCO／HyperOS 特定覆寫權限、ROM 政策 |

## 權利限制

- **dsh-boot-animation：**[LICENSE](https://github.com/lxj5820/dsh-boot-animation/blob/6c2ef4b1d5ca4b791323d247fea5b7f6e272cc71/LICENSE) 的 MIT 只涵蓋軟體及文件，`assets/videos/` 和 `assets/screensaver/` 自製媒體另有非商用及再散布限制。
- **dsh-550c-boot：**[LICENSE](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/LICENSE) 標示 MIT；[CREDITS](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/CREDITS.md) 另列 Voidpocket 片頭原稿及原創範圍，不可將第三方形象視為可再授權。
- **HALOFLUX：**[LICENSE](https://github.com/Ryder191/haloflux/blob/02174503d0f391b1bb2537b8cad75e8e5f9997f2/LICENSE) 為 PolyForm Noncommercial 1.0.0，作者依條款要求改作、公開錄影或截圖保留來源，禁止商業使用。附帶音樂獨立標 CC0。
- **Codex Dragon：**[SOURCE-PROVENANCE](https://github.com/HanwenZhang-George/codex-startup-animation/blob/community-v34-r5/community-v34/SOURCE-PROVENANCE.txt) 表示上游程式碼及媒體權利尚未完整釐清；字型另按其字型授權。社群非 OpenAI 官方產品。

## 影片量測與來源狀態

四部私人上傳影片以 FFmpeg 進行程式化逐幀統計，影格計數和轉場位置記錄在 [06](06-android-bootanimation-and-video-analysis.md)。原始影片、受保護影格、聯合剪輯與 CSV 個別未複製進公開研究庫；如需獨立重現需合法取得原本樣本並紀錄 hash、ffprobe stream 資訊和抽幀方法。Codex R16 的六部 MP4 僅通過原始碼 manifest 的**檔名與作者提供 hash**核對，非本次 decode。

上游作者自述、靜態碼審查、影片統計與設計建議已在各篇明確區分；需要採用前重新進行原站授權查核與實機驗證。
