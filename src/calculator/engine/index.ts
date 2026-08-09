import type { TaxCalculationInput, TaxCalculationResult } from "../../types/tax";
import { getTaxRules } from "../rules";
import { calculateTaxPayable } from "./calculateTaxPayable";

export function calculateTax(input: TaxCalculationInput): TaxCalculationResult {
  const rules = getTaxRules(input.profile.assessmentYear);
  return calculateTaxPayable(input, rules);
}