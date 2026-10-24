/**
 * 免費練習題清單（顯示在 /units，依 unit 分組；舊網址 /practice 會轉到 /units）。新增一支影片＝在陣列最上面加一行，記得填 unit。
 * publishAt：影片公開時間（台北時間）；在這之前頁面不會顯示該筆。
 * driveId：Google Drive 檔案 ID（必須設成「知道連結的任何人都能檢視」）。
 */
export type PracticeSheet = {
  series: string;
  title: string;
  topic: string;
  level: "國中" | "高中" | "SAT";
  driveId: string;
  /** 有填就直接開這個網址（站內 PDF），不走 Drive。 */
  url?: string;
  /** 所屬單元（lib/unit-packs.ts 的 slug）；/units 依此分組。沒填的歸到「其他」。 */
  unit?: string;
  publishAt: string;
};

export const PRACTICE_SHEETS: PracticeSheet[] = [
  { series: "學測陷阱題 #1", title: "根式方程只找到一個解？兩個解都要，和是 6", topic: "根式方程：定義域、平方後代回檢查增根、不能同除以可能為 0 的根號、換元 t ≥ 0", level: "高中", driveId: "gsat-trap1-practice", url: "https://kuan-weekly.vercel.app/pdf/gsat-trap1-practice.pdf", publishAt: "2026-10-25T17:30:00+08:00" },
  { series: "學測真題 #3", title: "解出 m＝0 要丟掉，答對率只有 18%（114 學測數A 第16題）", topic: "點到直線距離、相切時半徑＝距離、弦長 2√(r²−d²)，解出參數要回頭檢查相異兩點", level: "高中", driveId: "1QnqdNaLSQLPzweJhE18AM8K4h6wNw7IP", url: "https://kuan-weekly.vercel.app/pdf/gsat-real3-practice.pdf", unit: "circle-eq", publishAt: "2026-10-24T17:30:00+08:00" },
  { series: "學測真題 #2", title: "5、6 相鄰又 6、7 相鄰，不能各乘 2（115 學測數B 第14題）", topic: "相鄰排列的綑綁法：同一個數字出現在兩個相鄰條件裡，要合成一串", level: "高中", driveId: "1j3QXMRTUhBANKkpMjj5iXuSX-Issb_C9", url: "https://kuan-weekly.vercel.app/pdf/gsat-real2-practice.pdf", unit: "prob", publishAt: "2026-10-23T17:30:00+08:00" },
  { series: "學測真題 #1", title: "等腰三角形算出 3 個，答案只有 2 個（115 學測數A 第6題）", topic: "坐標平面上的等腰三角形：三種等腰情況、點到直線距離、中垂線，最後檢查三點共線", level: "高中", driveId: "1m45Ln5tgxuwP_jyUcU-Fy7wkQ8Ui5I4P", url: "https://kuan-weekly.vercel.app/pdf/gsat-real1-practice.pdf", publishAt: "2026-10-22T17:30:00+08:00" },
  { series: "畫圖一眼懂 #29", title: "1＋3＋5＋…＋19 等於多少？拼正方形就知道", topic: "奇數和＝n²、偶數和、大正方形減小正方形、等差級數和", level: "高中", driveId: "1yE12VdICrQKtfKYq7TwKaOjKuuRNGqib", unit: "series", publishAt: "2026-10-28T20:30:00+08:00" },
  { series: "學測一眼懂 #28", title: "濾光片每片剩 80%，疊幾片才低於 10%？", topic: "指數衰減與取 log 解不等式：log r 是負數，除過去要變號", level: "高中", driveId: "16Q8UBbM9TQy_Td01cDqZZHZCg643LVJU", unit: "gsat-log", publishAt: "2026-10-27T20:30:00+08:00" },
  { series: "學測數A 長片", title: "三角函數 一次複習（sin 210° 是正還是負？）", topic: "特殊角、廣義角符號、平方關係、正弦與餘弦定理、面積、疊合最大值", level: "高中", driveId: "1eaPs155DBk5KbDjvMPUWHN0hhf9rAgjx", unit: "trig", publishAt: "2026-10-25T15:53:00+08:00" },
  { series: "畫圖一眼懂 #27", title: "|x − 3| < 2 怎麼解？數線一秒看懂", topic: "絕對值不等式就是距離：小於夾中間、大於往兩邊", level: "高中", driveId: "1Gwcn1UBU5nwBn3iUXdj8kXvdPikvW7zv", unit: "abs-ineq", publishAt: "2026-10-26T20:30:00+08:00" },
  { series: "學測一眼懂 #26", title: "每個人都加 10 分，標準差變多少？", topic: "標準差：加常數不變、乘 a 變 |a| 倍", level: "高中", driveId: "1dHMCCWgeDL5JsTmHZUgGBVQH6MPnd06H", unit: "stats", publishAt: "2026-10-25T20:30:00+08:00" },
  { series: "畫圖一眼懂 #25", title: "兩邊 5、8 夾 60 度，第三邊是 7", topic: "餘弦定理：兩邊夾角求第三邊、三邊求角、判斷鈍角", level: "高中", driveId: "1NB5HWRZl0NVXy5wpa7I8gSohv39_Pg_f", unit: "trig", publishAt: "2026-10-23T20:30:00+08:00" },
  { series: "學測一眼懂 #24", title: "兩個向量垂直，t 是多少？內積等於 0", topic: "向量內積：坐標算法、垂直等於內積 0、夾角與長度", level: "高中", driveId: "1YK2q2BYjLBBr-jlK4eL6R0X89FrjHMJI", unit: "vector", publishAt: "2026-10-22T20:30:00+08:00" },
  { series: "學測數A 長片", title: "排列組合 一次講完（5 顆糖分 3 人有幾種？）", topic: "排列、相鄰插空、捷徑走法、組合、重複組合、分組", level: "高中", driveId: "1lnFhgWQX-a19d9CLPRoBW2fKX0elHIcv", unit: "prob", publishAt: "2026-10-22T15:53:00+08:00" },
  { series: "畫圖一眼懂 #23", title: "圓的方程式，其實就是畢氏定理", topic: "圓方程式就是畢氏定理：讀圓心半徑、配方、點與圓、切線", level: "高中", driveId: "1B4MBdG34wQMPdwygTln2yIxd3nye4XyC", unit: "circle-eq", publishAt: "2026-10-21T20:30:00+08:00" },
  { series: "學測一眼懂 #22", title: "5 人選 2 人，是 20 種還是 10 種？", topic: "組合 C(n,k)：只選不排，同一組被排了 k! 次", level: "高中", driveId: "1t5M_odF6LCwlPCe_TQWxmG6aPrX3SvoI", unit: "prob", publishAt: "2026-10-20T19:07:00+08:00" },
  { series: "Digital SAT Ch.3", title: "一次函數與圖形 完整帶練", topic: "SAT 英文原題風格：斜率、截距、平行垂直、變化率，附中文關鍵字與詳解", level: "SAT", driveId: "1vrd_8ZaRW4me58-B8PVXILP09UdS_9f_", unit: "sat-algebra", publishAt: "2026-10-20T15:53:00+08:00" },
  { series: "國三段考", title: "國三段考練習：圓（弧長、圓周角、弦切角）", topic: "弧長與扇形、圓心角與圓周角、直徑所對圓周角、弦切角、圓內接四邊形", level: "國中", driveId: "1UtEkfeHf-6oQMtNozJZMwXVhlQ04KMar", unit: "jh-circle", publishAt: "2026-10-18T16:00:00+08:00" },
  { series: "畫圖一眼懂 #21", title: "99 × 101 心算 3 秒：平方差畫圖就懂", topic: "平方差 a² − b² ＝ (a + b)(a − b)，剪拼圖看懂速算", level: "國中", driveId: "1WCsZRivJ68te1jn7WFYIEFixHieVV0EI", unit: "jh-mult", publishAt: "2026-10-19T19:07:00+08:00" },
  { series: "Digital SAT Ch.2", title: "二元一次方程式與公式變形 完整帶練", topic: "SAT 英文原題風格，附中文關鍵字與逐步詳解", level: "SAT", driveId: "1trphOaYKfKLGBP5jPw7GNY3EMrVCiDyP", unit: "sat-algebra", publishAt: "2026-10-19T15:53:00+08:00" },
  { series: "學測一眼懂 #20", title: "兩顆骰子和是 7，機率是 1/11 嗎？", topic: "古典機率：用 6 × 6 格子數出所有等可能結果", level: "高中", driveId: "1X9EMH_cbhLwf0zNNUr7yyCcA0H6DneaR", unit: "prob", publishAt: "2026-10-18T19:07:00+08:00" },
  { series: "畫圖一眼懂 #19", title: "1 加到 100，畫兩個樓梯就算完", topic: "等差級數求和：兩個樓梯拼成長方形", level: "高中", driveId: "1eFQG9fg1DMlX6k-AaH4WEFzHN7kI0jqW", unit: "series", publishAt: "2026-10-17T19:07:00+08:00" },
  { series: "學測一眼懂 #18", title: "log 只問一件事：要幾次方？", topic: "對數的定義：log 就是在問次方", level: "高中", driveId: "108wOij62LPGPzgTfqnVlnEFvuFAXg499", unit: "gsat-log", publishAt: "2026-10-16T19:07:00+08:00" },
  { series: "學測數A 長片", title: "指數與對數 一次講完（2^50 是幾位數？）", topic: "指數律、對數律、換底公式、位數問題與 ln", level: "高中", driveId: "1Fxs7EyRkUVDM4Q1rPVlgYY8CC1E21w8L", unit: "gsat-log", publishAt: "2026-10-15T16:06:00+08:00" },
  { series: "畫圖一眼懂 #17", title: "sin²θ ＋ cos²θ ＝ 1，畫一個單位圓就懂", topic: "單位圓與平方關係：已知 sin 求 cos", level: "高中", driveId: "1dNoiI1vesdR-uv9DhG6kmfZTdLgkP0wz", unit: "trig", publishAt: "2026-10-15T19:07:00+08:00" },
  { series: "學測一眼懂 #16", title: "向量相加，其實就是「頭接尾」走兩步", topic: "向量加法：圖形頭接尾與坐標相加、求長度", level: "高中", driveId: "1GpDzykD27BaH7GcnPIWOYmXlFqoKKg1m", unit: "vector", publishAt: "2026-10-14T19:07:00+08:00" },
  { series: "畫圖一眼懂 #15", title: "tan 到底是什麼？其實就是斜率", topic: "過原點直線：tanθ 就是斜率", level: "高中", driveId: "1Kgja9H0S8OxXVkiOhl-NEcpj-c-AjG2O", unit: "trig", publishAt: "2026-10-13T19:07:00+08:00" },
  { series: "段考必錯 #6", title: "(x ＋ 3)² − (x − 2)² 等於多少？", topic: "國二乘法公式：兩個平方相減，後面整個加括號", level: "國中", driveId: "1vE3OG2B-EouAnME4dDHcb4nK5tPnR9ao", unit: "jh-mult", publishAt: "2026-10-13T17:37:00+08:00" },
  { series: "段考必錯 #5", title: "sin(30° ＋ 60°) 可以直接拆開嗎？", topic: "高二和角公式：sin(A ＋ B) 不能直接拆", level: "高中", driveId: "1hShrUHRkiwdeIpilMpr6YTrg7nCcKXzB", unit: "trig", publishAt: "2026-10-13T16:07:00+08:00" },
];

export const driveUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;

/** 已公開的練習題，新到舊。 */
export function livePracticeSheets(now = new Date()) {
  return PRACTICE_SHEETS.filter((s) => new Date(s.publishAt).getTime() <= now.getTime()).sort(
    (a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime(),
  );
}
