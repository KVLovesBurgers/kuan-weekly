import katex from "katex";
import Link from "next/link";
import type { Lesson } from "@/lib/unit-lessons";

/** 把 $...$ 與 $$...$$ 轉成 KaTeX HTML（伺服器端，不送 JS）。 */
export function tex(s: string): string {
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return s
    .split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g)
    .map((part) => {
      if (part.startsWith("$$")) return katex.renderToString(part.slice(2, -2), { displayMode: true, throwOnError: true, output: "html" });
      if (part.startsWith("$")) return katex.renderToString(part.slice(1, -1), { throwOnError: true, output: "html" });
      return esc(part);
    })
    .join("");
}

/** 結構化資料用的純文字版本。 */
export function plain(s: string): string {
  return s
    .replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}/g, "$1/$2")
    .replace(/\\text\{([^}]*)\}/g, "$1").replace(/\\mid/g, "|").replace(/\\cup/g, "∪").replace(/\\cdots/g, "…").replace(/\\(left|right|big|,)/g, "")
    .replace(/\\log/g, "log").replace(/\\times/g, "×").replace(/\\le/g, "≤").replace(/\\approx/g, "≈").replace(/\\ldots/g, "…")
    .replace(/[$\\{}]/g, "");
}

const H = ({ html, as: Tag = "span" }: { html: string; as?: "span" | "p" | "li" }) => <Tag dangerouslySetInnerHTML={{ __html: tex(html) }} />;

export function UnitLesson({ lesson, slug }: { lesson: Lesson; slug: string }) {
  const src = `unit-${slug === "gsat-log" ? "log" : slug}`;
  return (
    <section className="lesson">
      <p className="muted">{lesson.intro}</p>
      {lesson.problems.map((p, i) => (
        <article key={i} className="lesson-q" id={`q${i + 1}`}>
          <h2>第 {i + 1} 題　{p.title}</h2>
          <H as="p" html={p.question} />
          <div className="lesson-sol">
            <p className="lesson-label">詳解</p>
            <ol>
              {p.steps.map((s, j) => (
                <H key={j} as="li" html={s} />
              ))}
            </ol>
            <p className="lesson-ans">
              答案　<H html={p.answer} />
            </p>
          </div>
        </article>
      ))}
      <article className="lesson-q lesson-mistakes">
        <h2>常見錯誤</h2>
        <ul>
          {lesson.mistakes.map((m, j) => (
            <H key={j} as="li" html={m} />
          ))}
        </ul>
      </article>
      <div className="lesson-btns">
        <Link className="btn btn-ink" href={`/quiz?src=${src}`}>做小卷</Link>
        <Link className="btn btn-steel" href={`/sample?src=${src}`}>免費試閱</Link>
      </div>
    </section>
  );
}
