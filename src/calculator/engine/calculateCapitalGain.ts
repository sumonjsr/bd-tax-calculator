import type { CapitalGainTransaction } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";

export interface CapitalGainResult {
  /** Short-term real estate + short-term unlisted shares gains —
   * owner-confirmed to merge directly into the general combined
   * taxable income pool and be taxed once via the regular slabs. */
  shortTermPoolAddition: number;
  /** Long-term unlisted shares gains — NOT merged into the pool.
   * Needs a "lower of flat 15% vs incremental slab tax" comparison
   * that requires the full combined pool total, so it's computed at
   * the orchestration level (calculateTaxPayable.ts), not here. */
  longTermUnlistedShareGains: number;
  /** Flat-rate capital gains tax already fully resolved here: LTCG
   * real estate (15%) and listed shares (10% sponsor/director, or
   * 15%/25% tiered). Owner-confirmed to be added directly to the
   * final tax, bypassing rebate/surcharge/minimum-tax. */
  flatRateCapitalGainsTax: number;
  /** Owner-confirmed: always creditable, even when a transaction's
   * net gain is zero or negative (TDS is advance-paid tax). */
  tdsDeducted: number;
}

/**
 * Sections referenced in the owner-supplied spec. Government bonds
 * are fully exempt (skipped entirely except for TDS credit, per the
 * owner's "TDS always creditable" correction).
 */
export function calculateCapitalGain(
  entries: CapitalGainTransaction[],
  rules: TaxRuleConfig,
): CapitalGainResult {
  let shortTermPoolAddition = 0;
  let longTermUnlistedShareGains = 0;
  let flatRateCapitalGainsTax = 0;
  let tdsDeducted = 0;

  for (const entry of entries) {
    // Owner-confirmed: TDS is creditable regardless of gain, exemption,
    // or asset type — so this is summed unconditionally, before any
    // of the exemption/zero-gain branches below.
    tdsDeducted += entry.tdsDeducted;

    if (entry.assetType === "govt-bond") {
      continue; // fully exempt
    }

    const deemedConsideration =
      entry.assetType === "real-estate"
        ? Math.max(entry.saleConsideration, entry.mouzaValue ?? 0)
        : entry.saleConsideration;

    const totalCost =
      entry.costOfAcquisition + entry.costOfImprovement + entry.transferExpenses;
    const netGain = Math.max(deemedConsideration - totalCost, 0);
    if (netGain === 0) continue;

    const isLongTerm = entry.holdingPeriodMonths > rules.capitalGains.longTermHoldingMonthsThreshold;

    if (entry.assetType === "real-estate") {
      if (isLongTerm) {
        flatRateCapitalGainsTax += netGain * rules.capitalGains.realEstateLongTermRate;
      } else {
        shortTermPoolAddition += netGain;
      }
    } else if (entry.assetType === "listed-shares") {
      if (entry.isSponsorDirector) {
        flatRateCapitalGainsTax +=
          netGain * rules.capitalGains.listedSharesSponsorDirectorRate;
      } else if (netGain <= rules.capitalGains.listedSharesStandardThreshold) {
        flatRateCapitalGainsTax += netGain * rules.capitalGains.listedSharesStandardRate;
      } else {
        flatRateCapitalGainsTax +=
          rules.capitalGains.listedSharesStandardThreshold *
            rules.capitalGains.listedSharesStandardRate +
          (netGain - rules.capitalGains.listedSharesStandardThreshold) *
            rules.capitalGains.listedSharesExcessRate;
      }
    } else if (entry.assetType === "unlisted-shares") {
      if (isLongTerm) {
        longTermUnlistedShareGains += netGain;
      } else {
        shortTermPoolAddition += netGain;
      }
    }
  }

  return {
    shortTermPoolAddition,
    longTermUnlistedShareGains,
    flatRateCapitalGainsTax,
    tdsDeducted,
  };
}
