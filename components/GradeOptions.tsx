import { GRADE_OPTIONS, isSubscribeOpen } from "@/lib/config";

/** 訂閱表單的年級選項：SUBSCRIBE_OPEN 關閉的級距會停用（目前全部開放）。 */
export function SubscribeGradeOptions() {
  return (
    <>
      {GRADE_OPTIONS.map((g) =>
        isSubscribeOpen(g) ? (
          <option key={g}>{g}</option>
        ) : (
          <option key={g} value={g} disabled>
            {g}（暫停訂閱）
          </option>
        ),
      )}
    </>
  );
}
