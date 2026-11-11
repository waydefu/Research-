# HALOFLUX 原作美術重現（純視覺基準）

## 工作界線

此階段只忠實保留原作的桌面與行動版畫面、動畫與控制，沒有將 Research- 研究資料套入，也沒有改動主站首頁、研究原文、搜尋、路由或全站共用樣式。上游版本：[`02174503d0f391b1bb2537b8cad75e8e5f9997f2`](https://github.com/Ryder191/haloflux/tree/02174503d0f391b1bb2537b8cad75e8e5f9997f2)。

## 完整源碼而非仿製

- `site/public/haloflux/index.html`：原作裝置識別入口（桌面導向 `lab.html`，手機導向 `mobile.html`）。
- `site/public/haloflux/lab.html`：原作桌面 16:9 控制台、Canvas 主光場、非線性節拍、資料環、遠近五層光束、七段運鏡和參數控制。
- `site/public/haloflux/mobile.html`：原作手機直／橫向調整與較低粒子負載，與桌面版使用同一套美術語言。
- `site/public/haloflux/LICENSE`：原作完整 PolyForm Noncommercial 1.0.0 授權及 Required Notice。

源碼美術引擎保留，不把 Canvas 換成 CSS 漸層／簡化環形圖示，也不引入卡片式研究介面。

### 與上游的最小差異（非美術變更）

1. 每個 HTML 頁面加入 `noindex,nofollow` 和 `data-pagefind-ignore`，避免純展示頁干擾研究搜尋及正式 SEO。
2. 加入指向同資料夾 `LICENSE` 的標記。
3. `lab.html` 與 `mobile.html` 的 `audio/sw421k.mp3` 改為上游 `02174503d0f391b1bb2537b8cad75e8e5f9997f2` 的固定版本 Raw URL，設定 `crossorigin=anonymous`；原作音樂約 7.6 MB，無法透過目前連線直接匯入。音訊依賴網路與上游託管，視覺繪製不依賴音訊播放。若需要完全離線，必須另補入 CC0 音訊並恢復相對路徑。
4. 保留原作 Google Fonts 載入，離線時由原作字型 fallback 生效，**不能宣稱離線字體等同原作**。

### 來源核對

| 原始檔 | 原作 Git Blob SHA |
| --- | --- |
| `index.html` | `7b2e05cadb17b54220e5c3865d1b8de50c86a195` |
| `lab.html` | `69f3a66042e61a17a818ad7d5a9b34066cb0ca89` |
| `mobile.html` | `5c2c1affcb129aac4eeec929afeaae06cf34a59a` |
| `LICENSE` | `461ab926d4b191b9b6f4b3eb3d6195eb4b64cfbf` |

## 審核及預覽

正式組裝後路徑：`/Research-/v3/haloflux/`，也可直接檢視 `lab.html` 與 `mobile.html`。這是**孤立的純藝術基準**，不接管首頁。完成與否需依最新 HEAD 的 CI 與瀏覽器輸出，以及真機同畫面比較判定；沒有真機檢驗前不得聲稱視覺已超越原作。

## 授權

HALOFLUX by Ryder191 (RYDER CODE / Ms MAIKEBAIs CAT)：https://github.com/Ryder191/haloflux 。**僅非商業用途**；衍生作品仍受原作的 PolyForm Noncommercial 條款限制。原作提供的 `Synthwave 421k` 音樂另據作者說明為 CC0；本提交只引用其來源 URL，未重新分發二進位音訊。

## 下一階段（本 PR 不做）

待原作美術在桌面與手機核准，再討論將 Research- 研究內容、品牌資訊和導航整合，不能提前改變原作的構圖、光束層次、時序、運鏡或控制功能。
