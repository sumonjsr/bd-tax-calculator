import type { InvestmentRebateItem } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";

export interface TaxRebateResult {
  eligibleInvestmentAmount: number;
  rebateAmount: number;
}

/**
 * Sixth Schedule, Part 3: caps eligible investment per category (e.g.
 * life insurance at 10% of sum assured, DPS at BDT 1,20,000/year),
 * then applies: min(3% of taxable income, 10% of eligible investment,
 * BDT 7,50,000).
 */
export function calculateTaxRebate(
  items: InvestmentRebateItem[],
  taxableIncome: number,
  rules: TaxRuleConfig,
): TaxRebateResult {
  const categoryRules = new Map(
    rules.investmentRebate.eligibleCategories.map((c) => [c.category, c]),
  );

  const eligibleInvestmentAmount = items.reduce((sum, item) => {
    const rule = categoryRules.get(item.category);
    if (!rule) return sum;

    let eligible = item.amount;

    if (rule.perItemCap != null) {
      eligible = Math.min(eligible, rule.perItemCap);
    }
    if (rule.capAsPercentOf?.field === "sumAssured" && item.sumAssured != null) {
      eligible = Math.min(eligible, item.sumAssured * rule.capAsPercentOf.percent);
    }

    return sum + Math.max(eligible, 0);
  }, 0);

  const { maxPercentOfTaxableIncome, percentOfEligibleInvestment, absoluteCap } =
    rules.investmentRebate.formula;

  const rebateAmount = Math.min(
    taxableIncome * maxPercentOfTaxableIncome,
    eligibleInvestmentAmount * percentOfEligibleInvestment,
    absoluteCap,
  );

  return { eligibleInvestmentAmount, rebateAmount: Math.max(rebateAmount, 0) };
}