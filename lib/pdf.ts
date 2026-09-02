import fs from "node:fs";
import path from "node:path";
import { PDFDocument, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { cjkFontPath } from "./font";
import { writableRoot, type ChildRow, type WeekRow } from "./db";
import { uid } from "./ids";

export async function writeWeekPdfs(week: WeekRow, extra?: { child?: ChildRow }) {
  const fontBytes = fs.readFileSync(cjkFontPath());
  const student = await buildPdf({
    week,
    kind: "student",
    fontBytes,
    child: extra?.child,
  });
  const parent = await buildPdf({
    week,
    kind: "parent",
    fontBytes,
    child: extra?.child,
  });
  const dir = path.join(writableRoot(), "data", "pdfs");
  fs.mkdirSync(dir, { recursive: true });
  const studentName = `${week.id}-student.pdf`;
  const parentName = `${week.id}-parent.pdf`;
  fs.writeFileSync(path.join(dir, studentName), student);
  fs.writeFileSync(path.join(dir, parentName), parent);
  return {
    student: { filename: studentName, storage_path: `data/pdfs/${studentName}` },
    parent: { filename: parentName, storage_path: `data/pdfs/${parentName}` },
  };
}

async function buildPdf(opts: {
  week: WeekRow;
  kind: "student" | "parent";
  fontBytes: Buffer;
  child?: ChildRow;
}) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit as never);
  const font = await doc.embedFont(opts.fontBytes, { subset: true });
  const pageW = 595.28;
  const pageH = 841.89;
  const ink = rgb(15 / 255, 20 / 255, 25 / 255);
  const steel = rgb(110 / 255, 128 / 255, 145 / 255);
  const paper = rgb(243 / 255, 239 / 255, 230 / 255);

  const problems = [
    {
      no: 1,
      stem: "二次函數 y = x² − 4x + 3。求頂點座標，並說明對稱軸方程式。",
      hint: "配方或用頂點公式 x = −b/2a。",
      answer: "頂點 (2, −1)，對稱軸 x = 2。配方：y = (x−2)² − 1。",
    },
    {
      no: 2,
      stem: "若 y = ax² + bx + c 的圖形開口向下，且與 x 軸交於 (1,0)、(5,0)。當 x = 3 時 y = 4，求 a。",
      hint: "先寫成 a(x−1)(x−5)，再代入一點。",
      answer: "y = a(x−1)(x−5)。x=3 時 4 = a(2)(−2) ⇒ a = −1。",
    },
    {
      no: 3,
      stem: "判別式：討論 k 使 x² − (k+1)x + k = 0 有兩個相異實根。",
      hint: "D > 0，注意 k 的範圍。",
      answer: "D = (k+1)² − 4k = k² − 2k + 1 = (k−1)²。D>0 當 k ≠ 1。",
    },
    {
      no: 4,
      stem: "段考常見：拋物線 y = −x² + 6x − 5 與 x 軸圍成的區域，頂點在哪？最高點高度？",
      hint: "開口向下，頂點即最高點。",
      answer: "頂點 (3, 4)，最高點高度 4。",
    },
    {
      no: 5,
      stem: "應用：長方形圍籬三面靠牆，總長 24 公尺。寬為 x，面積 A(x) 寫出來，並求最大面積。",
      hint: "兩邊寬、一面長；A 是二次函數。",
      answer: "長 = 24−2x，A(x)=x(24−2x)=24x−2x²。頂點 x=6，A=72。",
    },
    {
      no: 6,
      stem: "把「圖形向右平移 2、上移 3」對 y=x² 寫出新方程式，並標出新頂點。",
      hint: "y − k = (x − h)²。",
      answer: "y = (x−2)² + 3，頂點 (2,3)。",
    },
  ];

  const pages = 2;
  for (let p = 0; p < pages; p++) {
    const page = doc.addPage([pageW, pageH]);
    page.drawRectangle({ x: 0, y: 0, width: pageW, height: pageH, color: paper });
    page.drawRectangle({ x: 0, y: pageH - 8, width: pageW, height: 8, color: ink });
    let y = pageH - 48;
    const draw = (text: string, size: number, color = ink, x = 48) => {
      page.drawText(text, { x, y, size, font, color });
      y -= size + 8;
    };
    draw("寬數週練", 11, steel);
    draw(opts.kind === "student" ? "學生題本" : "家長解答", 22, ink);
    draw(`${opts.week.week_label}　${opts.week.title}`, 12, ink);
    if (opts.child) {
      draw(
        `孩子：${opts.child.display_name}　年級：${opts.child.grade}　目標：${opts.child.exam_target}`,
        10,
        steel,
      );
    }
    y -= 6;
    page.drawLine({ start: { x: 48, y }, end: { x: pageW - 48, y }, thickness: 0.6, color: steel });
    y -= 18;

    if (p === 0) {
      wrap(
        page,
        font,
        opts.kind === "student"
          ? "本週只練一件事：把二次函數從「公式」拆成「圖形語言」。作答時請寫關鍵步驟，不必為了漂亮而抄完整解。卡住時把單元名寫進家長回饋即可。"
          : "這份給家長：對完對錯後，請看孩子卡在「配方／判別式／列式」哪一層。回饋三欄（難度、完成度、卡關單元）會直接進老師後台，用來調下一週的題距。",
        48,
        y,
        pageW - 96,
        11,
        ink,
      );
      y -= 64;
      const slice = problems.slice(0, 3);
      for (const q of slice) {
        y = drawQuestion(page, font, q, y, opts.kind, ink, steel);
      }
    } else {
      const slice = problems.slice(3);
      for (const q of slice) {
        y = drawQuestion(page, font, q, y, opts.kind, ink, steel);
      }
      y -= 8;
      wrap(
        page,
        font,
        "寬數｜吳寬老師　觀念拆細，路才走得穩。請跟老師討論，寄信 jjredick365@gmail.com",
        48,
        Math.max(y, 64),
        pageW - 96,
        9,
        steel,
      );
    }
    page.drawText(`${p + 1} / ${pages}`, {
      x: pageW - 72,
      y: 28,
      size: 9,
      font,
      color: steel,
    });
  }

  return Buffer.from(await doc.save());
}

