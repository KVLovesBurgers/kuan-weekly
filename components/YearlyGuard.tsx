"use client";
import { useEffect } from "react";

const JUNIOR = new Set(["國一", "國二", "國三"]);

/** 前端擋年繳：年級不是國中時，停用「年繳」選項並切回月繳（後端 yearlyAllowed 也會再擋一次）。 */
export function YearlyGuard({ gradeId, planId }: { gradeId: string; planId: string }) {
  useEffect(() => {
    const grade = document.getElementById(gradeId) as HTMLSelectElement | null;
    const plan = document.getElementById(planId) as HTMLSelectElement | null;
    if (!grade || !plan) return;
    const sync = () => {
      const opt = plan.querySelector<HTMLOptionElement>('option[value="yearly"]');
      if (!opt) return;
      const ok = JUNIOR.has(grade.value);
      opt.disabled = !ok;
      if (!ok && plan.value === "yearly") plan.value = "monthly";
    };
    sync();
    grade.addEventListener("change", sync);
    return () => grade.removeEventListener("change", sync);
  }, [gradeId, planId]);
  return null;
}
