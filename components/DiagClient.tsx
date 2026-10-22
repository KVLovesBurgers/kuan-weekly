"use client";

import { useEffect, useState, useTransition } from "react";
import { scoreDiag, unlockDiag, type DiagUnlock } from "@/app/actions/diag";
import { currentOrFirstTouch } from "@/lib/first-touch";
import { track } from "@/lib/track-client";
import type { DiagScore, DiagSet } from "@/lib/diag";

export type DiagSetView = {
  id: DiagSet;
  level: "國中" | "高中";
  label: string;
  scope: string;
  questions: { id: string; unit: string; stem: string; options: string[] }[];
};

/** 弱點單元 → 站上單元頁（有才連）。 */
const UNIT_PAGE: Record<string, { slug: string; name: string }> = {
  圓心角與圓周角: { slug: "jh-circle", name: "圓（國三）" },
  弦與弦心距: { slug: "jh-circle", name: "圓（國三）" },
  切線: { slug: "jh-circle", name: "圓（國三）" },
  圓內接四邊形: { slug: "jh-circle", name: "圓（國三）" },
  弧長與扇形: { slug: "jh-circle", name: "圓（國三）" },
  指數與對數: { slug: "gsat-log", name: "指數與對數" },
  排列組合: { slug: "prob", name: "排列組合與機率" },
  機率: { slug: "prob", name: "排列組合與機率" },
};

