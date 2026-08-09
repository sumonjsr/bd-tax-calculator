import type { AssessmentYear } from "../../types/tax";

export interface TaxSlabBand {
  widthAboveThreshold: number | null;
  rate: number;
}

export type ThresholdCategory =
  | "general"
  | "female-or-senior"
  | "third-gender"
  | "disabled"
  | "freedom-fighter";

export interface SurchargeBand {
  minNetWealth: number;
  maxNetWealth: number | null;
  rate: number;
  note?: string;
}

export interface InvestmentRebateCategoryRule {
  category: string;
  label: string;
  perItemCap: number | null;
  capAsPercentOf?: { field: "sumAssured"; percent: number };
}

export interface TaxRuleConfig {
  assessmentYear: AssessmentYear;
  incomeYear: string;
  source: string;
  lastUpdated: string;
  notes?: string;

  taxFreeThresholds: Record<ThresholdCategory, number>;
  disabledChildAllowance: number;

  incomeTaxSlabBands: TaxSlabBand[];
  nonResidentFlatRate: number;

  salaryExemption: {
    fraction: number;
    cap: number;
  };

  houseProperty: {
    statutoryRepairAllowance: {
      residential: number;
      commercial: number;
    };
  };

  investmentRebate: {
    eligibleCategories: InvestmentRebateCategoryRule[];
    formula: {
      maxPercentOfTaxableIncome: number;
      percentOfEligibleInvestment: number;
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

  advanceTax: {
    liabilityThreshold: number;
    installments: number;
  };
}

export type UnconfiguredTaxRuleConfig = null;