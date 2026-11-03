# SOURCES｜資訊安全 Ch1–Ch3

**整理日／核對日：2026-11-03（Asia/Taipei）**。

## A. 使用者提供的原始課程教材（非公開檔案）

| ID | 檔案 | 教材章節 | PDF 頁數 | 本 Repo 的內容 |
| --- | --- | --- | --- | --- |
| IS-01 | `CH 01-資訊安全簡介(1).pdf` | 資訊安全簡介 | 32 | [Ch1 整理](01-introduction-to-information-security.md) |
| IS-02 | `CH 02-資訊中心管理與實體安全.pdf` | 資訊中心管理與實體安全 | 38 | [Ch2 整理](02-data-center-and-physical-security.md) |
| IS-03 | `CH 03-使用者身分鑑別.pdf` | 使用者身分鑑別 | 50 | [Ch3 整理](03-user-authentication.md) |

頁碼皆為**從 PDF 封面開始計算的第 N 張頁面**，不是其他書籍版面的章節內頁碼。

原始 PDF 由使用者於先前課程對話提供，目前僅能作為本次整理與內部參照，不能假設外部讀者能開啟，亦不代表具有公開轉載授權。**本 Repo 不上傳課程 PDF 原檔，也不重製完整圖片頁。**

## B. 外部權威來源（僅核對明確列出的現行安全主張）

1. [NIST SP 800-63B-4（2025 年 7 月正式版）](https://csrc.nist.gov/pubs/sp/800/63/B/4/final) — 密碼驗證、認證管理；正式版確認。
2. [NIST SP 800-63B-4：Authenticators](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/) — 單因子密碼最短 15 字、多因子中至少 8 字、不強制例行換密碼或字元組合、WebAuthn 網域綁定與抗釣魚。
3. [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) — 密碼不得明文儲存；建議唯一 salt 與專用緩慢密碼雜湊演算法。

## C. 證據分類

- **教材內容：**本 Repo 使用自己文字重新表述，分章附對應 PDF 頁碼。
- **已核對的現代技術指引：**在 [實務差異表](04-textbook-vs-current-practice.md) 中列出 NIST／OWASP 原始連結及範圍。
- **白話例子與自測題：**輔助記憶，不是課本逐字引文或老師指定考題。
- **未驗證：**教材舊法規最新有效性、具體資安法規適用範圍、機房工程標準、ISO 版本現況、供應商及設備規格。
- **未實作：**未安裝或部署認證系統、未變動其他 Repo／環境、未做壓力或安全性測試。

[資訊安全研究入口](README.md)
