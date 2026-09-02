# 寬數週練

小學到高中數學每週練習包（學生題本 + 家長解答）。品牌：寬數／吳寬老師。標語：觀念拆細，路才走得穩。

本站是週練包：出題＋解答、依程度排題、每周進度。解答寫在家長那一份。v1 導覽不含 SAT。

## Windows 安裝

1. 安裝 Node.js LTS（https://nodejs.org/），含套件管理員。不必裝 Visual Studio。資料庫用 node:sqlite。
2. 解壓縮。若 zip 內已有 kuan-weekly 資料夾，請直接進那一層，不要再套一層（避免雙層巢狀）。package.json 應在該資料夾最上層。
3. 請用命令提示字元 cmd.exe，不要用 PowerShell。
4. 在使用者目錄下的 kuan-weekly 執行：

```bat
cd %USERPROFILE%\kuan-weekly
copy .env.example .env.local
npm install
npm run dev
```

瀏覽器開 http://localhost:3000

建置：先 npm run build，再 npm start。

macOS / Linux 同樣先複製環境檔，再安裝並啟動開發伺服器。

資料庫用 Node 內建 node:sqlite（不必編譯原生模組）。

## 環境變數

見 `.env.example`。

- APP_URL：魔術連結網域，本機用 http://localhost:3000
- SESSION_SECRET：預留
- ADMIN_EMAIL / ADMIN_PASSWORD：老師後台
- DATABASE_PATH：SQLite，預設 ./data/kuan.sqlite
- SEAT_CAP：正取名額，預設 20
- SMTP_HOST 等：未設定時，登入頁直接顯示魔術連結

年級清單、難度三選一（偏易／剛好／偏難）寫在 `lib/config.ts`，改完重整即可。應考目標為自由填寫。

## 示範 vs 金流

- 示範家長：parent@demo.kuan.tw（登入頁顯示連結，不必真的寄信）
- 內建孩子「安安（示範・未付費）」與已發布第 36 週分數應用
- 訂閱頁是示範結帳：不會請款，也不會標成已付費，狀態停在 pending
- 老師可對非示範孩子手動開席（受 20 名上限）。示範孩子不佔正取，仍可下載 PDF
- 月費 NT$799、年費 NT$7990

## 老師後台

1. 開 /admin/login
2. Email：ADMIN_EMAIL（預設 admin@kuan.tw）
3. 密碼：ADMIN_PASSWORD（開發預設 kuan-admin-demo）
4. 可建立週次、產生示範雙 PDF 或上傳覆蓋、發布、看回饋與候補

一對一或其他安排：請跟老師討論，寄信 jjredick365@gmail.com。

## 技術

Next.js App Router、TypeScript、SQLite（Node 內建 node:sqlite，Windows 不必裝 Visual Studio）、自訂 CSS（墨／鋼／紙）。PDF 以系統 Noto Sans CJK 產生中文示範檔。
