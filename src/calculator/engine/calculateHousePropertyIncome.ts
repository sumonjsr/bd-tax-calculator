import type { HousePropertyIncome } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";

export interface HousePropertyIncomeResult {
  entries: Array<{
    grossAnnualValue: number;
    statutoryRepairAllowance: number;
    netIncome: number;
    tdsDeducted: number;
  }>;
  totalTaxableIncome: number;
  totalTdsDeducted: number;
}

/**
 * Sections 55-57: Gross Annual Value less the statutory repair
 * allowance (25% residential / 30% commercial of GAV — NOT actual
 * repair cost) and less municipal taxes, mortgage interest, and
 * insurance premium.
 *
 * Per-property net income is allowed to go negative (a house-property
 * loss); the total across properties is floored at zero here since no
 * loss-set-off rule against other income heads has been supplied yet.
 */
export function calculateHousePropertyIncome(
  entries: HousePropertyIncome[],
  rules: TaxRuleConfig,
): HousePropertyIncomeResult {
  const computed = entries.map((entry) => {
    const grossAnnualValue = entry.grossRentalIncome - entry.vacancyAdjustment;
    const allowanceRate =
      entry.propertyType === "commercial"
        ? rules.houseProperty.statutoryRepairAllowance.commercial
        : rules.houseProperty.statutoryRepairAllowance.residential;
    const statutoryRepairAllowance = grossAnnualValue * allowanceRate;

    const netIncome =
      grossAnnualValue -
      statutoryRepairAllowance -
      entry.municipalTaxes -
      entry.mortgageInterest -
      entry.insurancePremium;

    return {
      grossAnnualValue,
      statutoryRepairAllowance,
      netIncome,
      tdsDeducted: entry.tdsDeducted,
    };
  });

  const totalTaxableIncome = Math.max(
    computed.reduce((sum, e) => sum + e.netIncome, 0),
    0,
  );
  const totalTdsDeducted = computed.reduce((sum, e) => sum + e.tdsDeducted, 0);

  return { entries: computed, totalTaxableIncome, totalTdsDeducted };
}
