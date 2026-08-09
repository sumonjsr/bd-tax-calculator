import type { TaxpayerProfile } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";

export interface SurchargeResult {
  applicableRate: number;
  surchargeAmount: number;
  note?: string;
}

/**
 * Net-wealth-based surcharge on tax liability.
 *
 * PENDING CONFIRMATION from the owner (see 2026-2027/index.ts):
 *   1. Whether ">1 motor vehicle OR >8,000 sq ft residential property"
 *      is an independent trigger below the 4-crore wealth threshold,
 *      or just explanatory context for the 4-10 crore band. Not
 *      applied independently here.
 *   2. Whether surcharge applies to tax BEFORE or AFTER the investment
 *      rebate — this function takes `taxBase` as a parameter rather
 *      than deciding; the caller currently passes tax AFTER rebate.
 */
export function calculateSurcharge(
  taxBase: number,
  profile: TaxpayerProfile,
  rules: TaxRuleConfig,
): SurchargeResult {
  const netWealth = profile.netWealth ?? 0;

  const band = rules.surcharge.bands.find(
    (b) => netWealth >= b.minNetWealth && (b.maxNetWealth == null || netWealth < b.maxNetWealth),
  );

  if (!band) {
    return { applicableRate: 0, surchargeAmount: 0 };
  }

  return {
    applicableRate: band.rate,
    surchargeAmount: Math.max(taxBase, 0) * band.rate,
    note: band.note,
  };
}