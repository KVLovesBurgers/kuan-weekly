/** Allowed post-login redirects (same-origin path only). */
const ALLOWED = new Set(["/", "/subscribe", "/dashboard"]);

export function safeNextPath(raw: unknown): string {
  if (typeof raw !== "string") return "/dashboard";
  const next = raw.trim();
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    return "/dashboard";
  }
  // strip query/hash for allowlist check
  const path = next.split("?")[0].split("#")[0];
  if (ALLOWED.has(path)) return path === "/" ? "/" : path;
  return "/dashboard";
}
