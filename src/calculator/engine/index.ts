import type { TaxCalculationInput, TaxCalculationResult } from "../../types/tax";
import { getTaxRules } from "../rules";
import { calculateTaxPayable } from "./calculateTaxPayable";

/**
 * Single entry point the UI calls to get a tax result.
 *
 * Throws if the selected assessment year has no configured rules, or
 * if the input includes an income category whose tax treatment hasn't
 * been supplied yet — see calculateTaxableIncome.ts.
 */
export function calculateTax(input: TaxCalculationInput): TaxCalculationResult {
  const rules = getTaxRules(input.profile.assessmentYear);
  return calculateTaxPayable(input, rules);
}
