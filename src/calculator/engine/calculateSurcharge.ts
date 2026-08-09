import type { TaxpayerProfile } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";

export interface SurchargeResult {
  applicableRate: number;
  surchargeAmount: number;
  note?: string;
}

/**
 * Net-wealth-based Wealth Surcharge on Net Tax Payable.
 *
 * CONFIRMED (Section 166 / Finance Act 2026, First Schedule):
 *   - Computed on tax AFTER the investment rebate — `taxBase` here is
 *     always taxAfterRebate, passed in by the caller.
 *   - Below 4 crore net wealth: always 0%, regardless of vehicle or
 *     property count.
 *   - 4-10 crore band: uniform 10% regardless of the vehicle/property
 *     condition (that condition is just a same-rate floor clause
 *     inside this band, so it needs no separate handling here).
 *
 * OUT OF SCOPE: "Environmental Surcharge" is a separate, per-vehicle
 * tax that can apply even below the 4-crore threshold. It is NOT
 * Wealth Surcharge and must never be folded into this function's
 * output — see calculateTaxPayable.ts for where it's flagged instead.
 */
export function calculateSurcharge(
  taxAfterRebate: number,
  profile: TaxpayerProfile,
  rules: TaxRuleConfig,
): SurchargeResult {
  const netWealth = profile.netWealth ?? 0;

  const band = rules.surcharge.bands.find(
    (b) => netWealth >= b.minNetWealth && (b.maxNetWealth == null || netWealth <= b.maxNetWealth),
  );

  if (!band) {
    return { applicableRate: 0, surchargeAmount: 0 };
  }

  return {
    applicableRate: band.rate,
    surchargeAmount: Math.max(taxAfterRebate, 0) * band.rate,
    note: band.note,
  };
}