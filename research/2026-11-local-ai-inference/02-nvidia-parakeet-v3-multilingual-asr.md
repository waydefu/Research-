# NVIDIA Parakeet TDT 0.6B V3：多語語音辨識、字幕時間戳與中文限制

**資料核對：2026-11-07（Asia/Taipei）**  
**原作者：** NVIDIA；[官方 Hugging Face 模型卡](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3)；[官方試用 Space](https://huggingface.co/spaces/nvidia/parakeet-tdt-0.6b-v3)。  
**研究分類：** Automatic Speech Recognition（ASR）／音訊轉文字／字幕時間軸。**未下載權重、跑推論、聆聽測試或測量準確率。**

## 模型與語言範圍

Parakeet TDT 0.6B V3 是 NVIDIA 的 **6 億參數 FastConformer 編碼器 + TDT 解碼器** 語音辨識模型，官方宣稱可自動偵測語言、加入標點與大小寫，輸出詞級與片段時間戳。適合將有聲音的訪談、課程、影片內容轉成可編輯的逐字稿與字幕時間線。

**重要：官方列出的 25 種語言全部屬歐洲語言，沒有中文（zh、zh-TW、zh-CN）。** 不可把「支援 25 種語言」誤寫成「支援繁體中文」；也不應期待它直接對中文音訊生成可靠字幕。若需求是中文語音，須另選支援中文的 ASR 模型，並用真正的台灣口音語料驗收。

官方支援語言為：保加利亞、克羅埃西亞、捷克、丹麥、荷蘭、英語、愛沙尼亞、芬蘭、法語、德語、希臘、匈牙利、義大利、拉脫維亞、立陶宛、馬爾他、波蘭、葡萄牙、羅馬尼亞、斯洛伐克、斯洛維尼亞、西班牙、瑞典、俄語、烏克蘭語。

## 技術能力與不可推論之處

| 項目 | 來源說明 | 驗證界線 |
| --- | --- | --- |
| 模型尺寸 | 600M 參數 | 不代表 VRAM 需求就是權重大小；注意框架與 batch 的記憶體成本 |
| 語音語言辨識 | 25 種歐洲語言，可自動辨識語言 | 沒有官方中文語言支援 |
| 文字時間戳 | Word-level、segment-level timestamps | 字幕同步誤差需以真實音檔人工對照 |
| 長音訊 | 官方宣稱 A100 80GB 上 full attention 約 24 分鐘、local attention 最高約 3 小時 | 非一般電腦、手機或所有 inference backend 的保證 |
| 授權 | 模型卡標示 **CC BY 4.0**，可商用／非商用 | 重用須遵守姓名標示與相關條款；資料、輸出權利另查 |

## 最小評估設計

1. 固定模型 revision、推論框架、GPU 型號、取樣率與 decoding 設定；選英文及數種官方支援語音樣本。
2. 每組準備經人工校對的文字與時間戳，分開量測 WER、CER、時間對齊誤差、語言偵測及 Real-Time Factor（RTF）。
3. 用安靜、街道噪音、混合口音、專有名詞與短句測試穩健性；不要只依作者提供之排行榜平均值選型。
4. 對中文資料應明確標示 **out of supported language scope**，不可將中文識別差直接視為一般品質缺陷或宣稱已支持中文。
5. 若使用公開雲端 Demo，上傳內容要確認隱私與可公開性；敏感或受限制音檔不得隨意交給外部服務。

## 採用結論

若目標是**官方支援語言的英語／歐語字幕**，值得做小規模 A/B；若目標是**繁體中文語音字幕**，不建議把這個版本當首選。它只完成資料收錄，未接入任何影片製作系統。

## 來源台帳

- [NVIDIA Parakeet V3 Model Card](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3) — A：語言清單、模型架構、時間戳、模型授權、作者效能自述。
- [官方 HF Space](https://huggingface.co/spaces/nvidia/parakeet-tdt-0.6b-v3) — A：作者提供的 Demo 網址，未上傳音檔或測試。
- 採用與 benchmark 規格 — C：工程推導；**NOT RUN**。
