/**
 * Core type definitions for the Bangladesh Individual Income Tax engine.
 *
 * These types define the CONTRACT between the UI and the calculation
 * engine. The engine must never be called with anything other than these
 * shapes, and the UI must never compute tax itself — see
 * `src/calculator/engine` and `src/calculator/rules`.
 */

export type AssessmentYear = string;

export type Gender = "male" | "female" | "third-gender" | "prefer-not-to-say";

export interface TaxpayerProfile {
  assessmentYear: AssessmentYear;
  age: number;
  gender?: Gender;
  isDisabled?: boolean;
  /** Gazetted War-Wounded Freedom Fighter or Gazetted July Fighter. */
  isFreedomFighter?: boolean;
  /** Number of disabled children this taxpayer is the parent/legal
   * guardian of — each adds a fixed allowance on top of the base
   * tax-free threshold. */
  disabledChildrenCount?: number;
  hasTin: boolean;
  hasForeignIncome: boolean;
  residentialStatus?: "resident" | "non-resident";
  /** First-time individual return filer — affects minimum tax. */
  isFirstTimeFiler?: boolean;

  /** Net wealth as of the wealth statement, in BDT. Needed for the
   * surcharge calculation. Optional because most taxpayers below the
   * surcharge threshold won't need to fill this in. */
  netWealth?: number;
  motorVehicleCount?: number;
  residentialPropertyAreaSqFt?: number;
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
  propertyType: "residential" | "commercial";
  grossRentalIncome: number;
  vacancyAdjustment: number;
  municipalTaxes: number;
  mortgageInterest: number;
  insurancePremium: number;
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

export type InvestmentRebateCategory =
  | "life-insurance"
  | "dps"
  | "government-securities-sanchayapatra"
  | "listed-securities"
  | "gpf-rpf"
  | "universal-pension-scheme";

export interface InvestmentRebateItem {
  category: InvestmentRebateCategory;
  amount: number;
  /** Required for "life-insurance" — the policy's sum assured, used to
   * cap eligible premium at 10% of sum assured. Ignored otherwise. */
  sumAssured?: number;
}

export interface TaxCredits {
  totalTdsDeducted: number;
  advanceTaxPaid: number;
  otherEligibleCredits: number;
}

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
  thresholdCategoryApplied: string;
  taxFreeThresholdApplied: number;
  taxBeforeRebate: number;
  investmentRebate: number;
  taxAfterRebate: number;
  surcharge: number;
  surchargeNote?: string;
  minimumTax: number;
  finalTaxLiability: number;
  totalCreditsApplied: number;
  taxPayable: number;
  refundDue: number;
  advanceTaxInstallmentRequired: boolean;
  /** Non-calculated advisory flags — e.g. Environmental Surcharge,
   * which is a separate per-vehicle tax this engine does not compute
   * (no rate supplied yet) but which may still apply to the taxpayer. */
  advisoryNotes: string[];
  steps: TaxCalculationStep[];
}