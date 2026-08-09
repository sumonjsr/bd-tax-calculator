import type { TaxpayerProfile } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";

export interface MinimumTaxResult {
  applicableMinimumTax: number;
}

/**
 * Section 166: a flat minimum tax applies to any individual taxpayer
 * whose taxable income exceeds their tax-free threshold — BDT 5,000
 * standard, or BDT 1,000 for first-time return filers.
 */
export function calculateMinimumTax(
  taxableIncome: number,
  taxFreeThreshold: number,
  profile: TaxpayerProfile,
  rules: TaxRuleConfig,
): MinimumTaxResult {
  if (taxableIncome <= taxFreeThreshold) {
    return { applicableMinimumTax: 0 };
  }

  return {
    applicableMinimumTax: profile.isFirstTimeFiler
      ? rules.minimumTax.firstTimeFiler
      : rules.minimumTax.standard,
  };
}