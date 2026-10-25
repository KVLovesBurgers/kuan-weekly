"use client";

import { useEffect, useState, useTransition } from "react";
import { track } from "@vercel/analytics";
import { submitQuiz } from "@/app/actions/quiz";
import { currentOrFirstTouch } from "@/lib/first-touch";
import type { PublicQuestion, QuizResult, QuizSubject } from "@/lib/quiz";

/** 小卷單元 → 單元詳解頁。 */
const QUIZ_UNIT_PAGE: Record<string, { slug: string; name: string }> = {
  指數對數: { slug: "gsat-log", name: "指數與對數" },
  排列組合: { slug: "prob", name: "排列組合與機率" },
  機率: { slug: "prob", name: "排列組合與機率" },
  三角: { slug: "trig", name: "三角函數" },
  向量: { slug: "vector", name: "向量" },
  數列: { slug: "series", name: "數列與級數" },
  直線與圓: { slug: "circle-eq", name: "圓方程式" },
};

const IG_DM = "https://ig.me/m/saber_math";

function readSrc(): string {
  if (typeof window === "undefined") return "";
  const v = currentOrFirstTouch();
  return v.replace(/[^a-zA-Z0-9_\-.]/g, "").slice(0, 40);
}

export function QuizClient({ sets }: { sets: Record<QuizSubject, PublicQuestion[]> }) {
  const src = readSrc();
  const [subject, setSubject] = useState<QuizSubject | "">("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<QuizResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  useEffect(() => { const t = setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }), 0); return () => clearTimeout(t); }, [subject, result]);

  const pick = (s: QuizSubject) => {
    setSubject(s);
    setAnswers({});
    setResult(null);
    setError("");
    try { track("quiz_start", { subject: s, src: src || "direct" }); } catch {}
  };

  if (!subject) {
    return (
      <section className="quiz-intro">
        <p className="eyebrow">免費線上小卷</p>
        <h1 className="quiz-title">學測數學模擬小卷</h1>
        <p className="quiz-lead">10 題單選，大約 15 分鐘。交卷後馬上看到分數、各單元對錯、弱點單元，還有每一題的詳解。</p>
        <div className="quiz-pick">
          <button type="button" className="btn btn-ink quiz-pick-btn" onClick={() => pick("數A")}>
            數A 小卷<span>指數對數・三角・向量・排列組合・機率</span>
          </button>
          <button type="button" className="btn btn-ink quiz-pick-btn" onClick={() => pick("數B")}>
            數B 小卷<span>多項式・直線與圓・數列・排列組合・機率</span>
          </button>
        </div>
        <p className="quiz-note">題目由吳寬老師新寫，對應 108 課綱學測範圍。</p>
      </section>
    );
  }

  const qs = sets[subject];
  const answered = qs.filter((q) => answers[q.id]).length;

  if (result) return <QuizResultView result={result} saved={saved} onRetry={() => setSubject("")} />;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (answered < qs.length && !window.confirm(`還有 ${qs.length - answered} 題沒作答，確定要交卷嗎？`)) return;
    start(async () => {
      const r = await submitQuiz({ subject, email, answers, src });
      if (!r.ok) { setError(r.error); return; }
      try { track("quiz_submit", { subject, score: r.result.score, src: src || "direct" }); } catch {}
      setSaved(r.saved);
      setResult(r.result);
    });
  };

  return (
    <form className="quiz-form" onSubmit={onSubmit}>
      <div className="quiz-bar">
        <button type="button" className="quiz-back" onClick={() => setSubject("")}>換科目</button>
        <strong>學測{subject}小卷</strong>
        <span>{answered}/{qs.length}</span>
      </div>
      <ol className="quiz-list">
        {qs.map((q, i) => (
          <li key={q.id} className="quiz-q card">
            <p className="quiz-meta">第 {i + 1} 題・{q.unit}</p>
            <p className="quiz-stem">{q.stem}</p>
            <div className="quiz-opts" role="radiogroup">
              {q.options.map((o, j) => (
                <label key={j} className={`quiz-opt${answers[q.id] === j + 1 ? " on" : ""}`}>
                  <input type="radio" name={q.id} checked={answers[q.id] === j + 1} onChange={() => setAnswers((a) => ({ ...a, [q.id]: j + 1 }))} />
                  <span className="quiz-num">({j + 1})</span>
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="quiz-submit card">
        <label htmlFor="quiz-email" className="quiz-email-label">留下 Email 看結果與詳解</label>
        <input id="quiz-email" type="email" required inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <p className="quiz-note">只用來寄寬數週練的練習資訊，不會給其他人。</p>
        {error && <p className="quiz-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-ink quiz-go" disabled={pending}>{pending ? "批改中…" : "交卷"}</button>
      </div>
    </form>
  );
}

function QuizResultView({ result, saved, onRetry }: { result: QuizResult; saved: boolean; onRetry: () => void }) {
  return (
    <section className="quiz-result" data-saved={saved ? "1" : "0"}>
      <p className="eyebrow">學測{result.subject}小卷・結果</p>
      <h1 className="quiz-title">{result.score} / {result.total} 題答對</h1>
      <div className="card quiz-units">
        <h2>各單元對錯</h2>
        <ul>
          {result.units.map((u) => (
            <li key={u.unit} className={u.correct < u.total ? "weak" : ""}>
              <span>{u.unit}</span>
              <span>{u.correct} / {u.total}</span>
            </li>
          ))}
        </ul>
        <p className="quiz-weak">
          {result.weak.length ? <>弱點單元：<strong>{result.weak.join("、")}</strong>，建議先從這幾個單元補起。</> : "這次每個單元都答對了，可以挑戰完整一回。"}
        </p>
        {(() => {
          const recs = [...new Map(result.weak.map((w) => QUIZ_UNIT_PAGE[w]).filter(Boolean).map((r) => [r.slug, r] as const)).values()];
          return recs.length ? (
            <div className="quiz-recs">
              <p>先看這幾個單元的詳解：</p>
              <ul>
                {recs.map((r) => (
                  <li key={r.slug}>
                    <a className="u" href={`/units/${r.slug}?src=quiz-result`}>{r.name}：題目與完整詳解</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null;
        })()}
      </div>
      <div className="card quiz-cta">
        <p>想練完整一回，私訊 IG @saber_math 留言「猜題卷」拿第 1 回選擇題試閱。</p>
        <a className="btn btn-ink" href={IG_DM} target="_blank" rel="noopener noreferrer">私訊 IG @saber_math</a>
      </div>
      <h2 className="quiz-h2">每題詳解</h2>
      <ol className="quiz-list">
        {result.items.map((it, i) => (
          <li key={it.id} className={`quiz-q card ${it.correct ? "ok" : "ng"}`}>
            <p className="quiz-meta">第 {i + 1} 題・{it.unit}・{it.correct ? "答對" : "答錯"}</p>
            <p className="quiz-stem">{it.stem}</p>
            <p className="quiz-ans">你的答案：{it.chosen ? `(${it.chosen}) ${it.options[it.chosen - 1]}` : "未作答"}<br />正確答案：({it.answer}) {it.options[it.answer - 1]}</p>
            <p className="quiz-exp">{it.explanation}</p>
          </li>
        ))}
      </ol>
      <div className="quiz-cta-end">
        <a className="btn btn-ink" href={IG_DM} target="_blank" rel="noopener noreferrer">私訊 IG 拿猜題卷試閱</a>
        <button type="button" className="btn btn-paper" onClick={onRetry}>再做另一科</button>
      </div>
      <p className="muted" style={{ marginTop: 16 }}>
        想每週固定練一份有詳解的題目，可以先<a className="u" href="/sample?track=gsat">免費下載一週題本試閱</a>。
      </p>
    </section>
  );
}
