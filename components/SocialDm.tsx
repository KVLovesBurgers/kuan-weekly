import { SOCIAL } from "@/lib/config";

type Props = {
  keyword?: string;
  tone?: "dark" | "light";
  compact?: boolean;
};

/** IG／臉書粉專私訊按鈕（外開新分頁）。 */
export function SocialDm({ keyword = SOCIAL.weeklyKeyword, tone = "light", compact = false }: Props) {
  const cls = tone === "dark" ? "btn btn-ghost" : "btn btn-paper";
  return (
    <div className="dm-row">
      <a
        className={cls}
        href={SOCIAL.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <InstagramIcon />
        {compact ? "IG 私訊" : `IG 私訊「${keyword}」`}
        <span className="sr-only">（Instagram {SOCIAL.handle}，另開新分頁）</span>
      </a>
      <a
        className={cls}
        href={SOCIAL.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookIcon />
        {`臉書粉專 ${SOCIAL.facebookName}`}
        <span className="sr-only">（私訊「{keyword}」，另開新分頁）</span>
      </a>
    </div>
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

export function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
