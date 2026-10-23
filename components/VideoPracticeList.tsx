"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/track-client";
import type { VideoRow } from "@/lib/video-practice";

type Chip = { key: string; label: string };

/**
 * 影片練習題清單：搜尋（編號、標題、單元）＋依系列／依單元篩選。
 * 全部列都先在伺服器端輸出成 HTML，篩選只是顯示或隱藏，不載入任何額外套件。
 * 網址可帶 ?unit=<單元代號>、?kind=<系列>、?q=<搜尋字>，方便影片置頂留言直接指到某個單元。
 */
export function VideoPracticeList({ rows, kinds, units }: { rows: VideoRow[]; kinds: Chip[]; units: Chip[] }) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [unit, setUnit] = useState("all");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const u = p.get("unit");
    const k = p.get("kind");
    const s = p.get("q");
    if (u && units.some((x) => x.key === u)) setUnit(u);
    if (k && kinds.some((x) => x.key === k)) setKind(k);
    if (s) setQ(s.slice(0, 30));
  }, [kinds, units]);

  const src = () => new URLSearchParams(window.location.search).get("src")?.slice(0, 40) ?? "";

  const needle = q.trim().replace(/^#/, "").toLowerCase();
  const visible = useMemo(
    () =>
      new Set(
        rows
          .filter((r) => (kind === "all" || r.kind === kind) && (unit === "all" || r.unit === unit))
          .filter((r) => !needle || `${r.label} ${r.title} ${r.topic} ${r.unitTitle}`.toLowerCase().includes(needle))
          .map((r) => r.id),
      ),
    [rows, kind, unit, needle],
  );

  const chip = (c: Chip, cur: string, set: (k: string) => void) => (
    <button
      key={c.key}
      type="button"
      className={`vp-chip${cur === c.key ? " on" : ""}`}
      aria-pressed={cur === c.key}
      onClick={() => set(c.key)}
    >
      {c.label}
    </button>
  );

  return (
    <>
      <div className="vp-tools">
        <label className="vp-search">
          <span className="vp-sr">搜尋影片編號或標題</span>
          <input
            type="search"
            inputMode="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="輸入編號或關鍵字，例如 24、log、圓"
            maxLength={30}
            autoComplete="off"
          />
        </label>
        <p className="vp-group">依系列</p>
        <div className="vp-chips" role="group" aria-label="依系列篩選">
          {chip({ key: "all", label: "全部" }, kind, setKind)}
          {kinds.map((c) => chip(c, kind, setKind))}
        </div>
        <p className="vp-group">依單元</p>
        <div className="vp-chips" role="group" aria-label="依單元篩選">
          {chip({ key: "all", label: "全部單元" }, unit, setUnit)}
          {units.map((c) => chip(c, unit, setUnit))}
        </div>
      </div>

      <p className="vp-count" aria-live="polite">
        {visible.size === rows.length ? `共 ${rows.length} 支影片有練習題，新的在最上面` : `找到 ${visible.size} 支`}
      </p>

      <ul className="vp-list">
        {rows.map((r) => (
          <li key={r.id} className="card vp-card" hidden={!visible.has(r.id)}>
            <div className="vp-meta">
              <strong className="vp-no">{r.label}</strong>
              <span aria-hidden="true">·</span>
              <span>{r.date}</span>
            </div>
            <h3 className="display">{r.title}</h3>
            <p className="vp-tags">
              <span className="badge">{r.level}</span>
              <span className="badge vp-unit">{r.unitTitle}</span>
            </p>
            <a
              className="btn btn-ink vp-btn"
              href={r.href}
              target="_blank"
              rel="noopener"
              onClick={() => track("unit_pdf", r.id, src())}
            >
              開啟練習題（附詳解）
            </a>
          </li>
        ))}
      </ul>

      {visible.size === 0 && (
        <div className="card vp-empty">
          <p style={{ margin: 0 }}>找不到符合的影片。試試只輸入編號（例如 24），或按「全部」清掉篩選。</p>
          <p style={{ margin: "8px 0 0" }}>
            <button type="button" className="vp-chip on" onClick={() => { setQ(""); setKind("all"); setUnit("all"); }}>
              清除篩選
            </button>
          </p>
        </div>
      )}
    </>
  );
}
