"use client";

import { useState } from "react";

/** 輕量 YouTube：先顯示縮圖，點了才載入 iframe。 */
export function LiteYouTube({ id, title, note }: { id: string; title: string; note?: string }) {
  const [on, setOn] = useState(false);
  return (
    <figure className="short-card">
      <div className="short-frame">
        {on ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className="short-play" onClick={() => setOn(true)} aria-label={`播放影片：${title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              width={480}
              height={360}
              loading="lazy"
              decoding="async"
            />
            <span className="short-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption>
        <strong>{title}</strong>
        {note ? <span className="muted">{note}</span> : null}
        <a
          className="short-link"
          href={`https://www.youtube.com/shorts/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          在 YouTube 開啟
        </a>
      </figcaption>
    </figure>
  );
}
