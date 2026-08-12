import type { TaxpayerProfile } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";

export interface MinimumTaxResult {
  applicableMinimumTax: number;
  note?: string;
}

/**
 * Section 166: a flat minimum tax applies to any individual taxpayer
 * whose taxable income exceeds their tax-free threshold — BDT 5,000
 * standard, or BDT 1,000 for first-time return filers.
 *
 * Owner-confirmed: when the taxpayer has business (Sole Proprietorship)
 * income, a turnover-based minimum tax (1% of gross turnover) is
 * compared against the standard/first-time-filer minimum, and
 * whichever is higher applies. This holds even if the business itself
 * is at a loss — a loss does not exempt the taxpayer from it.
 *
 * The turnover-based check is NOT gated by the general tax-free
 * threshold — it exists specifically to catch businesses reporting
 * negligible profit despite substantial turnover, so it applies
 * whenever there is business turnover, independent of whether overall
 * taxable income crosses the threshold. The standard/first-time-filer
 * minimum still only applies once income exceeds the threshold.
 */
export function calculateMinimumTax(
  taxableIncome: number,
  taxFreeThreshold: number,
  profile: TaxpayerProfile,
  rules: TaxRuleConfig,
  businessGrossTurnover: number,
): MinimumTaxResult {
  const standardMinimum =
    taxableIncome > taxFreeThreshold
      ? profile.isFirstTimeFiler
        ? rules.minimumTax.firstTimeFiler
        : rules.minimumTax.standard
      : 0;

  if (businessGrossTurnover <= 0) {
    return { applicableMinimumTax: standardMinimum };
  }

  const turnoverMinimum = businessGrossTurnover * rules.business.minimumTaxRateOnTurnover;

  return turnoverMinimum > standardMinimum
    ? {
        applicableMinimumTax: turnoverMinimum,
        note: `Section 163 turnover-based minimum tax (${(rules.business.minimumTaxRateOnTurnover * 100).toFixed(1)}% of gross turnover) exceeded the standard minimum tax.`,
      }
    : { applicableMinimumTax: standardMinimum };
}
