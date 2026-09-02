import fs from "node:fs";
import path from "node:path";

const TTC = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc";

export function cjkFontPath() {
  const out = path.join(process.cwd(), "data", "NotoSansCJKtc-Regular.ttf");
  if (fs.existsSync(out) && fs.statSync(out).size > 1000) return out;
  if (!fs.existsSync(TTC)) {
    throw new Error("找不到系統字型 Noto Sans CJK，無法產生中文 PDF。");
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  extractTtcFont(TTC, out, 0);
  return out;
}

function extractTtcFont(ttcPath: string, outPath: string, index: number) {
  const buf = fs.readFileSync(ttcPath);
  const tag = buf.toString("ascii", 0, 4);
  if (tag !== "ttcf") throw new Error("不是 TTC 字型集合");
  const numFonts = buf.readUInt32BE(8);
  if (index >= numFonts) throw new Error("字型索引超出範圍");
  const fontOffset = buf.readUInt32BE(12 + index * 4);
  const numTables = buf.readUInt16BE(fontOffset + 4);
  const tableDirStart = fontOffset;
  const records: { tag: string; checksum: number; offset: number; length: number }[] = [];
  for (let i = 0; i < numTables; i++) {
    const o = fontOffset + 12 + i * 16;
    records.push({
      tag: buf.toString("ascii", o, o + 4),
      checksum: buf.readUInt32BE(o + 4),
      offset: buf.readUInt32BE(o + 8),
      length: buf.readUInt32BE(o + 12),
    });
  }
  const headerSize = 12 + numTables * 16;
  let cursor = headerSize;
  const aligned: { rec: (typeof records)[0]; dataStart: number }[] = [];
  for (const rec of records) {
    const pad = (4 - (cursor % 4)) % 4;
    cursor += pad;
    aligned.push({ rec, dataStart: cursor });
    cursor += rec.length;
  }
  const out = Buffer.alloc(cursor);
  buf.copy(out, 0, tableDirStart, tableDirStart + 12);
  for (let i = 0; i < numTables; i++) {
    const { rec, dataStart } = aligned[i];
    const o = 12 + i * 16;
    out.write(rec.tag, o, 4, "ascii");
    out.writeUInt32BE(rec.checksum, o + 4);
    out.writeUInt32BE(dataStart, o + 8);
    out.writeUInt32BE(rec.length, o + 12);
    buf.copy(out, dataStart, rec.offset, rec.offset + rec.length);
  }
  fs.writeFileSync(outPath, out);
}
