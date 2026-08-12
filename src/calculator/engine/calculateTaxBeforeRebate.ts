import type { TaxpayerProfile } from "../../types/tax";
import type { ThresholdCategory, TaxRuleConfig } from "../rules/types";

export interface ThresholdResolution {
  category: ThresholdCategory;
  threshold: number;
}

/**
 * A taxpayer can qualify for more than one threshold category at once
 * (e.g. a disabled female taxpayer, or a female freedom fighter). Per
 * the owner's confirmed rule, the engine always applies whichever
 * qualifying threshold is highest (most favorable to the taxpayer).
 */
export function resolveThreshold(
  profile: TaxpayerProfile,
  rules: TaxRuleConfig,
): ThresholdResolution {
  const candidates: ThresholdCategory[] = ["general"];

  if (profile.gender === "female" || profile.age >= 65) {
    candidates.push("female-or-senior");
  }
  if (profile.gender === "third-gender") {
    candidates.push("third-gender");
  }
  if (profile.isDisabled) {
    candidates.push("disabled");
  }
  if (profile.isFreedomFighter) {
    candidates.push("freedom-fighter");
  }

  const best = candidates.reduce((highest, category) =>
    rules.taxFreeThresholds[category] > rules.taxFreeThresholds[highest]
      ? category
      : highest,
  );

  const disabledChildAllowance =
    (profile.disabledChildrenCount ?? 0) * rules.disabledChildAllowance;

  return {
    category: best,
    threshold: rules.taxFreeThresholds[best] + disabledChildAllowance,
  };
}

export interface TaxBeforeRebateResult {
  thresholdApplied: ThresholdResolution;
  taxBeforeRebate: number;
}

/**
 * Progressive slab tax above the resolved tax-free threshold, or a
 * flat rate for non-residents.
 */
export function calculateTaxBeforeRebate(
  taxableIncome: number,
  profile: TaxpayerProfile,
  rules: TaxRuleConfig,
): TaxBeforeRebateResult {
  if (profile.residentialStatus === "non-resident") {
    return {
      thresholdApplied: { category: "general", threshold: 0 },
      taxBeforeRebate: Math.max(taxableIncome, 0) * rules.nonResidentFlatRate,
    };
  }

  const thresholdApplied = resolveThreshold(profile, rules);
  let remaining = Math.max(taxableIncome - thresholdApplied.threshold, 0);
  let tax = 0;

  for (const band of rules.incomeTaxSlabBands) {
    if (remaining <= 0) break;
    const bandAmount =
      band.widthAboveThreshold == null
        ? remaining
        : Math.min(remaining, band.widthAboveThreshold);
    tax += bandAmount * band.rate;
    remaining -= bandAmount;
  }

  return { thresholdApplied, taxBeforeRebate: tax };
}
