# 經彩青春 SET｜國小篇・樂樂怎麼了？

依照《「經」彩青春 Set－國小篇（調整版）》製作的 22 幕角色劇場（首頁 1 幕、內頁 21 幕）。保留正式劇本、10 道三選一挑戰及通關密碼 **0451（你是唯一）**。

遊戲：https://kaoelvmpvm.github.io/jingcai-youth-interactive-learning-es/

## 2026-10-14 最新畫面調整

- **角色圖片預留**：首頁、每幕舞臺、通關畫面的角色區均改為空白預留框，待正式圖檔完成後再置入。舊的 SVG 暫保留在儲存庫，不會在目前的遊戲畫面載入。
- **對話不重複**：人物對話、旁白以及護理師完整知識說明，全部在舞臺上方的對話泡泡呈現；已移除舞臺下方重複的「劇情對話」區。
- **閱讀順序明確**：所有泡泡依照 data/scenes.js 中的行文順序標註 ①②③ 等編號，電腦由左至右、手機由上至下閱讀。長篇內容完整顯示、不截斷。
- **GOOD JOB 徽章置頂**：答對當下，舞臺上方立即顯示「已答對第 N／10 題」與該題知識徽章名稱；進入下一幕知識回饋頁時也維持顯示，不必向下捲動尋找。
- **操作規則不變**：答錯可重試、答對才能前進，支援上／下一幕、同一分頁進度恢復與通關密碼複製。

## 檔案說明

- data/scenes.js：原始正式劇本、選項與答案。**這次沒有修改任何教學文案**。
- data/presence.js：每幕在場人物、焦點及場景；日後可更新圖片資源及人物設定。
- index.html：對話舞臺、徽章區、答題區、通關區。
- assets/style.css：舞臺、泡泡順序、圖片預留框、徽章及響應式版面。
- assets/app.js：依據劇本行序渲染泡泡、判斷答題結果及控制徽章。
- assets/characters/*.svg：舊圖片保留作為備用，未在正式頁面顯示。
- tests/scenes.test.cjs：劇情內容、人物場景、資料及版面結構測試。

執行驗證：`node --test tests/scenes.test.cjs`。

本專案使用 GitHub Pages 靜態託管，不需要 API 或資料庫。

## 角色圖 ZIP 一鍵匯入

本專案支援完整 **17 張角色立繪**（樂樂 6、小琪 4、大明 4、護理師 3），固定檔名：
`C01_L01.png`～`C01_L06.png`、`C02_Q01.png`～`C02_Q04.png`、
`C03_D01.png`～`C03_D04.png`、`C04_N01.png`～`C04_N03.png`。

1. 開啟 [uploads 資料夾](https://github.com/kaoelvmpvm/jingcai-youth-interactive-learning-es/tree/main/uploads)。
2. 點選 **Add file → Upload files**，上傳整個 ZIP（**不要解壓縮**），在 GitHub 內的檔名必須為 `uploads/characters.zip`。在本機可將下載的圖包先改名 `characters.zip`。
3. Commit 至 `main` 後，[Actions → 匯入經彩青春角色圖片](https://github.com/kaoelvmpvm/jingcai-youth-interactive-learning-es/actions/workflows/import-characters.yml) 即自動驗證 17 張透明 PNG、解壓縮、寫入 `assets/characters/generated/`、更新 `data/character-assets.js`、快取版本，並嘗試直接部署 GitHub Pages。
4. **第一次使用請在 Settings → Pages → Build and deployment → Source 選擇 GitHub Actions**。因為 GitHub bot 的自動提交不會觸發 branch-based Pages build，因此匯入流程本身包含 Pages 部署步驟。這一步需要儲存庫管理員在設定頁手動完成。
5. 未上傳 ZIP 前網站維持原本的角色圖預留框；失敗或缺圖也會退回預留框，不影響答題。

上傳後若要替換角色圖片，只要用同名 ZIP 再次上傳覆蓋 `uploads/characters.zip`。教學劇本 `data/scenes.js`、選項、正確答案及密碼不受圖片匯入影響。

如果 Actions 出現 push 權限問題，請檢查 Settings → Actions → General → Workflow permissions 是否允許這個工作流程使用 `contents: write`，以及 main 分支保護政策是否允許 bot 提交。
