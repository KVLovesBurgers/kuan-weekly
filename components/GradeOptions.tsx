import { GRADE_OPTIONS, isSubscribeOpen } from "@/lib/config";

/** 訂閱表單的年級選項：未開放的年級顯示「即將開放」並停用（後端 isSubscribeOpen 也會擋）。 */
export function SubscribeGradeOptions() {
  return (
    <>
      {GRADE_OPTIONS.map((g) =>
        isSubscribeOpen(g) ? (
          <option key={g}>{g}</option>
        ) : (
          <option key={g} value={g} disabled>
            {g}（即將開放）
          </option>
        ),
      )}
    </>
  );
}
