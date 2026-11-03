# 身分驗證與安全控制：現代技術指引差異

> **研究範圍：**區分歷史參考資料、現行 NIST／OWASP 安全建議及尚未查核的事項。 資料溯源見 [SOURCES](SOURCES.md)。


| 參考資料中的敘述（摘要） | 原始資料位置 | 外部指引 | 查核結論 |
| --- | --- | --- | --- |
| 密碼長度以「8–12 字」為合理範圍 | 來源資料 PDF 第 17 頁 | NIST SP 800-63B-4 § Password Verifiers | **不宜作為現行規範。**NIST 2025 正式版要求單因子密碼至少 15 字；僅作為 MFA 一部分時可短至 8 字，應支援至少 64 字的最大長度。 |
| 建議每 2–3 個月例行更改密碼 | 來源資料 PDF 第 19 頁 | NIST SP 800-63B-4 | **不符合現行 NIST 建議。**不得強制例行週期換密碼；有證據顯示帳密外洩時應要求更改。 |
| 在密碼中混合大小寫／數字 | 來源資料 PDF 第 17 頁 | NIST SP 800-63B-4 | **強制字元種類不是現行 NIST 建議。**不得強制組合規則；應著重足夠長度與封鎖常見／遭洩漏密碼。 |
| 直接儲存法、通行密碼加密法及早期 UNIX DES 範例 | 來源資料 PDF 第 21–28 頁 | OWASP Password Storage Cheat Sheet | **歷史原始資料案例。**現代應使用經適當設定、帶唯一 salt 的緩慢密碼雜湊（例如 Argon2id），不要明文儲存或僅依賴一般可逆加密。 |
| QR Code 驗證可比密碼／PIN 更安全 | 來源資料 PDF 第 5 頁 | 協定與方案不同 | **不可無條件成立**；QR 可能承載安全認證流程，也可能只是可複製資訊；未對特定實作做安全評估。 |
| FIDO 可防密碼洩漏與釣魚 | 來源資料 PDF 第 33、45–46 頁 | NIST SP 800-63B-4 § Phishing Resistance | **有條件成立。**恰當實作的 WebAuthn/FIDO2 透過網域綁定提供抗釣魚能力；不代表設備與網站其餘部分不可能被攻擊。 |
| 機房溫度 20–25°C、濕度 40–60% |  PDF 第 17 頁 | 此次未取設備／工程規格 | **待查證其適用性**；數字保存為原始資料示例，不宣稱為通用或最新工程規範。 |
| 異地備份可「完全避免」火災導致資料毀損 |  PDF 第 19 頁 | 本次未針對備份架構驗證 | **不能保證。**異地備份降低共同災損風險，但需實測還原、權限、備份完整性及異地獨立性。 |
| 個資、資安相關法規年份／義務 |  第 26–28 頁； 第 3–4 頁 | 本次未逐條核對現行法令 | **未做法律查證**；不可從此原始資料筆記直接推導 2026 年的法定義務。 |

## 已採用的一手來源

1. [NIST SP 800-63B-4: Authentication and Authenticator Management（2025 正式版）](https://csrc.nist.gov/pubs/sp/800/63/B/4/final)
2. [NIST：Authenticator / Password Verifiers / Phishing Resistance](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/)
3. [OWASP：Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

**研究邊界：**NIST SP 800-63B-4 是數位身分鑑別相關指引，不應直接主張其每一條都是台灣所有機構的法定義務。本文件只針對有出處的技術建議補充，沒有部署、測試或更動任何環境。其他安全標準及法律版本未查核。

[回研究目錄](README.md) · [原始資料來源](SOURCES.md)
