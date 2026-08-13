import type { AgriculturalIncome } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";

export interface AgriculturalIncomeResult {
  productionCostAllowed: number;
  netCoreAgriIncome: number;
  taxableFisheriesIncome: number;
  taxablePoultryIncome: number;
  taxableDairyMushroomNurseryIncome: number;
  totalTaxableAgriIncome: number;
  tdsDeducted: number;
}

/**
 * Sections 38-44. Owner-confirmed: all 5 deduction types in Sec
 * 40(1)(b-g) apply (land revenue, loan interest, insurance,
 * depreciation, irrigation maintenance). Owner-confirmed:
 * Dairy/Mushroom/Nursery gets the same allied-business exemption
 * treatment as Fisheries/Poultry, just at a lower threshold.
 *
 * @param hasOtherIncomeHeads whether the taxpayer has any OTHER
 *   confirmed income category entered (salary, house property,
 *   business, financial assets) — determines eligibility for the
 *   extra BDT 2,00,000 exemption available only to agriculture-only
 *   taxpayers.
 */
export function calculateAgriculturalIncome(
  income: AgriculturalIncome,
  hasOtherIncomeHeads: boolean,
  rules: TaxRuleConfig,
): AgriculturalIncomeResult {
  const productionCostAllowed = income.hasBooksOfAccounts
    ? income.actualProductionCost
    : income.cropSalesReceipts * rules.agriculture.noBooksProductionCostRate;

  const netCropIncome = Math.max(income.cropSalesReceipts - productionCostAllowed, 0);

  // No statutory 60% deduction applies to lease rent.
  const totalAgriGross = netCropIncome + income.landLeaseRent;

  const otherDeductions =
    income.landRevenuePaid +
    income.loanInterestPaid +
    income.insurancePremium +
    income.depreciation +
    income.irrigationMaintenanceExpense;

  let netCoreAgriIncome = Math.max(totalAgriGross - otherDeductions, 0);

  if (!hasOtherIncomeHeads) {
    netCoreAgriIncome = Math.max(
      netCoreAgriIncome - rules.agriculture.soleAgricultureAdditionalExemption,
      0,
    );
  }

  const taxableFisheriesIncome = Math.max(
    income.fisheriesIncome - rules.agriculture.fisheriesPoultryExemptionThreshold,
    0,
  );
  const taxablePoultryIncome = Math.max(
    income.poultryIncome - rules.agriculture.fisheriesPoultryExemptionThreshold,
    0,
  );
  const taxableDairyMushroomNurseryIncome = Math.max(
    income.dairyMushroomNurseryIncome -
      rules.agriculture.dairyMushroomNurseryExemptionThreshold,
    0,
  );

  const totalTaxableAgriIncome =
    netCoreAgriIncome +
    taxableFisheriesIncome +
    taxablePoultryIncome +
    taxableDairyMushroomNurseryIncome;

  return {
    productionCostAllowed,
    netCoreAgriIncome,
    taxableFisheriesIncome,
    taxablePoultryIncome,
    taxableDairyMushroomNurseryIncome,
    totalTaxableAgriIncome,
    tdsDeducted: income.tdsDeducted,
  };
}
