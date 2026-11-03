# 資訊安全 Ch3｜使用者身分鑑別

**教材：**CH 03-使用者身分鑑別.pdf；共 50 頁。**整理日期：**2026-11-03。

## 1. 身分識別與驗證（第 2、11–13 頁）

- **Identity / Identification（身分／識別）**：使用者宣稱自己是哪個帳號／個體。
- **Authentication（鑑別／驗證）**：確認宣稱的身分是否可信。
- **Authorization（授權，補充概念）**：通過驗證後，決定能使用哪些資源；不能與 Authentication 混淆。

教材將帳號流程描述為註冊、進入系統、身分識別與驗證等步驟。

## 2. 三大身分鑑別因素（第 3–10 頁）

| 因素 | 英文 | 例子 |
| --- | --- | --- |
| 知識 | **Something You Know** | 密碼、PIN |
| 持有 | **Something You Have** | 智慧卡、保安金鑰、裝置 |
| 生物特徵 | **Something You Are** | 指紋、臉部辨識 |

教材分別討論條碼／QR、磁卡、IC 卡、智慧卡、生物辨識與密碼。**QR Code 本身只是承載資訊的形式，是否安全取決於認證協定與實作**，不因掃描 QR 就必然更安全。

### 生物辨識兩個常考比率（第 8 頁）

- **FAR（False Accept Rate）錯誤接受率**：不合法使用者被誤當合法者。
- **FRR（False Reject Rate）錯誤拒絕率**：合法使用者被誤擋。
- 另有活體檢測及驗證時間等評估指標。

## 3. 密碼面臨的攻擊（第 14–15 頁）

| 名詞 | 意思 |
| --- | --- |
| **Dictionary Attack** 字典攻擊 | 嘗試常見單字／口令 |
| **Guessing** 猜測 | 用生日、姓名等相關資訊試探 |
| **Brute-force** 暴力攻擊 | 系統性嘗試大量組合 |
| **Replay Attack** 重送攻擊 | 重放先前攔截的有效認證內容 |
| **Spoofing / Social Engineering** 偽裝／誘騙 | 假冒合法介面或身分騙取資料 |

教材第 16–20 頁另討論密碼產生、保管、更新、錯誤次數與稽核紀錄。**教材列出的「8–12 字」、「每 2–3 個月固定更新」不是現行 NIST 密碼建議**；詳見 [現代實務差異](04-textbook-vs-current-practice.md)。

## 4. 密碼如何儲存（第 21–28 頁）

教材列出直接儲存、單向函數與加密法等技術，並用早期 UNIX／telnet 示例說明。這些**只能視為教材歷史技術脈絡**。

現代系統不應儲存明文密碼；OWASP 建議採**適當的單向密碼雜湊函數與唯一 salt**（例如 Argon2id、scrypt，按適用情況使用 bcrypt／PBKDF2），而不是一般可逆加密。

- OWASP 一手來源：[Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- 密碼政策現行參考：[NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/)

## 5. MFA、Kerberos、FIDO（第 29–46 頁）

### MFA / 2FA
- **2FA（雙因子）**：兩種不同因素，例如密碼＋硬體金鑰。
- **MFA（多因子）**：以多種不同認證因素提供更高保障。
- **兩組不同密碼不構成兩種不同因素**；OTP 的防釣魚能力與 FIDO2/WebAuthn 不相同。

### Kerberos（第 30–32 頁）
使用認證伺服器與票證來支援受控環境中的身分鑑別。教材展示的是簡化架構，**切勿把教材所示的明文密碼傳遞描述當成現代 Kerberos 正常運作原理**；部署細節要以現行協定與實作文件為準。

### FIDO2 / WebAuthn（第 33–46 頁）
- **註冊：**產生公／私鑰，服務端儲存可用於驗證的公鑰資料。
- **登入：**服務端提供挑戰，驗證器用私鑰對挑戰等資料產生簽章，服務端以公鑰核驗。
- 私鑰不直接送到網站；正確設定的 WebAuthn 將認證與服務網域綁定，提供抗網路釣魚能力。
- 教材包含註冊與登入流程圖，筆記保留概念而不複製流程圖。

一手來源：[NIST SP 800-63B-4 Phishing Resistance](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/#phishing-resistance)。

## 快速自測（自編）

1. Identification、Authentication、Authorization 如何區分？
2. FAR 和 FRR 分別代表哪種誤判？
3. 兩道密碼是否等於真正雙因子？
4. Differential Backup 是哪門課的概念？（跨章）
5. FIDO 為何不需把網站密碼傳給服務端？

**資料來源：**教材頁碼見各段；其他限制見 [SOURCES](SOURCES.md)。
