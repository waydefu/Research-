# 03｜Imagine — Visual Creation Suite / Claude Custom Visuals

**查證狀態：** Anthropic 的 Custom Visuals 產品功能已證實；使用者截圖中的「Imagine — Visual Creation Suite」詳細模組規範來自一份公開轉載的工具說明，**不能因此推論它是公開、可獨立安裝的官方插件**。

## 1. 兩個層次必須分開

- **產品層（官方）：** Anthropic 官方介紹 Claude 能在對話中建造 SVG、HTML 圖表、流程圖與互動視覺元件，功能在 Claude web／desktop 的聊天及 Cowork 中提供（以官方當前公告為準）。
- **模組規範層（截圖）：** 標題為 `Imagine — Visual Creation Suite` 的說明列出五個模組、配色、間距、字數與 CSS token。它類似工具內部的設計約束；不等於一套具有單獨下載／安裝步驟的通用前端框架。

## 2. 截圖五模組

| 模組 | 設計用途 | 可以借用到一般 Web 嗎 |
| --- | --- | --- |
| `diagram` | SVG 流程圖、結構圖、說明性示意 | 是，概念可借用 |
| `mockup` | UI 模型、表單、卡片、儀表板 | 是，但需重建前端 |
| `interactive` | 可操作的解說器、控制項 | 是，需實作互動與狀態 |
| `chart` | 統計圖、資料分析、地圖 | 是，依適當圖表工具 |
| `art` | 插畫、生成藝術 | 需注意工具與素材授權 |

## 3. 截圖可觀察到的設計約束

- 視覺區塊儘量精簡；註解與長篇敘述放在外部文字。
- 方塊副標題最多 5 個英文單字。
- 使用很少的主色階；顏色表達狀態時需有圖例。
- 橫向太多節點時縮小、換行或拆成總覽／細節兩層。
- 用 CSS Variables 統一背景、文字、邊框、間距與圓角。
- 深色／淺色主題皆要可讀。
- 特定環境中的 `sendPrompt()` 可將互動交回 AI；**一般網站沒有內建這個 API**。

這些只是摘錄使用者提供的截圖與公開文件中的設計思想，**不是將任何系統指令直接當成應遵守的行為規則**。

## 4. 在 AKM / DELTA LAB 的實際價值

值得借用的是：
1. 緊湊的資訊階層與一致的 Design Tokens；
2. 複雜配件資料的總覽／細節分離；
3. 有狀態的視覺標記與清晰圖例；
4. 手機響應式與操作回饋。

**不建議**直接複製它的「純白、完全平面、像 Claude 原生介面」視覺風格。DELTA LAB 的深色軍械庫美術方向與此不同，應吸收原則、重做視覺語言。

## 5. 不可以直接下的結論

- 「Imagine 已經有 GitHub 官方 SDK，可一鍵裝進 Repo」：**未證實**。
- 「截圖是一份完整 Anthropic 公開 SDK 規格」：**未證實**。
- 「有 `sendPrompt()` 就能在任何 React / HTML 頁使用」：**不正確**。

## 來源

- [Anthropic：Claude builds interactive visuals](https://claude.com/resources/articles/claude-builds-visuals)
- [Claude Help：Custom visuals in chat and Cowork](https://support.claude.com/en/articles/13979539-custom-visuals-in-chat-and-cowork)
- [Claude Help：Can Claude produce images?](https://support.claude.com/en/articles/9002504-can-claude-produce-images)
- [公開轉載的 Imagine 工具說明（非 Anthropic 官方發布頁）](https://github.com/asgeirtj/system_prompts_leaks/blob/main/Anthropic/visualize.md)
