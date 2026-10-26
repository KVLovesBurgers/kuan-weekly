"use client";

import { useEffect, useMemo, useState } from "react";
import type { PracticeFacet, VideoPractice } from "@/data/videos-practice";

export function VideoPracticeList({
  rows,
  kinds,
  units,
  grades,
}: {
  rows: VideoPractice[];
  kinds: PracticeFacet[];
  units: PracticeFacet[];
  grades: PracticeFacet[];
}) {
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("all");
  const [kind, setKind] = useState("all");
  const [unit, setUnit] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const unitQ = params.get("unit");
    const kindQ = params.get("kind");
    const gradeQ = params.get("grade");
    const text = params.get("q");
    if (unitQ && units.some((item) => item.key === unitQ)) setUnit(unitQ);
    if (gradeQ && grades.some((item) => item.key === gradeQ)) setGrade(gradeQ);
    if (kindQ && kinds.some((item) => item.key === kindQ)) setKind(kindQ);
    if (text) setQ(text.slice(0, 30));
  }, [kinds, units, grades]);

  const needle = q.trim().replace(/^#/, "").toLowerCase();
  const shown = useMemo(() => {
    return new Set(
      rows
        .filter((row) => (grade === "all" || row.grade === grade) && (kind === "all" || row.kind === kind) && (unit === "all" || row.unit === unit))
        .filter((row) => {
          if (!needle) return true;
          return `${row.label} ${row.title} ${row.topic} ${row.unitTitle}`.toLowerCase().includes(needle);
        })
        .map((row) => row.id),
    );
  }, [rows, grade, kind, unit, needle]);

  function chip(item: { key: string; label: string }, current: string, set: (key: string) => void) {
    const on = current === item.key;
    return (
      <button key={item.key} type="button" className={on ? "vp-chip on" : "vp-chip"} aria-pressed={on} onClick={() => set(item.key)}>
        {item.label}
      </button>
    );
  }

  return (
    <>
      <div className="vp-tools">
        <label className="vp-search">
          <span className="vp-sr">搜尋影片編號或標題</span>
          <input
            type="search"
            inputMode="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="輸入編號或關鍵字，例如 24、log、圓"
            maxLength={30}
            autoComplete="off"
          />
        </label>
        <p className="vp-group">依年級（依 108 課綱）</p>
        <div className="vp-chips" role="group" aria-label="依年級篩選">
          {chip({ key: "all", label: "全部年級" }, grade, setGrade)}
          {grades.map((item) => chip(item, grade, setGrade))}
        </div>
        <p className="vp-group">依系列</p>
        <div className="vp-chips" role="group" aria-label="依系列篩選">
          {chip({ key: "all", label: "全部" }, kind, setKind)}
          {kinds.map((item) => chip(item, kind, setKind))}
        </div>
        <p className="vp-group">依單元</p>
        <div className="vp-chips" role="group" aria-label="依單元篩選">
          {chip({ key: "all", label: "全部單元" }, unit, setUnit)}
          {units.map((item) => chip(item, unit, setUnit))}
        </div>
      </div>
      <p className="vp-count" aria-live="polite">
        {shown.size === rows.length ? `共 ${rows.length} 支影片有練習題，新的在最上面` : `找到 ${shown.size} 支`}
      </p>
      <ul className="vp-list">
        {rows.map((row) => (
          <li key={row.id} className="card vp-card" hidden={!shown.has(row.id)}>
            <div className="vp-meta">
              <strong className="vp-no">{row.label}</strong>
              <span aria-hidden="true">·</span>
              <span>{row.date}</span>
            </div>
            <h3 className="display">{row.title}</h3>
            <p className="vp-tags">
              <span className="badge">{row.grade}</span>
              <span className="badge vp-unit">{row.unitTitle}</span>
            </p>
            <a className="btn btn-ink vp-btn" href={row.href} target="_blank" rel="noopener">
              開啟練習題（附解答）
            </a>
          </li>
        ))}
      </ul>
      {shown.size === 0 ? (
        <div className="card vp-empty">
          <p style={{ margin: 0 }}>找不到符合的影片。試試只輸入編號（例如 24），或按「全部」清掉篩選。</p>
          <p style={{ margin: "8px 0 0" }}>
            <button
              type="button"
              className="vp-chip on"
              onClick={() => {
                setQ("");
                setGrade("all");
                setKind("all");
                setUnit("all");
              }}
            >
              清除篩選
            </button>
          </p>
        </div>
      ) : null}
    </>
  );
}
