# HALOFLUX × THE OBSERVATORY：視覺研究與實作依據

查核日期：2026-11-11。這份文件記錄此次設計參考與實作邊界，不表示已完成作者美術簽核或實機效能驗收。

## 原作：HALOFLUX

- [Ryder191/haloflux](https://github.com/Ryder191/haloflux)，實際閱讀 `mobile.html` 版本 `02174503d0f391b1bb2537b8cad75e8e5f9997f2`。
- 原場景以 Canvas 結合 `buildWeb` 交織曲線、beat clock、環帶資料、`drawOuterFar` / `drawOuterNear` 的多層光束、可旋轉資料區塊與鏡頭。新場景直接保留這些原作主場景實作，再接到網站生命週期。這是源碼移植與調整，不是原作者對本站成品品質的認可。
- 上游按 PolyForm Noncommercial 條款提供；頁面與程式保留來源及 Required Notice，附完整 LICENSE。原作附帶音樂的授權另計，本次不自動播放或載入。

## 參考研究

| 原始資料 | 實際觀察 | 本站採用的設計判斷 |
| --- | --- | --- |
| [Active Theory：XR experiments](https://xr.activetheory.net/) | 同一實驗集中測試 WebGL、光暈、全域照明與空間互動。 | 主場景的光網、發光和不同深度一起構圖；保留既有 WebGL 預覽做另一種場景探索。不是宣稱已複製其技術。 |
| [Bruno Simon：互動作品](https://bruno-simon.com/) | 作品用 Three.js 建構可操作的 3D 世界，並提供操作與重置指示。 | 沉浸感應服務探索，但研究資料仍需保有明確的搜尋和返回入口。本站沒有實作其駕駛世界。 |
| [Linear：介面改版研究](https://linear.app/now/behind-the-latest-design-refresh) | 說明資訊密度下以階層和一致的導覽位置減少互相爭奪注意力。 | 讓首頁主視覺明顯，研究清單、搜尋、目錄與閱讀頁使用較安靜的分隔和穩定導覽。 |
| [NRK：敘事中的捲動動畫](https://developer.chrome.com/blog/nrk-casestudy) | 編輯團隊讓排字、插畫與動畫配合敘事，同時處理 reduced motion。 | 動態與正文分層；減少動態時提供靜止畫面，正文不依賴動畫。 |
| [Resn Labs](https://labs.resn.co.nz/) | 將 WebGL、互動與移動裝置實驗以獨立作品呈現。 | 主視覺採用實際執行的場景而非靜態圖示；手機畫面仍需獨立檢查，不能推論效能。 |

## 八個面向的實作／未完成界線

| 面向 | 本次工作 |
| --- | --- |
| Graphic Design | 使用原作的場景紋理與資料環帶；研究分類保留各自示意圖，搭配編號式行列。 |
| Motion Design | 原作節拍、光網、遠近光束、資料環帶及鏡頭重新接入；支援停止與降低動態。 |
| Interaction Design | 保留導覽、搜尋、鍵盤焦點、手機目錄與原生捲動；滑鼠／觸控需按實際版本驗證。 |
| Creative Development | 在既有站點上整合上游 Canvas 場景、可見性暫停和 responsive 尺寸；不載入原作全螢幕或背景音樂控制。 |
| 3D Web Design | 本次移植的是 Canvas 2D 原作，保留既有 WebGL2 觀測所預覽；沒有新增真實 3D 模型，不聲稱場景是 3D 模型。 |
| Shader Art | 沿用原有觀測所 shader；移植的 HALOFLUX 本身不是 shader，這次沒有新寫 shader。 |
| Typography | 統一首頁、研究分類、搜尋、領域和文章的字級階層、行長、段落節奏與手機尺寸。 |
| Brand Identity | 延續 THE OBSERVATORY 與深空、暖金、青光；配合原作的高亮細線及儀器式細節。 |

測試通過只代表可驗證的行為；視覺品質、是否超過原作和使用者真機表現都必須另行檢查，不能憑程式測試聲稱。
