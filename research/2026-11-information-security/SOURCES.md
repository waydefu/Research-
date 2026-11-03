# 資料來源與證據界線｜資訊安全

整理日期：2026-11-03（Asia/Taipei）。來源 PDF 僅作為研究整理依據，不公開重新散布；頁碼自 PDF 封面起算。

## 主要參考文件

| 原始檔名 | 主題 | 頁數 | 研究文件 |
| --- | --- | --- | --- |
| `CH 01-資訊安全簡介(1).pdf` | 安全需求、威脅與風險 | 32 | [資訊安全原則](information-security-principles.md) |
| `CH 02-資訊中心管理與實體安全.pdf` | 資訊中心與設備保護 | 38 | [基礎設施安全](infrastructure-and-physical-security.md) |
| `CH 03-使用者身分鑑別.pdf` | 身分認證與密碼安全 | 50 | [數位身分與認證](identity-and-authentication.md) |

## 外部技術指引（部分主張）

- [NIST SP 800-63B-4（2025 年正式版）](https://csrc.nist.gov/pubs/sp/800/63/B/4/final)：數位身分認證及認證器管理。
- [NIST SP 800-63B-4：Authenticators](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/)：密碼驗證與抗釣魚技術。
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)：安全儲存密碼的實務指引。

外部指引與歷史敘述的比較見 [安全控制與現代技術差異](security-guidance-evidence-review.md)。

## 證據狀態

- **來源支持：**原始資料中的安全概念、各種備份與身分鑑別分類；研究文件內附 PDF 位置。
- **有限度外部核對：**NIST／OWASP 對密碼長度、輪換、雜湊與公開金鑰驗證的部分主張；不表示所有內容皆已全面驗證。
- **整理者判斷：**概念的綜合解釋、風險提示與補充例子，不等同原始資料的逐字結論。
- **待查證：**台灣法規適用性、國際標準版次、機房工程規範與個別產品安全性。
- **未實作：**無系統部署、滲透測試、配置變更或安全稽核。
