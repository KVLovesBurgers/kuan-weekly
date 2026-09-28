import { SOCIAL } from "@/lib/config";

type Props = {
  keyword?: string;
  tone?: "dark" | "light";
  compact?: boolean;
};

/** Threads／IG 私訊按鈕（外開新分頁）。 */
export function SocialDm({ keyword = SOCIAL.weeklyKeyword, tone = "light", compact = false }: Props) {
  const cls = tone === "dark" ? "btn btn-ghost" : "btn btn-paper";
  return (
    <div className="dm-row">
      <a
        className={cls}
        href={SOCIAL.threadsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`到 Threads ${SOCIAL.handle} 私訊「${keyword}」（另開新分頁）`}
      >
        <ThreadsIcon />
        {compact ? "Threads" : `Threads 私訊「${keyword}」`}
      </a>
      <a
        className={cls}
        href={SOCIAL.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`到 Instagram ${SOCIAL.handle} 私訊「${keyword}」（另開新分頁）`}
      >
        <InstagramIcon />
        {compact ? "Instagram" : `IG 私訊「${keyword}」`}
      </a>
    </div>
  );
}

export function ThreadsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </svg>
  );
}
