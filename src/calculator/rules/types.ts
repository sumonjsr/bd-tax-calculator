import type { AssessmentYear } from "../../types/tax";

/**
 * Shape of a single assessment year's tax rule configuration.
 *
 * PHASE 1 NOTE: This type exists so the folder structure under
 * src/calculator/rules/<year>/ has something to conform to. No real
 * Bangladesh tax figures are defined anywhere in this file or its
 * implementations yet — every numeric rule below is supplied later,
 * once the official tax information is provided. Until then, rule
 * files should export `null`/placeholder configs rather than guessed
 * numbers, and the engine must refuse to calculate against an
 * unconfigured year (see src/calculator/engine/index.ts).
 */

export interface TaxSlab {
  /** Lower bound of this slab, inclusive, in BDT. */
  from: number;
  /** Upper bound of this slab, exclusive. `null` means "and above". */
  to: number | null;
  /** Rate as a decimal, e.g. 0.1 for 10%. */
  rate: number;
}

export interface TaxRuleConfig {
  assessmentYear: AssessmentYear;
  incomeYear: string;
  /** Free-text citation for where these figures came from (NBR SRO
   * number, Finance Act section, etc.), required before a config is
   * considered authoritative. */
  source: string;
  lastUpdated: string;
  notes?: string;

  incomeTaxSlabs: {
    default: TaxSlab[];
    // Additional slab sets can be keyed by taxpayer category
    // (e.g. female, senior, disabled, freedom-fighter) once those
    // categories and figures are confirmed.
    [taxpayerCategory: string]: TaxSlab[] | string | undefined;
  };

  exemptions: Record<string, unknown>;
  deductions: Record<string, unknown>;
  rebates: Record<string, unknown>;
  surcharge: Record<string, unknown>;
  minimumTax: Record<string, unknown>;
  specialRules: Record<string, unknown>;
}

/** A config file for a not-yet-configured year exports this instead of
 * a real TaxRuleConfig, so the engine can fail loudly and clearly. */
export type UnconfiguredTaxRuleConfig = null;
