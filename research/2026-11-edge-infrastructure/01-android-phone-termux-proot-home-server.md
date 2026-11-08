# 舊 Android 手機當低功耗伺服器：Termux、PRoot、常駐服務與風險

**研究與來源最後核對：2026-11-07（Asia/Taipei）**  
**研究範疇：** Android／Termux／Debian 或 Ubuntu PRoot／家庭 DNS／私人雲端／伺服器可靠性。  
**資料基礎：** 一則社群案例截圖與貼文說明（作者及測量方法未核實），搭配 Android、Termux、PRoot、Pi-hole 和手機廠商的第一手文件交叉核對。**沒有重製或上傳社群截圖，也未測量功耗、運行時間與性能。**

## 1｜可行性：能執行 Linux 使用者空間，不等於變成一般 Linux 伺服器

舊 Android 手機上可以使用 [Termux](https://termux.dev/) 提供 Shell 和套件，再藉 [PRoot-Distro](https://github.com/termux/proot-distro) 啟動 Debian／Ubuntu 的使用者空間。PRoot 不需要 Android Root，透過 `ptrace` 攔截系統呼叫進行檔案路徑轉換與 UID 模擬。這不是 chroot 或 Docker 的完整替代：

- PRoot **不提供真實 root 權限**，所以依賴 `iptables`、核心模組、特殊掛載和 systemd／OpenRC 服務管理的功能通常受限。
- PRoot 的檔案密集型工作會有額外成本，不能用搭載原生 Debian 的 SBC 性能數據直接類推。
- 使用者可能啟動獨立長駐服務，但 Android 的 App 生命週期、Doze、廠商電池管理、Wi-Fi 待機、螢幕狀態與更新重啟皆可能中斷。即使有 `termux-wake-lock`，也需要確認電池與省電策略，不保證真正 24/7。
- 整機不可用時，手機存取控制、資料庫完整性、備份與憑證也一起受影響；不宜把全家唯一 DNS、重要帳號或不可重建資料押在單一裝置。

## 2｜社群 Redmi 10C 案例：哪些是實證，哪些只是自述？

貼文稱一台 Redmi 10C 換第三方 ROM 並執行 Debian 13，運行 Nextcloud、Pi-hole、Navidrome、Cloudflare Tunnel、MariaDB、Redis、PHP 和 Rclone，且標示 RAM 2.51 / 3.56 GB、CPU 約 47.8°C、連續 3 天 10 小時、54.4 萬次資料庫查詢、總功耗約 2–3 W。**上述為單一使用者提供的截圖及自報；無原始監控數據、負載記錄、功率計與重複測試，不能寫成獨立測量或可保證規格。**

依 [小米台灣 Redmi 10C 官方規格](https://www.mi.com/tw/product/redmi-10c/specs/) 可核實硬體：Snapdragon 680（6nm）、4GB LPDDR4X、UFS 2.2、5000 mAh 電池。官方初始系統是基於 Android 11 的 MIUI 13；社群貼文中的 risingOS 與 Debian 13 不是原廠出貨或官方支援組合。

**指標不可混用：** 若貼文另有「99.3% MySQL 快取命中」與「79.5% 全站儀表板命中」，是不同分母、不同收集週期或不同指標來源，不能當同一個成功率。54.4 萬次查詢也不是每秒負載或效能上限；沒有請求分布和延遲，無法推論承載能力。

## 3｜八個服務：哪些相對容易、哪些最難？

| 服務 | 在 Android + PRoot 上的研究重點 | 主要風險 |
| --- | --- | --- |
| Nextcloud／PHP | 私人檔案存取、Web server 與外部儲存 | 記憶體壓力、資料完整性、檔案鎖與備份 |
| Navidrome | 原生 ARM64 音樂庫服務、媒體掃描 | 掃描 I/O、讀取權限、背景暫停 |
| MariaDB、Redis | 資料庫、快取、工作集 | 寫入 fsync、檔案系統可靠性、斷電與資料損毀 |
| Pi-hole | DNS 53/TCP+UDP、家庭設備解析 | PRoot 無真實 root，低號連接埠／網路及服務管理限制；**Pi-hole 官方支援 systemd／sysvinit 的 Linux 發行版，不保證 Android PRoot** |
| Cloudflare Tunnel | 將服務安全地對外代理，免公開暴露轉發連接埠 | 零信任策略、令牌與外部授權，不代表內部服務自動安全 |
| Rclone | 雲端同步／備份 | 誤刪擴散、同步衝突；同步並不取代有版本的離線備份 |

### 必須記錄的部署限制

[Pi-hole 官方需求](https://docs.pi-hole.net/main/prerequisites/) 列出 512MB RAM、最低 2GB 空間、DNS 53/TCP+UDP 與固定 IP 等要求；它也明確支援配有 systemd／sysvinit 的 Linux 發行版，與沒有 systemd 或真實 root 的 PRoot 存在衝突。若作者聲稱「有跑 Pi-hole」，不能直接推論符合 Pi-hole 官方支援路線、可開機自啟或全家流量可穩定解析。

[Android Doze 官方文件](https://source.android.com/docs/core/power/platform_mgmt) 指出閒置會延遲網路與背景 CPU 活動；充電狀態和廠商 ROM 行為會改變效果。[Termux 官方工具文件](https://github.com/termux/termux-tools/blob/master/doc/termux.1.md.in) 提供 Wake Lock，但並不表示所有手機都能繞過背景程序清除政策。

## 4｜低功耗和電池：沒有外部量測不能說省多少電

手機以 2–3W 運作的敘述需用**插座端／充電器輸入端**可記錄功率的儀表測試，設定充電限制、亮滅螢幕、不同 Wi-Fi 信號與負載，再測待機與尖峰功耗。不能用 CPU 47.8°C 反推出牆上功率，也不能用三天連續上線保證多年可靠性。

長期滿電插電時應監測機體及電池異常發熱、鼓脹、充電循環與充電控制，設立定期人工檢查及安全停用條件。若沒有可用的充電上限、外部 UPS 或可靠電池健康管理，這類設備不宜承擔無人照看的關鍵服務。

## 5｜可重現試驗與採用分級（全數 NOT RUN）

1. **隔離環境先測服務：** 固定機型、ROM、Kernel、Termux/PRoot 版本、Debian 版本及存儲；只在局域網啟動不含敏感資料的單一服務，再逐步增量。
2. **服務持續性：** 螢幕關閉／充電／Wi-Fi 斷線／熱降頻／重啟後自動恢復，至少跨多日監控與手工故障注入。
3. **資源與功耗：** 記錄 CPU/RAM/儲存延遲、I/O 寫入、外部電表功率、電池溫度與健康；對照負載、螢幕狀態和 Wi-Fi 訊號。
4. **資料安全：** 在備份／離線恢復與輪替憑證可證明前，不使用唯一正式資料庫、關鍵家用 DNS、正式登入服務或永久公開端口。
5. **邊界測試：** 測低號埠、UPnP/NAT、IPv4/IPv6、Cloudflare 入口、TLS 更新和存取控制；高權限網路操作應避免越權修改系統。
6. **採用決策：** 低價值、可重建的音樂庫／監控面板可做實驗；全屋唯一 DNS、不可重建私有雲及正式工作 Agent Server 應用更可靠設備並設備援。

## 6｜結論

舊手機可當**低成本實驗邊緣節點**，但 PRoot 與 Android 電源管理讓可用性及權限能力不同於 Raspberry Pi 或原生 Linux 主機。核心研究價值是環境相容性、功耗／效能實測設計、故障恢復與電池安全；**它不是 Android 舊手機已經證明適合商業級 24/7 主機的證據**。

## 來源台帳

- 社群 Redmi 10C 配置、功耗與在線數據 — B：使用者提供的二手截圖／文字；作者測量方法未驗證，原圖未複製。
- [Xiaomi 台灣 Redmi 10C 官方規格](https://www.mi.com/tw/product/redmi-10c/specs/) — A：硬體與原廠系統，非第三方 ROM 背書。
- [Termux PRoot-Distro 官方](https://github.com/termux/proot-distro) — A：PRoot 設計、系統限制與性能注意事項。
- [Termux Wake Lock 官方工具說明](https://github.com/termux/termux-tools/blob/master/doc/termux.1.md.in) — A：背景服務與省電行為的操作建議。
- [Android Doze 官方](https://source.android.com/docs/core/power/platform_mgmt) — A：平台限制；未測各廠商 ROM。
- [Pi-hole 系統需求](https://docs.pi-hole.net/main/prerequisites/) — A：官方系統支援、DNS 埠與最低條件。
- 測試計畫、可靠性及採用門檻 — C：工程推導，**NOT RUN**。
