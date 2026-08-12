import type { AssessmentYear } from "../../types/tax";

/**
 * Shape of a single assessment year's tax rule configuration.
 *
 * This mirrors the structure of the Bangladesh Income Tax Guidelines
 * document supplied by the site owner (Income Tax Act 2023 read with
 * the relevant Finance Act). Every numeric value here must trace back
 * to that supplied document — nothing here is estimated.
 */

/** A "next X taka at Y%" bracket, applied progressively above the
 * taxpayer's tax-free threshold. `widthAboveThreshold: null` means
 * "remaining balance" (the top, uncapped bracket). */
export interface TaxSlabBand {
  widthAboveThreshold: number | null;
  rate: number;
}

/** Tax-free-threshold categories. A taxpayer may qualify for more than
 * one (e.g. female AND disabled) — the engine applies whichever
 * threshold is highest. */
export type ThresholdCategory =
  | "general"
  | "female-or-senior"
  | "third-gender"
  | "disabled"
  | "freedom-fighter";

export interface SurchargeBand {
  minNetWealth: number;
  /** null = no upper bound (top band). */
  maxNetWealth: number | null;
  /** Rate as a decimal, applied to the taxpayer's tax liability. */
  rate: number;
  note?: string;
}

export interface InvestmentRebateCategoryRule {
  category: string;
  label: string;
  /** Per-item cap on eligible amount, if any (e.g. DPS: 120000/year).
   * `null` means no category-specific cap. */
  perItemCap: number | null;
  /** For life-insurance-style rules where eligibility is capped as a
   * percentage of a separate value (sum assured) rather than a flat
   * BDT cap. */
  capAsPercentOf?: { field: "sumAssured"; percent: number };
}

export interface TaxRuleConfig {
  assessmentYear: AssessmentYear;
  incomeYear: string;
  source: string;
  lastUpdated: string;
  notes?: string;

  taxFreeThresholds: Record<ThresholdCategory, number>;
  /** Additional flat allowance added to the threshold per qualifying
   * dependent (currently: per disabled child of the taxpayer). */
  disabledChildAllowance: number;

  incomeTaxSlabBands: TaxSlabBand[];
  nonResidentFlatRate: number;

  salaryExemption: {
    /** e.g. 1/3 -> fraction of gross salary that's exempt. */
    fraction: number;
    /** BDT cap on the exempt amount. */
    cap: number;
  };

  houseProperty: {
    statutoryRepairAllowance: {
      residential: number; // fraction of GAV, e.g. 0.25
      commercial: number; // fraction of GAV, e.g. 0.30
    };
  };

  investmentRebate: {
    eligibleCategories: InvestmentRebateCategoryRule[];
    formula: {
      /** Rebate cannot exceed this % of total taxable income. */
      maxPercentOfTaxableIncome: number;
      /** Rebate is this % of actual eligible investment. */
      percentOfEligibleInvestment: number;
      /** Absolute BDT ceiling regardless of the above. */
      absoluteCap: number;
    };
  };

  surcharge: {
    bands: SurchargeBand[];
  };

  minimumTax: {
    standard: number;
    firstTimeFiler: number;
  };

  business: {
    /** Section 163 turnover-based minimum tax rate for Sole
     * Proprietorship business income. When business income is
     * present, the overall minimum tax is whichever is higher: this
     * rate applied to gross turnover, or the standard/first-time-filer
     * minimum tax. */
    minimumTaxRateOnTurnover: number;
  };

  advanceTax: {
    /** Advance tax required if estimated tax liability exceeds this
     * amount (BDT), payable in equal quarterly installments. */
    liabilityThreshold: number;
    installments: number;
  };
}

export type UnconfiguredTaxRuleConfig = null;
