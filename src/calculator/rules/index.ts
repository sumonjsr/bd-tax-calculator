import type { AssessmentYear } from "../../types/tax";
import type { TaxRuleConfig } from "./types";
import rules2026_2027 from "./2026-2027";

const ruleRegistry: Record<AssessmentYear, TaxRuleConfig | null> = {
  "2026-2027": rules2026_2027,
};

export const availableAssessmentYears = (): AssessmentYear[] =>
  Object.keys(ruleRegistry);

export const isAssessmentYearConfigured = (year: AssessmentYear): boolean =>
  ruleRegistry[year] != null;

export const getTaxRules = (year: AssessmentYear): TaxRuleConfig => {
  const config = ruleRegistry[year];
  if (!config) {
    throw new Error(
      `No tax rule configuration exists yet for assessment year "${year}". ` +
        `Official Bangladesh tax figures for this year have not been supplied.`,
    );
  }
  return config;
};

export default ruleRegistry;