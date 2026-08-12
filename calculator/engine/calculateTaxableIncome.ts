import type { TaxCalculationInput } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";
import { calculateSalaryIncome } from "./calculateSalaryIncome";
import { calculateHousePropertyIncome } from "./calculateHousePropertyIncome";
import { calculateFinancialAssetIncome } from "./calculateFinancialAssetIncome";
import { calculateBusinessIncome } from "./calculateBusinessIncome";

export interface TaxableIncomeResult {
  grossIncome: number;
  totalTaxableIncome: number;
  totalTdsFromIncomeHeads: number;
  totalAdvanceTaxFromIncomeHeads: number;
  businessGrossTurnover: number;
  breakdown: {
    salary?: ReturnType<typeof calculateSalaryIncome>;
    houseProperty?: ReturnType<typeof calculateHousePropertyIncome>;
    financialAssets?: ReturnType<typeof calculateFinancialAssetIncome>;
    business?: ReturnType<typeof calculateBusinessIncome>;
  };
}

const UNSUPPORTED_CATEGORIES: Array<[keyof TaxCalculationInput, string]> = [
  ["agricultural", "Agricultural income"],
  ["capitalGains", "Capital gains"],
  ["otherSources", "Other sources of income"],
  ["foreignIncome", "Foreign income"],
];

/**
 * Aggregates taxable income across categories this engine has
 * confirmed rules for (salary, house property, financial assets,
 * Sole Proprietorship business). Refuses to calculate if the input
 * includes any category whose tax treatment hasn't been supplied yet.
 *
 * Owner-confirmed: a business loss is NOT set off against other
 * income — calculateBusinessIncome already floors it at zero, so it
 * simply contributes nothing here rather than reducing the total.
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

  const grossIncome =
    (salary?.grossSalary ?? 0) +
    (houseProperty?.totalTaxableIncome ?? 0) +
    (financialAssets?.totalTaxableIncome ?? 0) +
    (business?.taxableProfit ?? 0);

  const totalTaxableIncome =
    (salary?.taxableSalary ?? 0) +
    (houseProperty?.totalTaxableIncome ?? 0) +
    (financialAssets?.totalTaxableIncome ?? 0) +
    (business?.taxableProfit ?? 0);

  const totalTdsFromIncomeHeads =
    (salary?.tdsDeducted ?? 0) +
    (houseProperty?.totalTdsDeducted ?? 0) +
    (financialAssets?.totalTdsDeducted ?? 0) +
    (business?.tdsDeducted ?? 0);

  const totalAdvanceTaxFromIncomeHeads = business?.advanceTaxPaid ?? 0;

  return {
    grossIncome,
    totalTaxableIncome,
    totalTdsFromIncomeHeads,
    totalAdvanceTaxFromIncomeHeads,
    businessGrossTurnover: business?.grossTurnover ?? 0,
    breakdown: { salary, houseProperty, financialAssets, business },
  };
}
