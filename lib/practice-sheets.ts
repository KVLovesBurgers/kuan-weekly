/**
 * 免費練習題清單（/practice）。新增一支影片＝在陣列最上面加一行。
 * publishAt：影片公開時間（台北時間）；在這之前頁面不會顯示該筆。
 * driveId：Google Drive 檔案 ID（必須設成「知道連結的任何人都能檢視」）。
 */
export type PracticeSheet = {
  series: string;
  title: string;
  topic: string;
  level: "國中" | "高中" | "SAT";
  driveId: string;
  publishAt: string;
};

export const PRACTICE_SHEETS: PracticeSheet[] = [
  { series: "畫圖一眼懂 #21", title: "99 × 101 心算 3 秒：平方差畫圖就懂", topic: "平方差 a² − b² ＝ (a + b)(a − b)，剪拼圖看懂速算", level: "國中", driveId: "1WCsZRivJ68te1jn7WFYIEFixHieVV0EI", publishAt: "2026-10-19T19:07:00+08:00" },
  { series: "Digital SAT Ch.2", title: "二元一次方程式與公式變形 完整帶練", topic: "SAT 英文原題風格，附中文關鍵字與逐步詳解", level: "SAT", driveId: "1trphOaYKfKLGBP5jPw7GNY3EMrVCiDyP", publishAt: "2026-10-19T15:53:00+08:00" },
  { series: "學測一眼懂 #20", title: "兩顆骰子和是 7，機率是 1/11 嗎？", topic: "古典機率：用 6 × 6 格子數出所有等可能結果", level: "高中", driveId: "1X9EMH_cbhLwf0zNNUr7yyCcA0H6DneaR", publishAt: "2026-10-18T19:07:00+08:00" },
  { series: "畫圖一眼懂 #19", title: "1 加到 100，畫兩個樓梯就算完", topic: "等差級數求和：兩個樓梯拼成長方形", level: "高中", driveId: "1eFQG9fg1DMlX6k-AaH4WEFzHN7kI0jqW", publishAt: "2026-10-17T19:07:00+08:00" },
  { series: "學測一眼懂 #18", title: "log 只問一件事：要幾次方？", topic: "對數的定義：log 就是在問次方", level: "高中", driveId: "108wOij62LPGPzgTfqnVlnEFvuFAXg499", publishAt: "2026-10-16T19:07:00+08:00" },
  { series: "學測數A 長片", title: "指數與對數 一次講完（2^50 是幾位數？）", topic: "指數律、對數律、換底公式、位數問題與 ln", level: "高中", driveId: "1Fxs7EyRkUVDM4Q1rPVlgYY8CC1E21w8L", publishAt: "2026-10-15T16:06:00+08:00" },
  { series: "畫圖一眼懂 #17", title: "sin²θ ＋ cos²θ ＝ 1，畫一個單位圓就懂", topic: "單位圓與平方關係：已知 sin 求 cos", level: "高中", driveId: "1dNoiI1vesdR-uv9DhG6kmfZTdLgkP0wz", publishAt: "2026-10-15T19:07:00+08:00" },
  { series: "學測一眼懂 #16", title: "向量相加，其實就是「頭接尾」走兩步", topic: "向量加法：圖形頭接尾與坐標相加、求長度", level: "高中", driveId: "1GpDzykD27BaH7GcnPIWOYmXlFqoKKg1m", publishAt: "2026-10-14T19:07:00+08:00" },
  { series: "畫圖一眼懂 #15", title: "tan 到底是什麼？其實就是斜率", topic: "過原點直線：tanθ 就是斜率", level: "高中", driveId: "1Kgja9H0S8OxXVkiOhl-NEcpj-c-AjG2O", publishAt: "2026-10-13T19:07:00+08:00" },
  { series: "段考必錯 #6", title: "(x ＋ 3)² − (x − 2)² 等於多少？", topic: "國二乘法公式：兩個平方相減，後面整個加括號", level: "國中", driveId: "1vE3OG2B-EouAnME4dDHcb4nK5tPnR9ao", publishAt: "2026-10-13T17:37:00+08:00" },
  { series: "段考必錯 #5", title: "sin(30° ＋ 60°) 可以直接拆開嗎？", topic: "高二和角公式：sin(A ＋ B) 不能直接拆", level: "高中", driveId: "1hShrUHRkiwdeIpilMpr6YTrg7nCcKXzB", publishAt: "2026-10-13T16:07:00+08:00" },
];

export const driveUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;

/** 已公開的練習題，新到舊。 */
export function livePracticeSheets(now = new Date()) {
  return PRACTICE_SHEETS.filter((s) => new Date(s.publishAt).getTime() <= now.getTime()).sort(
    (a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime(),
  );
}
