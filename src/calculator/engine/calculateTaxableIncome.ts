import type { TaxCalculationInput } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";
import { calculateSalaryIncome } from "./calculateSalaryIncome";
import { calculateHousePropertyIncome } from "./calculateHousePropertyIncome";
import { calculateFinancialAssetIncome } from "./calculateFinancialAssetIncome";
import { calculateBusinessIncome } from "./calculateBusinessIncome";
import { calculateAgriculturalIncome } from "./calculateAgriculturalIncome";
import { calculateCapitalGain } from "./calculateCapitalGain";

export interface TaxableIncomeResult {
  grossIncome: number;
  totalTaxableIncome: number;
  totalTdsFromIncomeHeads: number;
  totalAdvanceTaxFromIncomeHeads: number;
  businessGrossTurnover: number;
  longTermUnlistedShareGains: number;
  flatRateCapitalGainsTax: number;
  breakdown: {
    salary?: ReturnType<typeof calculateSalaryIncome>;
    houseProperty?: ReturnType<typeof calculateHousePropertyIncome>;
    financialAssets?: ReturnType<typeof calculateFinancialAssetIncome>;
    business?: ReturnType<typeof calculateBusinessIncome>;
    agricultural?: ReturnType<typeof calculateAgriculturalIncome>;
    capitalGains?: ReturnType<typeof calculateCapitalGain>;
  };
}

const UNSUPPORTED_CATEGORIES: Array<[keyof TaxCalculationInput, string]> = [
  ["otherSources", "Other sources of income"],
  ["foreignIncome", "Foreign income"],
];

/**
 * Aggregates taxable income across categories this engine has
 * confirmed rules for (salary, house property, financial assets,
 * Sole Proprietorship business, agriculture, capital gains). Refuses
 * to calculate if the input includes any category whose tax treatment
 * hasn't been supplied yet.
 *
 * Capital gains: short-term real estate and short-term unlisted
 * shares merge into the general pool below (owner-confirmed). Long-
 * term unlisted shares and the already-resolved flat-rate items
 * (LTCG real estate, listed shares) do NOT merge in — they're passed
 * through for calculateTaxPayable.ts to add separately after the
 * minimum-tax comparison (owner-confirmed).
 */
export function calculateTaxableIncome(
  input: TaxCalculationInput,
  rules: TaxRuleConfig,
): TaxableIncomeResult {
  const unsupportedPresent = UNSUPPORTED_CATEGORIES.filter(([key]) => {
    const value = input[key];
    return Array.isArray(value) ? value.length > 0 : value != null;
  });

  if (unsupportedPresent.length > 0) {
    const names = unsupportedPresent.map(([, label]) => label).join(", ");
    throw new Error(
      `Tax treatment for the following categories has not been supplied yet, ` +
        `so they cannot be calculated: ${names}. Provide the applicable rules ` +
        `before including this income.`,
    );
  }

  const salary = input.salaryIncome
    ? calculateSalaryIncome(input.salaryIncome, rules)
    : undefined;
  const houseProperty = input.houseProperty?.length
    ? calculateHousePropertyIncome(input.houseProperty, rules)
    : undefined;
  const financialAssets = input.financialAssets
    ? calculateFinancialAssetIncome(input.financialAssets)
    : undefined;
  const business = input.business?.length
    ? calculateBusinessIncome(input.business)
    : undefined;

  const hasOtherIncomeHeads = Boolean(
    input.salaryIncome || input.houseProperty?.length || input.business?.length || input.financialAssets,
  );
  const agricultural = input.agricultural
    ? calculateAgriculturalIncome(input.agricultural, hasOtherIncomeHeads, rules)
    : undefined;

  const capitalGains = input.capitalGains?.length
    ? calculateCapitalGain(input.capitalGains, rules)
    : undefined;

  const grossIncome =
    (salary?.grossSalary ?? 0) +
    (houseProperty?.totalTaxableIncome ?? 0) +
    (financialAssets?.totalTaxableIncome ?? 0) +
    (business?.taxableProfit ?? 0) +
    (agricultural?.totalTaxableAgriIncome ?? 0) +
    (capitalGains?.shortTermPoolAddition ?? 0);

  const totalTaxableIncome =
    (salary?.taxableSalary ?? 0) +
    (houseProperty?.totalTaxableIncome ?? 0) +
    (financialAssets?.totalTaxableIncome ?? 0) +
    (business?.taxableProfit ?? 0) +
    (agricultural?.totalTaxableAgriIncome ?? 0) +
    (capitalGains?.shortTermPoolAddition ?? 0);

  const totalTdsFromIncomeHeads =
    (salary?.tdsDeducted ?? 0) +
    (houseProperty?.totalTdsDeducted ?? 0) +
    (financialAssets?.totalTdsDeducted ?? 0) +
    (business?.tdsDeducted ?? 0) +
    (agricultural?.tdsDeducted ?? 0) +
    (capitalGains?.tdsDeducted ?? 0);

  const totalAdvanceTaxFromIncomeHeads = business?.advanceTaxPaid ?? 0;

  return {
    grossIncome,
    totalTaxableIncome,
    totalTdsFromIncomeHeads,
    totalAdvanceTaxFromIncomeHeads,
    businessGrossTurnover: business?.grossTurnover ?? 0,
    longTermUnlistedShareGains: capitalGains?.longTermUnlistedShareGains ?? 0,
    flatRateCapitalGainsTax: capitalGains?.flatRateCapitalGainsTax ?? 0,
    breakdown: { salary, houseProperty, financialAssets, business, agricultural, capitalGains },
  };
}
