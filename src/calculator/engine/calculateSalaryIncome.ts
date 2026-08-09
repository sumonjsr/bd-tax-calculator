import type { SalaryIncome } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";

export interface SalaryIncomeResult {
  grossSalary: number;
  exemptAmount: number;
  taxableSalary: number;
  tdsDeducted: number;
}

/**
 * Section 33 & Sixth Schedule, Part 1: the exempt portion of salary
 * income is the lesser of (1/3 of gross salary) and the rule's cap.
 */
export function calculateSalaryIncome(
  income: SalaryIncome,
  rules: TaxRuleConfig,
): SalaryIncomeResult {
  const grossSalary =
    income.basicSalary +
    income.houseRentAllowance +
    income.medicalAllowance +
    income.conveyanceAllowance +
    income.festivalBonus +
    income.performanceBonus +
    income.otherAllowances +
    income.employerBenefits +
    income.providentFundIncome +
    income.gratuity +
    income.pension +
    income.otherEmploymentBenefits;

  const exemptAmount = Math.min(
    grossSalary * rules.salaryExemption.fraction,
    rules.salaryExemption.cap,
  );

  return {
    grossSalary,
    exemptAmount,
    taxableSalary: Math.max(grossSalary - exemptAmount, 0),
    tdsDeducted: income.tdsDeducted,
  };
}