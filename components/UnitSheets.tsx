import { Suspense } from "react";
import { UnitPdfLink } from "@/components/Tracking";
import type { PracticeSheet } from "@/lib/practice-sheets";
import { unitPdf, type UnitPack } from "@/lib/unit-packs";

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", month: "numeric", day: "numeric" }).format(new Date(iso));

/** 一份練習題卡片：按鈕走 /units/<slug>/pdf?sheet= 記錄後開 Drive 檔。 */
export function SheetCard({ unit, s }: { unit: string; s: PracticeSheet }) {
  return (
    <li className="card practice-card">
      <div className="practice-meta">
        <span className="badge">{s.level}</span>
        <span>{s.series}</span>
        <span aria-hidden="true">·</span>
        <span>{fmtDate(s.publishAt)}</span>
      </div>
      <h3 className="display">{s.title}</h3>
      <p className="muted">{s.topic}</p>
      <Suspense
        fallback={
          <a className="btn btn-ink practice-btn" href={`/units/${unit}/pdf?sheet=${s.driveId}`} target="_blank" rel="noopener">
            開啟練習題＋詳解
          </a>
        }
      >
        <UnitPdfLink slug={unit} sheet={s.driveId} className="btn btn-ink practice-btn">
          開啟練習題＋詳解
        </UnitPdfLink>
      </Suspense>
    </li>
  );
}

/** 單元包（3 題附詳解）卡片。 */
export function PackCard({ u }: { u: UnitPack }) {
  if (!u.pack) return null;
  return (
    <li className="card practice-card">
      <div className="practice-meta">
        <span className="badge">{u.level}</span>
        <span>單元包・3 題附詳解</span>
        <span aria-hidden="true">·</span>
        <span>PDF・{u.pack.pages} 頁</span>
      </div>
      <h3 className="display">{u.title} 單元包</h3>
      <ul style={{ margin: "0 0 16px", paddingLeft: 20, lineHeight: 1.8 }}>
        {u.pack.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <Suspense
        fallback={
          <a className="btn btn-ink practice-btn" href={unitPdf(u.slug)} target="_blank" rel="noopener">
            下載 3 題附詳解（PDF）
          </a>
        }
      >
        <UnitPdfLink slug={u.slug} className="btn btn-ink practice-btn">
          下載 3 題附詳解（PDF）
        </UnitPdfLink>
      </Suspense>
    </li>
  );
}
