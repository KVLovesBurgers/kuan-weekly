import katex from "katex";

/** 與 tex() 相同，但公式和緊接的全形標點綁在一起不分行（避免逗號被擠到下一行開頭）。 */
export function mockTex(s: string): string {
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return s
    .split(/(\$[^$]+\$[，。、；：？）]?)/g)
    .map((part) => {
      const m = part.match(/^\$([^$]+)\$([，。、；：？）]?)$/);
      if (!m) return esc(part);
      const k = katex.renderToString(m[1], { throwOnError: true, output: "html" });
      return m[2] ? `<span class="nobr">${k}${m[2]}</span>` : k;
    })
    .join("");
}
