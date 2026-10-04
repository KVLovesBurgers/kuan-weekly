export const LEAD_COOKIE = "kw_sample";

export const LEAD_GRADES = ["國一", "國二", "國三", "高一", "高二", "高三"] as const;
export const LEAD_ROLES = ["家長", "學生"] as const;

/** ?src= 只收英數、底線、連字號，最多 40 字（例：yt-short、yt-long、fb、ig）。 */
export function cleanSrc(raw: unknown) {
  const s = String(raw ?? "").trim().toLowerCase();
  return /^[a-z0-9_-]{1,40}$/.test(s) ? s : "";
}

export function cleanUtm(raw: unknown) {
  return String(raw ?? "")
    .trim()
    .replace(/[^\w.\-+%]/g, "")
    .slice(0, 60);
}
