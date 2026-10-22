"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { scoreMock, unlockMock, type MockUnlock } from "@/app/actions/mock";
import { currentOrFirstTouch } from "@/lib/first-touch";
import { track } from "@/lib/track-client";
import type { MockAnswer, MockPhase, MockScore, MockSubject, MockType } from "@/lib/mock";

export type MockQView = { id: string; no: number; type: MockType; points: number; unit: string; stem: string; options: string[] | null; format: string | null; cells: number; group: string | null };
export type MockSetView = { id: MockSubject; label: string; scope: string; questions: MockQView[] };

const Html = ({ html, as: Tag = "span", className }: { html: string; as?: "span" | "p" | "div"; className?: string }) => (
  <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
);
const TYPE_NAME: Record<MockType, string> = { single: "單選", multi: "多選", fill: "選填" };
const KEY = "kw_mock_v1";

function readSrc() {
  if (typeof window === "undefined") return "";
  return currentOrFirstTouch().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
}
const fmtTime = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const showAns = (q: MockQView, a: MockAnswer | null) => {
  if (a === null || a === undefined || (typeof a === "string" && !a.trim())) return "未作答";
  if (q.type === "single") return `(${a})`;
  if (q.type === "multi") return (a as number[]).map((n) => `(${n})`).join("");
  return (a as string).split("").map((c, i) => `${q.no}-${i + 1}：${c.trim() || "空"}`).join("，");
};

