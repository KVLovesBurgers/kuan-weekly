import { SITE, TIER_PRICES, CLOSED_TIERS, money, type PriceTier } from "@/lib/config";

/** 依年級的月費列表（小學 699／國中 799／高中 999／SAT 1,099），價格全部來自 lib/config 的 TIER_PRICES。 */
export function TierPrices({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`tier-list${compact ? " tier-list--compact" : ""}`}>
      {(Object.keys(TIER_PRICES) as PriceTier[]).map((k) => (
        <li key={k}>
          <span className="tier-name">
            {TIER_PRICES[k].label}
            <small>（{TIER_PRICES[k].grades}）</small>
          </span>
          <span className="tier-amount">
            <strong>
              {SITE.currency}
              {money(TIER_PRICES[k].monthly)}
            </strong>{" "}
            /月 · 每位孩子{CLOSED_TIERS.includes(k) ? "（即將開放，開放後適用）" : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
