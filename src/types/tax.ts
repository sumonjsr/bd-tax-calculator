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

/** Business/Profession income — Sole Proprietorship only (individually
 * owned business; not a company or partnership, which file separate
 * entity-level returns and are out of scope for this calculator).
 *
 * Simplified to two inputs: Net Profit Before Tax = grossTurnover -
 * totalExpense (can be negative — a business loss). */
export interface BusinessIncome {
  grossTurnover: number;
  /** All-inclusive total business expense for the year. */
  totalExpense: number;
  tdsDeducted: number;
  advanceTaxPaid: number;
}

/** Agricultural income (Sections 38-44). A single object, not an
 * array — the law computes crop income, lease rent, and allied
 * business income together as one combined agricultural calculation
 * per taxpayer, not per separate holding. */
export interface AgriculturalIncome {
  hasBooksOfAccounts: boolean;
  cropSalesReceipts: number;
  /** Only used when hasBooksOfAccounts is true. When false, the
   * statutory 60%-of-receipts production cost applies instead. */
  actualProductionCost: number;
  /** No statutory 60% deduction applies to lease rent — only to
   * income from crops the taxpayer actually cultivated. */
  landLeaseRent: number;
  landRevenuePaid: number;
  loanInterestPaid: number;
  insurancePremium: number;
  depreciation: number;
  irrigationMaintenanceExpense: number;
  /** Allied agro-business income — each has its own exemption
   * threshold before the excess is taxed at slab rates. */
  fisheriesIncome: number;
  poultryIncome: number;
  dairyMushroomNurseryIncome: number;
  tdsDeducted: number;
}

export type CapitalGainAssetType =
  | "real-estate"
  | "listed-shares"
  | "unlisted-shares"
  | "govt-bond";

export interface CapitalGainTransaction {
  assetType: CapitalGainAssetType;
  saleConsideration: number;
  /** Real estate only — deed/mouza value. Deemed consideration is the
   * higher of saleConsideration and this. */
  mouzaValue?: number;
  costOfAcquisition: number;
  costOfImprovement: number;
  transferExpenses: number;
  holdingPeriodMonths: number;
  tdsDeducted: number;
  /** Listed shares only — sponsor/director gets a different flat rate. */
  isSponsorDirector?: boolean;
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

export type OtherSourceCategory =
  | "bank-interest"
  | "dividend"
  | "sanchaypatra"
  | "lottery"
  | "other-regular";

export interface OtherSourceIncome {
  category: OtherSourceCategory;
  grossAmount: number;
  /** Only meaningful for "bank-interest" — bank charges/commission
   * deducted from the income (Sec 68). */
  bankChargesPaid?: number;
  tdsDeducted: number;
}

export interface ForeignIncome {
  country: string;
  incomeType: string;
  grossAmount: number;
  /** Whether this income was remitted into Bangladesh through a legal
   * banking channel — fully exempt if true (owner-confirmed). If
   * false, tax treatment is unconfigured and requires manual review. */
  receivedViaLegalBankingChannel: boolean;
  /** Foreign Tax Credit is unconfigured (owner-confirmed, DTAA-
   * dependent) — this amount is tracked but never applied as a credit. */
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

/** The full input model handed to the tax engine. Every field beyond
 * `profile` is optional / defaults to an empty array so the UI can send
 * only the sections the taxpayer actually filled in (progressive
 * disclosure per Section 6 of the brief). */
export interface TaxCalculationInput {
  profile: TaxpayerProfile;
  salaryIncome?: SalaryIncome;
  houseProperty?: HousePropertyIncome[];
  business?: BusinessIncome[];
  agricultural?: AgriculturalIncome;
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
  /** Which tax-free-threshold category was actually applied — reported
   * explicitly because a taxpayer can qualify for more than one, and
   * the engine always applies whichever is most favorable. */
  thresholdCategoryApplied: string;
  taxFreeThresholdApplied: number;
  taxBeforeRebate: number;
  investmentRebate: number;
  taxAfterRebate: number;
  surcharge: number;
  surchargeNote?: string;
  minimumTax: number;
  /** Regular tax through the minimum-tax comparison, before capital
   * gains tax is added — kept for transparency about where capital
   * gains sits in the pipeline. */
  regularTaxBeforeCapitalGains: number;
  /** Flat-rate capital gains tax (LTCG real estate, listed shares,
   * and the long-term-unlisted-shares lower-of comparison) — computed
   * separately and added directly to the regular tax, owner-confirmed
   * to bypass rebate/surcharge/minimum-tax entirely. */
  capitalGainsTax: number;
  finalTaxLiability: number;
  totalCreditsApplied: number;
  taxPayable: number;
  refundDue: number;
  /** True if estimated tax liability exceeds the advance-tax
   * threshold (BDT 6,00,000) — informational only, not a deduction. */
  advanceTaxInstallmentRequired: boolean;
  /** Non-calculated advisory flags — e.g. Environmental Surcharge,
   * which is a separate per-vehicle tax this engine does not compute
   * (no rate supplied yet) but which may still apply to the taxpayer. */
  advisoryNotes: string[];
  /** Sanchaypatra profit + lottery/prize winnings — Final Tax u/s 163.
   * Informational only: NOT included in totalTaxableIncome, and its
   * TDS is NOT part of totalCreditsApplied/taxPayable/refundDue. */
  finalTaxOtherSourcesIncome: number;
  finalTaxOtherSourcesTdsDeducted: number;
  steps: TaxCalculationStep[];
}
