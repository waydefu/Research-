# 四種開機動畫架構：執行時序、視覺系統與採用門檻

研究日期：2026-11-11（Asia/Taipei）  
研究狀態：限定範圍原始碼已核對；跨平台實作與效能尚未驗證。

## 問題與邊界

「開機動畫」可能指：應用程式載入遮罩、登入前的科幻敘事、即時桌布、Windows 啟動器視窗、Android 作業系統啟動時的 bootanimation。彼此視覺可相似，執行權限與生命週期卻不同。本文不將 UI 的「看起來像開機」誤寫為系統啟動。

## 四案比較

| 上游 | 執行環境與畫面生成 | 解決問題 | 優先可學的機制 | 無法直接移植 |
| --- | --- | --- | --- | --- |
| [lxj5820/dsh-boot-animation](https://github.com/lxj5820/dsh-boot-animation) | DSH／Chromium 影片、DOM | 裝飾性片頭與核心載入同步 | clipDone AND appReady、片尾交疊淡出、媒體備援 | DSH Host 注入、權限與播放器 |
| [yannicksong0106/dsh-550c-boot](https://github.com/yannicksong0106/dsh-550c-boot) | DSH／SVG、CSS、DOM | 第一幀遮罩與可跳過故事動畫 | 解析期覆蓋、可取消時間線、兩階段退場 | 原宿主插件時序與 DOM 結構 |
| [Ryder191/haloflux](https://github.com/Ryder191/haloflux) | Web Canvas 2D | 即時光環、微型 HUD、非均勻節奏 | beat clock、包絡、7 機位、手機參數 | 系統啟動前不可假設有瀏覽器 |
| [Codex Dragon R16](https://github.com/HanwenZhang-George/codex-startup-animation/releases/tag/community-v34-r5) | Windows WPF/MediaElement + Electron CDP | 角色演出不中斷地交接真實桌面程式 | Intro→Idle→Finale、預熱、波紋揭幕、視窗狀態管理 | Win32、WPF、特定 Codex 客戶端 |

## 通用視覺狀態設計（研究推導，非已部署程式）

建議使用獨立且可觀測的狀態：`cover-visible → media-preparing → intro-playing → idle-or-finalizing → handoff-prepared → reveal → interactive`，並設 `skipped`、`failed`、`disposed` 的明確退出路徑。

- **時間軸不是權限：**動畫跑完不等於操作介面就緒；核心就緒不代表影片已達可自然收尾時點。
- **預熱不是呈現：**HTMLMediaElement 的解碼緩衝可以確認有資料，仍須另外觀察首幀提交；以此避免把播放承諾當成畫面已出現。
- **跳過不是取消所有工作：**預覽、自然完成、明確略過、內部失敗及 OS 結束應有不同副作用。Codex R16 的早關閉 bug 顯示，將 UI 收尾誤當全域 disable 會令桌布消失。
- **交接的視覺守恆：**從舊畫面到新畫面的第一幀，應控制共同色底、主體位置、視差、縮放與最末一幀動量；550C 雙段淡出與 Codex 波紋延續各有不同解法。

## 優先採用排序

1. **穩定性：**先記錄 ready、decoded、presented、skipped、timeout，設所有退出路徑及不遮擋互動的 fail-safe。
2. **時間線：**使用可取消的有序階段，SVG path、打字機與短促畫面事件配合節拍。
3. **即時光效：**以 beat clock 和幾層光束開始，先測最小版本，不一次複製所有 56 個參數。
4. **角色演出：**若有授權資產，考慮 pre-rendered Intro／loopable Idle／Finale，待正式畫面可顯示才進 Finale。
5. **Android 系統層：**把動效烘焙成支援的畫格素材，而非要求 bootloader 直接執行 Web 或 WPF。

## 待驗證門檻

- 真實畫面：起始首幀延遲、同一解析度下的 decoded/presented/dropped frames、30/60 FPS 的 PTS 連續性。
- 行為：慢啟動、拒絕解碼、素材缺失、背景切換、略過、重複啟動、系統退出，均不應卡死或遮住操作。
- 資源：CPU/GPU/RAM、影片解碼器數量、耗電、熱降頻及多視窗窗口管理；沒有採樣前不要寫 PASS。
- 可及性：降低動態效果、避免高頻閃爍、可跳過、鍵盤入口、字幕/提示對比與無障礙替代。
- 素材權利：每段影片、人物形象、商標、音樂和字型獨立核對，程序碼開源不等於素材可重用。

採用狀態：**研究完成；未批准移植、安裝或發佈。** 跨專案合成方案為設計推論，不是上游已公開的單一產品。
