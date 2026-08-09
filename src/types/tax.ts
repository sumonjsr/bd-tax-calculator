/**
 * Core type definitions for the Bangladesh Individual Income Tax engine.
 *
 * These types define the CONTRACT between the UI and the calculation
 * engine. The engine must never be called with anything other than these
 * shapes, and the UI must never compute tax itself — see
 * `src/calculator/engine` and `src/calculator/rules`.
 *
 * NOTE: This is Phase 1 scaffolding. Field lists are intentionally close
 * to the categories in the master brief, but nothing here encodes an
 * actual tax rule, rate, or threshold — those arrive in Phase 3 as
 * assessment-year rule configs once official figures are supplied.
 */

/** ISO-ish assessment year key, e.g. "2025-2026". Must match a folder
 * under src/calculator/rules/. */
export type AssessmentYear = string;

export type Gender = "male" | "female" | "other" | "prefer-not-to-say";

export interface TaxpayerProfile {
  assessmentYear: AssessmentYear;
  age: number;
  gender?: Gender;
  isDisabled?: boolean;
  isFreedomFighter?: boolean;
  location?: "dhaka-north" | "dhaka-south" | "chattogram" | "other-city" | "other";
  hasTin: boolean;
  hasForeignIncome: boolean;
  residentialStatus?: "resident" | "non-resident";
}

export interface SalaryIncome {
  basicSalary: number;
  houseRentAllowance: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  festivalBonus: number;
  performanceBonus: number;
  otherAllowances: number;
  employerBenefits: number;
  providentFundIncome: number;
  gratuity: number;
  pension: number;
  otherEmploymentBenefits: number;
  tdsDeducted: number;
}

export interface HousePropertyIncome {
  grossRentalIncome: number;
  vacancyAdjustment: number;
  municipalTaxes: number;
  interestOnHousingLoan: number;
  repairsAndMaintenance: number;
  otherAllowableExpenses: number;
  tdsDeducted: number;
}

export interface BusinessIncome {
  grossReceipts: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  salaryAndWages: number;
  rent: number;
  utilities: number;
  depreciation: number;
  interest: number;
  otherAllowableExpenses: number;
  disallowedExpenses: number;
  tdsDeducted: number;
  advanceTaxPaid: number;
}

export interface AgriculturalIncome {
  grossIncome: number;
  allowableExpenses: number;
  tdsDeducted: number;
}

export interface CapitalGainTransaction {
  assetType: string;
  acquisitionDate: string;
  purchaseValue: number;
  improvementCost: number;
  sellingPrice: number;
  sellingExpenses: number;
  tdsDeducted: number;
}

export interface FinancialAssetIncome {
  bankInterest: number;
  savingsCertificateIncome: number;
  fixedDepositIncome: number;
  governmentSecurities: number;
  bondsAndDebentures: number;
  dividend: number;
  otherFinancialAssetIncome: number;
  tdsDeducted: number;
}

export interface OtherSourceIncome {
  category: string;
  amount: number;
  tdsDeducted: number;
}

export interface ForeignIncome {
  country: string;
  incomeType: string;
  grossAmount: number;
  foreignTaxPaid: number;
}

export interface InvestmentRebateItem {
  category: string;
  amount: number;
}

export interface TaxCredits {
  totalTdsDeducted: number;
  advanceTaxPaid: number;
  otherEligibleCredits: number;
}

/** The full input model handed to the tax engine. Every field beyond
 * `profile` is optional / defaults to an empty array so the UI can send
 * only the sections the taxpayer actually filled in (progressive
 * disclosure per Section 6 of the brief). */
export interface TaxCalculationInput {
  profile: TaxpayerProfile;
  salaryIncome?: SalaryIncome;
  houseProperty?: HousePropertyIncome[];
  business?: BusinessIncome[];
  agricultural?: AgriculturalIncome[];
  capitalGains?: CapitalGainTransaction[];
  financialAssets?: FinancialAssetIncome;
  otherSources?: OtherSourceIncome[];
  foreignIncome?: ForeignIncome[];
  exemptIncome?: number;
  investmentRebateItems?: InvestmentRebateItem[];
  credits?: TaxCredits;
}

/** Line-by-line breakdown returned alongside the final number so the
 * result screen can render an explanation instead of a bare figure
 * (Section 21 of the brief). */
export interface TaxCalculationStep {
  label: string;
  amount: number;
  note?: string;
}

export interface TaxCalculationResult {
  assessmentYear: AssessmentYear;
  grossIncome: number;
  exemptIncome: number;
  totalTaxableIncome: number;
  taxBeforeRebate: number;
  investmentRebate: number;
  taxAfterRebate: number;
  surcharge: number;
  minimumTax: number;
  finalTaxLiability: number;
  totalCreditsApplied: number;
  taxPayable: number;
  refundDue: number;
  steps: TaxCalculationStep[];
}
