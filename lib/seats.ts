import { unstable_cache } from "next/cache";
import { seatCap } from "@/lib/config";
import { seatsRemaining } from "@/lib/db";

/**
 * 公開頁的剩餘名額：快取 60 秒，暖機後的請求不必再連資料庫。
 * 後台開席（revalidatePath("/")）會讓首頁重算；試閱頁最多晚 60 秒。
 * 連不上資料庫時退回「限 N 名」，不讓頁面掛掉。
 */
export const cachedSeatsRemaining = unstable_cache(
  async () => {
    try {
      return await seatsRemaining();
    } catch (err) {
      console.error("seatsRemaining failed", err);
      return seatCap();
    }
  },
  ["seats-remaining"],
  { revalidate: 60, tags: ["seats"] },
);