function drawQuestion(
  page: PDFPage,
  font: PDFFont,
  q: { no: number; stem: string; hint: string; answer: string },
  y: number,
  kind: "student" | "parent",
  ink: RGB,
  steel: RGB
) {
  page.drawText(`題 ${q.no}`, { x: 48, y, size: 12, font, color: ink });
  y -= 20;
  y = wrap(page, font, q.stem, 48, y, 500, 11, ink) - 10;
  if (kind === "student") {
    y = wrap(page, font, `提示：${q.hint}`, 48, y, 500, 10, steel) - 8;
    page.drawText("作答：", { x: 48, y, size: 10, font, color: steel });
    y -= 14;
    for (let i = 0; i < 3; i++) {
      page.drawLine({
        start: { x: 48, y },
        end: { x: 547, y },
        thickness: 0.4,
        color: steel,
      });
      y -= 18;
    }
  } else {
    y = wrap(page, font, `解答：${q.answer}`, 48, y, 500, 11, ink) - 8;
    y = wrap(page, font, `思路：${q.hint}`, 48, y, 500, 10, steel) - 16;
  }
  return y - 6;
}

function wrap(
  page: PDFPage,
  font: PDFFont,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  size: number,
  color: RGB,
) {
  const chars = [...text];
  let line = "";
  for (const ch of chars) {
    const trial = line + ch;
    if (font.widthOfTextAtSize(trial, size) > maxWidth) {
      page.drawText(line, { x, y, size, font, color });
      y -= size + 4;
      line = ch;
    } else {
      line = trial;
    }
  }
  if (line) {
    page.drawText(line, { x, y, size, font, color });
    y -= size + 4;
  }
  return y;
}

export function newPdfId() {
  return uid("pdf");
}
