# 資訊安全｜Ch1–Ch3 課程研究筆記

> 類別：教材摘要與現代資安實務對照。整理／來源核對日：2026-11-03（Asia/Taipei）。  
> 主要證據：使用者提供的 3 份資訊安全教材 PDF（未公開上傳）。外部核對來源僅限 [SOURCES.md](SOURCES.md) 已註明的 NIST 及 OWASP 文件。  
> **注意：整理筆記不是安全配置指令；課本舊規定不應直接套到真實系統。**

## 三章導覽

| 章節 | 核心問題 | 重點 |
| --- | --- | --- |
| [Ch1 資訊安全簡介](01-introduction-to-information-security.md) | 保護什麼、面對哪些威脅？ | CIA 三性、鑑別／不可否認／存取控制、弱點／威脅／風險分析、ISMS |
| [Ch2 資訊中心管理與實體安全](02-data-center-and-physical-security.md) | 機房、設備、系統與資料如何安全運轉？ | 人員治理、機房環境、UPS／容錯、備份／異地備援、媒體銷毀 |
| [Ch3 使用者身分鑑別](03-user-authentication.md) | 如何證明登入者是本人？ | 認證三要素、生物辨識 FAR/FRR、密碼攻擊、MFA、Kerberos、FIDO |

## 最短版：必背 16 個概念

1. **CIA Triad**：Confidentiality 機密性、Integrity 完整性、Availability 可用性。
2. **Authentication**：驗證自稱的身分；**Authorization**：核准可以做什麼；兩者不能混為一談。
3. **Non-repudiation**：不可否認性；**Accountability / Audit Log**：透過紀錄追究責任。
4. **Active vs Passive Threat**：主動篡改／干擾；被動觀察或竊聽。
5. **Vulnerability、Threat、Risk**：弱點、威脅、風險，不是同一概念。
6. **ISMS／ISO/IEC 27001**：資訊安全管理系統的要求標準。
7. **Physical Security**：資訊安全不只防駭，也防火災、停電、水災、設備故障與人員誤操作。
8. **UPS**：不斷電系統，應付短期斷電並支援安全關機／切換。
9. **Fault Tolerance**：讓單一設備故障不致立即中斷服務的容錯設計。
10. **Full Backup**：完整備份。
11. **Differential Backup**：自上一次完整備份以來變動的資料。
12. **Incremental Backup**：自上一次備份（完整或增量）以來變動的資料。
13. **Off-site Backup / Disaster Recovery**：備份放在不同地點／災難後恢復服務；並非完全相同。
14. **Something You Know / Have / Are**：知道的密碼／持有的裝置／本人生物特徵。
15. **FAR / FRR**：錯誤接受非法者／錯誤拒絕合法者。
16. **FIDO2/WebAuthn**：使用公開金鑰驗證；正確實作可提供與網域綁定的抗網路釣魚能力。

## 容易混淆：跨章對照

| 概念 A | 概念 B | 差異 |
| --- | --- | --- |
| Authentication | Authorization | 是不是本人 vs 能做哪些操作 |
| Confidentiality | Integrity | 不被未授權閱讀 vs 不被未授權修改 |
| Backup | Fault Tolerance | 災害後還原資料 vs 故障時持續提供服務 |
| Differential | Incremental | 自上次完整備份算起 vs 自上次任意備份算起 |
| MFA | 兩道密碼 | 不同類型認證因素 vs 同類型因素，後者不等於真正 MFA |
| Password Encryption | Password Hashing | 可解密取回 vs 用單向、適當延遲的密碼雜湊驗證 |

## 與先前「系統分析與設計」研究的連結

- [系統分析與設計 Ch1–Ch3](../2026-11-systems-analysis-design/README.md) 介紹**如何規劃、評估與管理**資訊系統專案。
- 本資訊安全課程介紹系統必須**保護哪些資產、如何管理機房資料與認證身分**。
- 概念有交集，但兩組教材分開管理；不要把本筆記當成已完成的實務資安設計或稽核。

## 資料與安全邊界

1. 摘錄均為**原文概念的自述／轉述**，備註的教學例子與整理口訣不代表講義原文。
2. PDF 第 N 頁均指 PDF 實際頁序（封面從第 1 頁起算）。
3. 教材的舊式密碼政策、早期 UNIX／telnet 案例、備份效力及法規年代資訊，不當成現行規範；見 [教材與現代實務差異](04-textbook-vs-current-practice.md)。
4. 未上傳原始教材或完整投影片，避免公開散布受版權保護的原始內容。

[來源索引與證據邊界](SOURCES.md)
