"use client";
import { useEffect, useState } from "react";

const JUNIOR = new Set(["國一", "國二", "國三"]);

/** 「孩子的需求」欄位：小學、高中、SAT 必填，國中選填（後端 needsRequired 也會再擋）。 */
export function NeedsField({ gradeId, id, label, hint, max }: { gradeId: string; id: string; label: string; hint: string; max: number }) {
  const [required, setRequired] = useState(false);
  useEffect(() => {
    const grade = document.getElementById(gradeId) as HTMLSelectElement | null;
    if (!grade) return;
    const sync = () => setRequired(!JUNIOR.has(grade.value));
    sync();
    grade.addEventListener("change", sync);
    return () => grade.removeEventListener("change", sync);
  }, [gradeId]);
  return (
    <>
      <label htmlFor={id}>
        {label}
        {required ? "*" : "（國中選填）"}
      </label>
      <textarea id={id} name="needs" required={required} maxLength={max} placeholder={hint} rows={4} />
      <p className="muted" style={{ fontSize: 13, margin: 0 }}>
        小學、高中、SAT 必填：老師會依你填的需求製作客製題本。國中可留空。
      </p>
    </>
  );
}
