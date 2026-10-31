"use client";
import { useEffect } from "react";

/** 年繳：有選年級即可（金額依年級月費×10，後端 yearlyAllowed／yearlyPriceFor 再算一次）。 */
export function YearlyGuard({ gradeId, planId }: { gradeId: string; planId: string }) {
  useEffect(() => {
    const grade = document.getElementById(gradeId) as HTMLSelectElement | null;
    const plan = document.getElementById(planId) as HTMLSelectElement | null;
    if (!grade || !plan) return;
    const sync = () => {
      const opt = plan.querySelector<HTMLOptionElement>('option[value="yearly"]');
      if (!opt) return;
      const ok = Boolean(grade.value);
      opt.disabled = !ok;
      if (!ok && plan.value === "yearly") plan.value = "monthly";
    };
    sync();
    grade.addEventListener("change", sync);
    return () => grade.removeEventListener("change", sync);
  }, [gradeId, planId]);
  return null;
}
