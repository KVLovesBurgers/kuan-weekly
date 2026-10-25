/** first-touch 來源：第一次帶 ?src= 進站時記在 localStorage＋cookie（kw_ft_src，90 天），之後不覆蓋。 */
export const FT_KEY = "kw_ft_src";

function clean(raw: unknown) {
  const s = String(raw ?? "").trim().toLowerCase();
  return /^[a-z0-9_-]{1,40}$/.test(s) ? s : "";
}

export function readFirstTouch(): string {
  if (typeof window === "undefined") return "";
  try {
    const v = clean(window.localStorage.getItem(FT_KEY));
    if (v) return v;
  } catch {}
  const m = document.cookie.match(/(?:^|;\s*)kw_ft_src=([^;]+)/);
  return m ? clean(decodeURIComponent(m[1])) : "";
}

export function rememberFirstTouch(raw: unknown) {
  const v = clean(raw);
  if (!v || typeof window === "undefined" || readFirstTouch()) return;
  try { window.localStorage.setItem(FT_KEY, v); } catch {}
  document.cookie = `${FT_KEY}=${encodeURIComponent(v)}; path=/; max-age=7776000; SameSite=Lax`;
}

/** 網址 src 優先，否則 first-touch。 */
export function currentOrFirstTouch(): string {
  if (typeof window === "undefined") return "";
  return clean(new URLSearchParams(window.location.search).get("src")) || readFirstTouch();
}