export function MockClient({ sets, phase, minutes, openLabel }: { sets: MockSetView[]; phase: MockPhase; minutes: number; openLabel: string }) {
  const [subj, setSubj] = useState<MockSubject | "">("");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, MockAnswer>>({});
  const [startAt, setStartAt] = useState(0);
  const [now, setNow] = useState(0);
  const [score, setScore] = useState<MockScore | null>(null);
  const [unlocked, setUnlocked] = useState<MockUnlock | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("學生");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [pending, start] = useTransition();
  const submitted = useRef(false);

  useEffect(() => {
    setPreview(new URLSearchParams(window.location.search).get("preview") === "1");
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved && (saved.subj === "A" || saved.subj === "B") && Date.now() - saved.startAt < minutes * 60000) {
        setSubj(saved.subj); setAnswers(saved.answers || {}); setStartAt(saved.startAt);
      }
    } catch { /* 忽略 */ }
  }, [minutes]);
  useEffect(() => {
    if (subj && startAt && !score) localStorage.setItem(KEY, JSON.stringify({ subj, answers, startAt }));
  }, [subj, answers, startAt, score]);
  useEffect(() => {
    if (!subj || score) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [subj, score]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [subj, idx, score]);

  const set = sets.find((s) => s.id === subj);
  const left = startAt ? startAt + minutes * 60000 - now : minutes * 60000;
  const canStart = phase !== "before" || preview;

  const doSubmit = (timedOut: boolean) => {
    if (!set || submitted.current) return;
    submitted.current = true;
    setError("");
    start(async () => {
      const r = await scoreMock({ subject: set.id, answers, src: readSrc(), timedOut });
      if (!r.ok) { setError(r.error); submitted.current = false; return; }
      localStorage.removeItem(KEY);
      setScore(r.score);
    });
  };
  useEffect(() => {
    if (set && startAt && now && left <= 0 && !score) doSubmit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left <= 0]);

  const answeredCount = useMemo(() => (set ? set.questions.filter((q) => { const a = answers[q.id]; return a !== undefined && !(Array.isArray(a) && !a.length) && !(typeof a === "string" && !a.trim()); }).length : 0), [set, answers]);

  const pick = (id: MockSubject) => {
    submitted.current = false;
    setSubj(id); setIdx(0); setAnswers({}); setScore(null); setUnlocked(null); setError("");
    const t = Date.now(); setStartAt(t); setNow(t);
    track("mock_start", id, readSrc());
  };
  const quit = () => {
    if (!score && !window.confirm("離開後這次作答會清除，確定要離開嗎？")) return;
    localStorage.removeItem(KEY);
    setSubj(""); setScore(null); setUnlocked(null); setStartAt(0);
  };

  if (!set) {
    return (
      <section className="quiz-intro">
        <p className="eyebrow">學測數學 免費線上模擬考</p>
        <h1 className="quiz-title">學測數學全真模擬，100 分鐘線上作答</h1>
        <p className="quiz-lead">數學A、數學B 各一份，題型與配分比照近年學測：單選、多選、選填與混合題組，共 20 題、滿分 100 分，題目由易到難。時間到自動交卷，馬上看到總分、估算級分與各單元得分；留下 Email 就能看每題詳解與弱點分析。</p>
        <div className="card mock-when">
          <p><strong>全國統一開放：{openLabel}</strong></p>
          <p className="quiz-note" style={{ fontSize: 14 }}>{phase === "before" ? "開放前可以先收藏這一頁。統一開放結束後，改為隨時都可以考。" : phase === "event" ? "現在是統一開放期間，同一個週末一起考。" : "統一開放已結束，現在隨時都可以考。"}</p>
          {phase === "before" && preview ? <p className="quiz-error">預覽模式：開放前測試用。</p> : null}
        </div>
        <div className="quiz-pick">
          {sets.map((s) => (
            <button key={s.id} type="button" className="btn btn-ink quiz-pick-btn" disabled={!canStart} onClick={() => pick(s.id)}>
              {s.label}・{s.questions.length} 題・{minutes} 分鐘<span>{s.scope}</span>
            </button>
          ))}
        </div>
        <ul className="mock-rules">
          <li>開始後計時 {minutes} 分鐘，重新整理不會重新計時；時間到自動交卷。</li>
          <li>多選題依學測規則計分：每題 5 個選項，答錯 k 個選項得 (5−2k)/5 的分數。</li>
          <li>選填題每一格填一個數字或負號，全部格子都對才給分。</li>
          <li>混合題組在學測有手寫非選擇題，線上版改成選填作答，配分不變。</li>
          <li>級分是依總分等距換算的估算，正式級分依當年考生成績換算。</li>
        </ul>
        <p className="quiz-note">題目由吳寬老師新寫（交大應數畢業｜現任國中數學教師），每題答案都經過程式驗算。</p>
      </section>
    );
  }

  const qs = set.questions;

  if (score) {
    const onUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      start(async () => {
        const r = await unlockMock({ subject: set.id, answers, email, role, src: readSrc() });
        if (!r.ok) { setError(r.error); return; }
        setUnlocked(r.data);
      });
    };
    return (
      <section className="quiz-result">
        <p className="eyebrow">學測{set.label}模擬考・結果</p>
        <h1 className="quiz-title">{score.score} / 100 分</h1>
        <p className="mock-level">估算級分：<strong>{score.level} 級分</strong><span className="quiz-note">（依總分等距換算，僅供參考）</span></p>
        <div className="card quiz-units">
          <h2>各題型得分</h2>
          <ul>{score.parts.map((p) => <li key={p.name}><span>{p.name}</span><span>{p.got} / {p.full}</span></li>)}</ul>
        </div>
        <div className="card quiz-units">
          <h2>各單元得分</h2>
          <ul>{score.units.map((u) => <li key={u.unit} className={u.got / u.full < 0.6 ? "weak" : ""}><span>{u.unit}</span><span>{u.got} / {u.full}</span></li>)}</ul>
          <p className="quiz-weak">{score.weak.length ? <>得分率低於六成的單元：<strong>{score.weak.join("、")}</strong>。建議先從這些單元複習。</> : "每個單元得分率都在六成以上，維持手感，多練後段難題。"}</p>
        </div>
        {!unlocked ? (
          <form className="quiz-submit card" onSubmit={onUnlock} id="unlock">
            <h2 className="diag-h" style={{ margin: 0 }}>看每題詳解與弱點分析</h2>
            <p className="quiz-note" style={{ fontSize: 15 }}>留下 Email，馬上在這頁看到 20 題詳解、你的作答與每題得分。</p>
            <div className="diag-role" role="radiogroup" aria-label="身分">
              {["學生", "家長"].map((r) => (
                <label key={r} className={`quiz-opt${role === r ? " on" : ""}`}>
                  <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} />
                  <span>我是{r}</span>
                </label>
              ))}
            </div>
            <label htmlFor="mock-email" className="quiz-email-label">Email</label>
            <input id="mock-email" type="email" required inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="quiz-note">只用來寄寬數週練的練習資訊，不會給其他人。</p>
            {error && <p className="quiz-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-ink quiz-go" disabled={pending}>{pending ? "處理中…" : "看詳解"}</button>
          </form>
        ) : (
          <>
            <h2 className="quiz-h2">每題詳解</h2>
            <ol className="quiz-list">
              {qs.map((q) => {
                const d = unlocked.details.find((x) => x.id === q.id)!;
                return (
                  <li key={q.id} className={`quiz-q card ${d.got === d.full ? "ok" : "ng"}`}>
                    <p className="quiz-meta">第 {q.no} 題・{TYPE_NAME[q.type]}・{q.unit}・得 {d.got} / {d.full} 分</p>
                    {q.group && (q.no === 18) ? <Html as="p" className="mock-group" html={q.group} /> : null}
                    <Html as="p" className="quiz-stem" html={q.stem} />
                    {q.options ? <ol className="mock-optlist">{q.options.map((o, j) => <li key={j}>({j + 1}) <Html html={o} /></li>)}</ol> : null}
                    <p className="quiz-ans">你的答案：{showAns(q, d.chosen)}<br />正確答案：{showAns(q, d.answer)}</p>
                    <Html as="p" className="quiz-exp" html={d.explanation} />
                  </li>
                );
              })}
            </ol>
          </>
        )}
        <div className="quiz-cta-end">
          <button type="button" className="btn btn-paper" onClick={quit}>回到模擬考首頁</button>
        </div>
      </section>
    );
  }

  const q = qs[idx];
  const last = idx === qs.length - 1;
  const cur = answers[q.id];
  const setA = (v: MockAnswer) => setAnswers((a) => ({ ...a, [q.id]: v }));
  const fillStr = typeof cur === "string" ? cur.padEnd(q.cells, " ") : " ".repeat(q.cells);
  return (
    <section className="diag-run">
      <div className="quiz-bar">
        <button type="button" className="quiz-back" onClick={quit}>離開</button>
        <strong className={left < 5 * 60000 ? "mock-timer warn" : "mock-timer"} aria-live="off">剩 {fmtTime(left)}</strong>
        <span>已答 {answeredCount}/{qs.length}</span>
      </div>
      <nav className="mock-nav" aria-label="題號">
        {qs.map((x, i) => {
          const a = answers[x.id];
          const done = a !== undefined && !(Array.isArray(a) && !a.length) && !(typeof a === "string" && !a.trim());
          return <button key={x.id} type="button" className={`${i === idx ? "cur " : ""}${done ? "done" : ""}`} onClick={() => setIdx(i)} aria-label={`第 ${x.no} 題${done ? "，已作答" : ""}`}>{x.no}</button>;
        })}
      </nav>
      <div className="quiz-q card" key={q.id}>
        <p className="quiz-meta">第 {q.no} 題・{TYPE_NAME[q.type]}{q.group ? "（混合題組）" : ""}・{q.points} 分</p>
        {q.group ? <Html as="p" className="mock-group" html={q.group} /> : null}
        <Html as="p" className="quiz-stem" html={q.stem} />
        {q.type === "single" && q.options ? (
          <div className="quiz-opts" role="radiogroup">
            {q.options.map((o, j) => (
              <label key={j} className={`quiz-opt${cur === j + 1 ? " on" : ""}`}>
                <input type="radio" name={q.id} checked={cur === j + 1} onChange={() => setA(j + 1)} />
                <span className="quiz-num">({j + 1})</span>
                <Html html={o} />
              </label>
            ))}
          </div>
        ) : null}
        {q.type === "multi" && q.options ? (
          <div className="quiz-opts">
            {q.options.map((o, j) => {
              const arr = Array.isArray(cur) ? cur : [];
              const on = arr.includes(j + 1);
              return (
                <label key={j} className={`quiz-opt${on ? " on" : ""}`}>
                  <input type="checkbox" checked={on} onChange={() => setA(on ? arr.filter((n) => n !== j + 1) : [...arr, j + 1].sort())} />
                  <span className="quiz-num">({j + 1})</span>
                  <Html html={o} />
                </label>
              );
            })}
          </div>
        ) : null}
        {q.type === "fill" ? (
          <div className="mock-fill">
            {q.format ? <p className="quiz-note">答案格式：<Html html={q.format} /></p> : null}
            <div className="mock-cells">
              {Array.from({ length: q.cells }, (_, i) => (
                <label key={i}>
                  <span>{q.no}-{i + 1}</span>
                  <input
                    inputMode="numeric" maxLength={1} aria-label={`${q.no}-${i + 1}`} value={fillStr[i].trim()}
                    onChange={(e) => {
                      const c = e.target.value.replace(/[^0-9-]/g, "").slice(-1) || " ";
                      setA((fillStr.slice(0, i) + c + fillStr.slice(i + 1)));
                      if (c !== " ") (e.target.parentElement?.nextElementSibling?.querySelector("input") as HTMLInputElement | null)?.focus();
                    }}
                  />
                </label>
              ))}
            </div>
            <p className="quiz-note">每格填一個數字（0–9）或負號。</p>
          </div>
        ) : null}
      </div>
      {error && <p className="quiz-error" role="alert">{error}</p>}
      <div className="diag-nav">
        <button type="button" className="btn btn-paper" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>上一題</button>
        {last ? (
          <button type="button" className="btn btn-ink" disabled={pending} onClick={() => { if (answeredCount < qs.length && !window.confirm(`還有 ${qs.length - answeredCount} 題沒作答，確定要交卷嗎？`)) return; doSubmit(false); }}>{pending ? "批改中…" : "交卷"}</button>
        ) : (
          <button type="button" className="btn btn-ink" onClick={() => setIdx(idx + 1)}>下一題</button>
        )}
      </div>
      <button type="button" className="btn btn-paper mock-early" disabled={pending} onClick={() => { if (!window.confirm(`確定要現在交卷嗎？${answeredCount < qs.length ? `還有 ${qs.length - answeredCount} 題沒作答。` : ""}`)) return; doSubmit(false); }}>提前交卷</button>
    </section>
  );
}
