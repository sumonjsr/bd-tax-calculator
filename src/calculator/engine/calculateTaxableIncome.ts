import type { TaxCalculationInput } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";
import { calculateSalaryIncome } from "./calculateSalaryIncome";
import { calculateHousePropertyIncome } from "./calculateHousePropertyIncome";
import { calculateFinancialAssetIncome } from "./calculateFinancialAssetIncome";
import { calculateBusinessIncome } from "./calculateBusinessIncome";
import { calculateAgriculturalIncome } from "./calculateAgriculturalIncome";
import { calculateCapitalGain } from "./calculateCapitalGain";
import { calculateOtherIncome } from "./calculateOtherIncome";
import { calculateForeignIncome } from "./calculateForeignIncome";

export interface TaxableIncomeResult {
  grossIncome: number;
  totalTaxableIncome: number;
  totalTdsFromIncomeHeads: number;
  totalAdvanceTaxFromIncomeHeads: number;
  businessGrossTurnover: number;
  longTermUnlistedShareGains: number;
  flatRateCapitalGainsTax: number;
  finalTaxOtherSourcesIncome: number;
  finalTaxOtherSourcesTdsDeducted: number;
  exemptForeignIncome: number;
  foreignIncomeAdvisoryNotes: string[];
  breakdown: {
    salary?: ReturnType<typeof calculateSalaryIncome>;
    houseProperty?: ReturnType<typeof calculateHousePropertyIncome>;
    financialAssets?: ReturnType<typeof calculateFinancialAssetIncome>;
    business?: ReturnType<typeof calculateBusinessIncome>;
    agricultural?: ReturnType<typeof calculateAgriculturalIncome>;
    capitalGains?: ReturnType<typeof calculateCapitalGain>;
    otherSources?: ReturnType<typeof calculateOtherIncome>;
    foreignIncome?: ReturnType<typeof calculateForeignIncome>;
  };
}

/**
 * Aggregates taxable income across every income category this engine
 * has confirmed rules for.
 *
 * Foreign income: owner-confirmed to be fully exempt when remitted via
 * a legal banking channel — see calculateForeignIncome.ts, which
 * itself refuses (throws) for any entry NOT received that way, since
 * that treatment is unconfigured and needs manual review.
 */
export function calculateTaxableIncome(
  input: TaxCalculationInput,
  rules: TaxRuleConfig,
): TaxableIncomeResult {
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

  const otherSources = input.otherSources?.length
    ? calculateOtherIncome(input.otherSources)
    : undefined;

  const foreignIncome = input.foreignIncome?.length
    ? calculateForeignIncome(input.foreignIncome)
    : undefined;

  const grossIncome =
    (salary?.grossSalary ?? 0) +
    (houseProperty?.totalTaxableIncome ?? 0) +
    (financialAssets?.totalTaxableIncome ?? 0) +
    (business?.taxableProfit ?? 0) +
    (agricultural?.totalTaxableAgriIncome ?? 0) +
    (capitalGains?.shortTermPoolAddition ?? 0) +
    (otherSources?.regularPoolAddition ?? 0);

  const totalTaxableIncome =
    (salary?.taxableSalary ?? 0) +
    (houseProperty?.totalTaxableIncome ?? 0) +
    (financialAssets?.totalTaxableIncome ?? 0) +
    (business?.taxableProfit ?? 0) +
    (agricultural?.totalTaxableAgriIncome ?? 0) +
    (capitalGains?.shortTermPoolAddition ?? 0) +
    (otherSources?.regularPoolAddition ?? 0);

  const totalTdsFromIncomeHeads =
    (salary?.tdsDeducted ?? 0) +
    (houseProperty?.totalTdsDeducted ?? 0) +
    (financialAssets?.totalTdsDeducted ?? 0) +
    (business?.tdsDeducted ?? 0) +
    (agricultural?.tdsDeducted ?? 0) +
    (capitalGains?.tdsDeducted ?? 0) +
    (otherSources?.adjustableTdsCredit ?? 0);

  const totalAdvanceTaxFromIncomeHeads = business?.advanceTaxPaid ?? 0;

  return {
    grossIncome,
    totalTaxableIncome,
    totalTdsFromIncomeHeads,
    totalAdvanceTaxFromIncomeHeads,
    businessGrossTurnover: business?.grossTurnover ?? 0,
    longTermUnlistedShareGains: capitalGains?.longTermUnlistedShareGains ?? 0,
    flatRateCapitalGainsTax: capitalGains?.flatRateCapitalGainsTax ?? 0,
    finalTaxOtherSourcesIncome: otherSources?.finalTaxIncome ?? 0,
    finalTaxOtherSourcesTdsDeducted: otherSources?.finalTaxDeducted ?? 0,
    exemptForeignIncome: foreignIncome?.exemptForeignIncome ?? 0,
    foreignIncomeAdvisoryNotes: foreignIncome?.advisoryNotes ?? [],
    breakdown: {
      salary,
      houseProperty,
      financialAssets,
      business,
      agricultural,
      capitalGains,
      otherSources,
      foreignIncome,
    },
  };
}