const Html = ({ html, as: Tag = "span", className }: { html: string; as?: "span" | "p" | "div"; className?: string }) => (
  <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

function readSrc() {
  if (typeof window === "undefined") return "";
  return currentOrFirstTouch().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
}

export function DiagClient({ sets }: { sets: DiagSetView[] }) {
  const [setId, setSetId] = useState<DiagSet | "">("");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<DiagScore | null>(null);
  const [unlocked, setUnlocked] = useState<DiagUnlock | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("家長");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [setId, idx, score]);

  const set = sets.find((s) => s.id === setId);

  const pick = (id: DiagSet) => {
    setSetId(id);
    setIdx(0);
    setAnswers({});
    setScore(null);
    setUnlocked(null);
    setError("");
    track("diag_start", id, readSrc());
  };

  if (!set) {
    return (
      <section className="quiz-intro">
        <p className="eyebrow">免費段考弱點檢測</p>
        <h1 className="quiz-title">第二次段考，先找出弱點單元</h1>
        <p className="quiz-lead">對應 11/25-26 第二次段考範圍，8 到 10 題單選，由簡到難，大約 10 分鐘。交卷馬上看到分數和弱點單元；留下 Email 就能看每題詳解，並拿到對應範圍的免費一週週練。</p>
        <h2 className="diag-h">國中</h2>
        <div className="quiz-pick">
          {sets.filter((s) => s.level === "國中").map((s) => (
            <button key={s.id} type="button" className="btn btn-ink quiz-pick-btn" onClick={() => pick(s.id)}>
              {s.label}・{s.questions.length} 題<span>{s.scope}</span>
            </button>
          ))}
        </div>
        <h2 className="diag-h">高中</h2>
        <div className="quiz-pick">
          {sets.filter((s) => s.level === "高中").map((s) => (
            <button key={s.id} type="button" className="btn btn-ink quiz-pick-btn" onClick={() => pick(s.id)}>
              {s.label}・{s.questions.length} 題<span>{s.scope}</span>
            </button>
          ))}
        </div>
        <p className="quiz-note">題目由吳寬老師（交大應數｜國中數學教師）新寫，每題答案都經過程式驗算。</p>
      </section>
    );
  }

  const qs = set.questions;
  const answered = qs.filter((q) => answers[q.id]).length;

  const submit = () => {
    setError("");
    if (answered < qs.length && !window.confirm(`還有 ${qs.length - answered} 題沒作答，確定要交卷嗎？`)) return;
    start(async () => {
      const r = await scoreDiag({ set: set.id, answers, src: readSrc() });
      if (!r.ok) { setError(r.error); return; }
      setScore(r.score);
    });
  };

  if (score) {
    const recs = [...new Map(score.weak.map((w) => UNIT_PAGE[w]).filter(Boolean).map((r) => [r.slug, r] as const)).values()];
    const onUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      start(async () => {
        const r = await unlockDiag({ set: set.id, answers, email, role, src: readSrc() });
        if (!r.ok) { setError(r.error); return; }
        setUnlocked(r.data);
      });
    };
    return (
      <section className="quiz-result">
        <p className="eyebrow">{set.label}段考弱點檢測・結果</p>
        <h1 className="quiz-title">{score.score} / {score.total} 題答對</h1>
        <div className="card quiz-units">
          <h2>各單元對錯</h2>
          <ul>
            {score.units.map((u) => (
              <li key={u.unit} className={u.correct < u.total ? "weak" : ""}>
                <span>{u.unit}</span>
                <span>{u.correct} / {u.total}</span>
              </li>
            ))}
          </ul>
          <p className="quiz-weak">
            {score.weak.length ? <>弱點單元：<strong>{score.weak.join("、")}</strong>。段考前建議先從{score.weak.length === 1 ? "這個" : "這幾個"}單元補起。</> : "每個單元都答對了，段考前維持練習手感就好。"}
          </p>
          {recs.length ? (
            <div className="quiz-recs">
              <p>站上的單元重點：</p>
              <ul>{recs.map((r) => <li key={r.slug}><a className="u" href={`/units/${r.slug}?src=diag-result`}>{r.name}</a></li>)}</ul>
            </div>
          ) : null}
        </div>

        {!unlocked ? (
          <form className="quiz-submit card" onSubmit={onUnlock} id="unlock">
            <h2 className="diag-h" style={{ margin: 0 }}>看每題詳解＋領免費一週週練</h2>
            <p className="quiz-note" style={{ fontSize: 15 }}>留下 Email，馬上在這頁看到每題詳解，並拿到 {set.label} 第二次段考範圍的一週週練（學生題本＋家長解答）。</p>
            <div className="diag-role" role="radiogroup" aria-label="身分">
              {["家長", "學生"].map((r) => (
                <label key={r} className={`quiz-opt${role === r ? " on" : ""}`}>
                  <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} />
                  <span>我是{r}</span>
                </label>
              ))}
            </div>
            <label htmlFor="diag-email" className="quiz-email-label">Email</label>
            <input id="diag-email" type="email" required inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="quiz-note">只用來寄寬數週練的練習資訊，不會給其他人。</p>
            {error && <p className="quiz-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-ink quiz-go" disabled={pending}>{pending ? "處理中…" : "看詳解、領週練"}</button>
          </form>
        ) : (
          <>
            {unlocked.packs.length ? (
              <div className="card quiz-cta" id="week">
                <h2 className="diag-h" style={{ margin: 0 }}>免費一週週練</h2>
                {unlocked.packs.map((p) => (
                  <div key={p.student} className="diag-pack">
                    <p><strong>{p.label}</strong>・{p.unit}</p>
                    <div className="diag-pack-btns">
                      <a className="btn btn-ink" href={p.student} target="_blank" rel="noopener">學生題本 PDF</a>
                      <a className="btn btn-paper" href={p.parent} target="_blank" rel="noopener">家長解答 PDF</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="quiz-note">週練連結暫時無法產生，請稍後重新整理再試一次。</p>
            )}
            <h2 className="quiz-h2">每題詳解</h2>
            <ol className="quiz-list">
              {qs.map((q, i) => {
                const d = unlocked.details.find((x) => x.id === q.id)!;
                return (
                  <li key={q.id} className={`quiz-q card ${d.correct ? "ok" : "ng"}`}>
                    <p className="quiz-meta">第 {i + 1} 題・{q.unit}・{d.correct ? "答對" : "答錯"}</p>
                    <Html as="p" className="quiz-stem" html={q.stem} />
                    <p className="quiz-ans">
                      你的答案：{d.chosen ? <>({d.chosen}) <Html html={q.options[d.chosen - 1]} /></> : "未作答"}
                      <br />正確答案：({d.answer}) <Html html={q.options[d.answer - 1]} />
                    </p>
                    <Html as="p" className="quiz-exp" html={d.explanation} />
                  </li>
                );
              })}
            </ol>
          </>
        )}
        <div className="quiz-cta-end">
          <button type="button" className="btn btn-paper" onClick={() => setSetId("")}>做其他年級</button>
        </div>
      </section>
    );
  }

  const q = qs[idx];
  const last = idx === qs.length - 1;
  return (
    <section className="diag-run">
      <div className="quiz-bar">
        <button type="button" className="quiz-back" onClick={() => setSetId("")}>換年級</button>
        <strong>{set.label}段考檢測</strong>
        <span>已答 {answered}/{qs.length}</span>
      </div>
      <div className="diag-progress" aria-hidden><span style={{ width: `${((idx + 1) / qs.length) * 100}%` }} /></div>
      <div className="quiz-q card" key={q.id}>
        <p className="quiz-meta">第 {idx + 1} 題 / 共 {qs.length} 題・{q.unit}</p>
        <Html as="p" className="quiz-stem" html={q.stem} />
        <div className="quiz-opts" role="radiogroup">
          {q.options.map((o, j) => (
            <label key={j} className={`quiz-opt${answers[q.id] === j + 1 ? " on" : ""}`}>
              <input type="radio" name={q.id} checked={answers[q.id] === j + 1} onChange={() => setAnswers((a) => ({ ...a, [q.id]: j + 1 }))} />
              <span className="quiz-num">({j + 1})</span>
              <Html html={o} />
            </label>
          ))}
        </div>
      </div>
      {error && <p className="quiz-error" role="alert">{error}</p>}
      <div className="diag-nav">
        <button type="button" className="btn btn-paper" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>上一題</button>
        {last ? (
          <button type="button" className="btn btn-ink" disabled={pending} onClick={submit}>{pending ? "批改中…" : "交卷看結果"}</button>
        ) : (
          <button type="button" className="btn btn-ink" onClick={() => setIdx(idx + 1)}>{answers[q.id] ? "下一題" : "先跳過"}</button>
        )}
      </div>
    </section>
  );
}
