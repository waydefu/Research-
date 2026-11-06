# UI 字體排版六原則：行高、行長、層級與繁體中文可讀性

**研究日期／來源最後核對：2026-11-06（Asia/Taipei）**  
**分類：UI/UX／字體排版／資訊層級／無障礙／CJK 排版**  
**證據範圍：** 六原則的整理靈感來自使用者提供的「Do's and Don'ts of UI typography」資訊圖；沒有取得或確認該圖的原作者與可轉載授權，**不將原圖複製到公開程式庫**。另用 W3C WAI、USWDS、MDN 與政府可及性指南校對相容性和例外。

## 1｜六個規則不是一張通用數字表

| 原則 | 可用的起點 | 常見反例 | 必須留意的邊界 |
| --- | --- | --- | --- |
| 1. 行高（line height） | 正文可先測試 1.5–1.7 的無單位行高 | 行距太緊導致錯行 | 不同字型及 CJK 字面框不同；W3C 的 1.5 是**允許使用者放大間距時仍不丟失內容**的測試條件，不代表所有介面預設一律 1.5 |
| 2. 行長（measure） | 英文長文參考 45–75 或 USWDS 45–90 字元；繁中以約 25–40 全形字做排版測試 | 英文超長行難找到下一行 | CJK 不可直接套用英文同字數；W3C 對視覺呈現提出 80 字元（CJK 40 字）的上限建議 |
| 3. 資訊層級 | 標題／摘要／正文用字級、字重與空間明確分層 | 全文差不多大、全靠顏色 | 內容層級還應有語意化 H1–H6，不能只改 CSS 外觀 |
| 4. 全大寫 | 英文全大寫限定短標籤 | 長段 ALL CAPS 增加掃讀負擔 | 繁體中文沒有拉丁字母大小寫；需以文字長度、間距、字重及可讀性處理 |
| 5. 字體數量 | 1–2 個互補字族作起點，以字重與軸變化建立層級 | 同頁混搭許多無規則字體 | 這是設計建議，不是 WCAG 強制條件；中、英、數字常需 fallback |
| 6. 大標字距 | 大型英文標題可適度緊縮，改善視覺凝聚 | 小尺寸正文被過度壓縮 | 中文標點／不同字型可讀性不同；**不得阻止使用者自訂字距** |

## 2｜可及性規範與視覺美感要分開

[W3C WCAG 2.2 Understanding 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing) 要求使用者把行高設定到 1.5、段後距 2、字距 0.12、詞距 0.16 倍字體大小時，仍能保留內容與功能。這是 **reflow 和文字間距相容性測試**，不是所有設計必須預設這四個數值。

[MDN line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/line-height) 建議正文使用無單位行高，避免繼承時發生預期外的縮放；長文可先以 1.5 作基準測試。

[美國政府 USWDS Typography](https://designsystem.digital.gov/components/typography/) 建議長篇英文常以約 66 字元／行為舒適目標，並指出行長會與行高互相影響；這是**英文閱讀情境的設計起點**，不宜直接換成每行 66 個漢字。

[W3C WCAG 視覺呈現說明](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation) 指出 CJK 字形通常較寬，與拉丁文字的行長建議不能直接等比。實際產品應依繁體中文標點、混排、閱讀距離、裝置寬度測試。

## 3｜實用排版審查方法

1. **內容測試：** 用真正的繁體中文文章、英文縮寫、數字、連結、程式碼與表格，觀察自動換行、孤行與標點懸掛問題；不要只用展示用英文字母。
2. **裝置：** 比較 320／360／393／768／1440px，檢查字級階層、漢字截斷、縮放到 200%、橫向溢出、主內容被特效遮住；實際裝置仍須另外驗收。
3. **動效：** 動態字體只應增強標題或互動提示，保留可被選取、索引及輔助科技閱讀的靜態語意文本；尊重 prefers-reduced-motion。
4. **無障礙：** 覆寫文字間距與行高，測試按鈕、表單、標籤及彈窗沒有裁切；不要把 WCAG 門檻簡化成單一字體或黃金比例。
5. **權利：** 核對每個字型檔的 LICENSE、來源、子集和載入策略，避免把單張 infographic 的排版提案視為專業規範全文授權。

## 4｜選型與限制

可由一種繁體中文黑體作正文、一種明體作少量展示標題，以字重、行高、版面空間與對比建立層級；這只是**設計實驗候選**，不是為所有網站固定 Noto 字族或指定像素值。長篇文字、技術文章、手機閱讀、動態網頁的合理字距與行高可能不同。

**未完成的驗證：** 沒有對任何實際網站跑 CSS 覆寫、Lighthouse、axe、螢幕閱讀器、使用者閱讀研究或手機真機字體顯示測試；更沒有確認使用者截圖在 Reddit 上的原作者身份。不得把此篇寫成已經通過 WCAG 或完成美術驗收。

## 來源台帳

- 使用者提供「Do's and Don'ts of UI typography」圖片 — B：使用者提供的六項排版例子，**原作者／授權未知，未複製圖像**。
- [W3C WCAG 2.2 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing) — A：官方成功準則解釋。
- [W3C Visual Presentation](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation) — A：官方字元行長與 CJK 關係的說明。
- [USWDS Typography](https://designsystem.digital.gov/components/typography/) — A：美國政府設計系統的閱讀與行距建議。
- [MDN line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/line-height) — A：CSS 屬性與可及性使用指引。
- 整合建議與 25–40 字 CJK 起始測試範圍 — C：本文設計推導，不是獨立行為研究。
