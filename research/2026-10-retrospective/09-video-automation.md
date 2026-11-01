# 09｜AI 影片生成與自動化：OpenFilm、Remotion、FFmpeg

**研究背景：** 十月的主要目標是 **初期 NT$0、以字幕＋圖片的 2–3 分鐘科普影片試作、之後盡量自動化 YouTube 頻道**。不要把「能自動上傳」誤當成「能自動穩定營利」。

## 高價值工具對比

| 工具 | 主要能力 | 最佳用途 | 限制 |
| --- | --- | --- | --- |
| [OpenFilm](https://github.com/openfilm/openfilm) | Coding Agent 生成 web-based 影片，Studio 可視編輯 | 用 HTML/CSS/SVG/GSAP 快速生成影片鏡頭 | 需執行器與渲染流程；其他生成服務可能收費 |
| [Remotion](https://github.com/remotion-dev/remotion) | React 組件、frame-accurate 動畫、程式化渲染 | 內容模板化、批次影片、字幕卡 | 要熟悉 React；**商業授權依實際主體與使用情境核對** |
| [FFmpeg](https://ffmpeg.org/) | 音視訊編碼、裁剪、合成、轉檔 | 最終 MP4、字幕與音量處理 | 指令不會自動保證內容正確 |
| [Whisper](https://github.com/openai/whisper) | 語音辨識 | 有旁白時產生草稿字幕 | 無旁白不必強制使用 |
| [n8n](https://n8n.io/) | 工作流與觸發、自動執行 | 程式串流上傳和資料轉換 | 部署、憑證與執行成本 |
| [YouTube Data API](https://developers.google.com/youtube/v3) | 頻道影片操作 | 有人工審核的排程／上傳 | 配額、OAuth、政策與 API 限制 |

另曾比較 Veo、Kling、Runway、Hailuo、Wan 等影片生成服務；因價格、限制變動很快，只列候選，不把舊價當最新報價。

## 適合 NT$0 起步的初版

1. **研究來源**：挑科普主題，例如電池壽命、充電迷思，先寫帶可核對來源的腳本。
2. **分鏡設計**：每鏡 5–15 秒；字幕易讀、避免滿版長段落。
3. **模板合成**：使用自有／授權圖片和 SVG／CSS 動畫；OpenFilm 或 Remotion 擇一實測。
4. **輸出**：FFmpeg 編碼，檢查影片長度、文字切邊、音樂授權與音量。
5. **人工品質閘門**：核對科普內容、素材、事實與縮圖；核准之後才上傳。
6. **回看效果**：觀看維持率、點閱率、重複製作成本，而不是空談被動收入。

## 決策界線

- 不得使用未授權第三方影片／音樂，只因為有模板就當成可商用。
- AI 量產與重複內容可能不符合平台變現政策；每次實際發布前核對官方規則。
- 內容可信度優先：錯誤科普即使觀看量高也不是穩定商業模式。
- 完整自動化需另設外部服務、排程與登入權限，本研究未替使用者建立或開啟。

### 來源

- [OpenFilm](https://github.com/openfilm/openfilm)
- [Remotion 授權](https://www.remotion.dev/license)
- [FFmpeg](https://ffmpeg.org/)
- [YouTube API](https://developers.google.com/youtube/v3)
- [YouTube 頻道營利政策](https://support.google.com/youtube/answer/1311392)
