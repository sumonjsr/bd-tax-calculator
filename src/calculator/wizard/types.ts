import type {
  AgriculturalIncome,
  BusinessIncome,
  CapitalGainTransaction,
  FinancialAssetIncome,
  ForeignIncome,
  HousePropertyIncome,
  InvestmentRebateItem,
  OtherSourceIncome,
  SalaryIncome,
  TaxCredits,
  TaxpayerProfile,
} from "../../types/tax";

export type IncomeCategoryKey =
  | "salary"
  | "houseProperty"
  | "business"
  | "agricultural"
  | "capitalGains"
  | "financialAssets"
  | "otherSources"
  | "foreignIncome";

export const INCOME_CATEGORY_LABELS: Record<IncomeCategoryKey, string> = {
  salary: "বেতন / চাকরি",
  houseProperty: "গৃহসম্পত্তি",
  business: "ব্যবসা / পেশা",
  agricultural: "কৃষি আয়",
  capitalGains: "মূলধনী মুনাফা",
  financialAssets: "আর্থিক সম্পদ",
  otherSources: "অন্যান্য উৎস",
  foreignIncome: "বৈদেশিক আয়",
};

/** All 8 categories now have a working step form. */
export const IMPLEMENTED_CATEGORIES: IncomeCategoryKey[] = [
  "salary",
  "houseProperty",
  "business",
  "agricultural",
  "capitalGains",
  "financialAssets",
  "otherSources",
  "foreignIncome",
];

export const emptySalaryIncome: SalaryIncome = {
  basicSalary: 0,
  houseRentAllowance: 0,
  medicalAllowance: 0,
  conveyanceAllowance: 0,
  festivalBonus: 0,
  performanceBonus: 0,
  otherAllowances: 0,
  employerBenefits: 0,
  providentFundIncome: 0,
  gratuity: 0,
  pension: 0,
  otherEmploymentBenefits: 0,
  tdsDeducted: 0,
};

export const emptyHousePropertyEntry: HousePropertyIncome = {
  propertyType: "residential",
  grossRentalIncome: 0,
  vacancyAdjustment: 0,
  municipalTaxes: 0,
  mortgageInterest: 0,
  insurancePremium: 0,
  tdsDeducted: 0,
};

export const emptyBusinessEntry: BusinessIncome = {
  grossTurnover: 0,
  totalExpense: 0,
  tdsDeducted: 0,
  advanceTaxPaid: 0,
};

export const emptyAgriculturalIncome: AgriculturalIncome = {
  hasBooksOfAccounts: false,
  cropSalesReceipts: 0,
  actualProductionCost: 0,
  landLeaseRent: 0,
  landRevenuePaid: 0,
  loanInterestPaid: 0,
  insurancePremium: 0,
  depreciation: 0,
  irrigationMaintenanceExpense: 0,
  fisheriesIncome: 0,
  poultryIncome: 0,
  dairyMushroomNurseryIncome: 0,
  tdsDeducted: 0,
};

export const emptyCapitalGainEntry: CapitalGainTransaction = {
  assetType: "real-estate",
  saleConsideration: 0,
  mouzaValue: 0,
  costOfAcquisition: 0,
  costOfImprovement: 0,
  transferExpenses: 0,
  holdingPeriodMonths: 0,
  tdsDeducted: 0,
  isSponsorDirector: false,
};

export const emptyFinancialAssetIncome: FinancialAssetIncome = {
  bankInterest: 0,
  savingsCertificateIncome: 0,
  fixedDepositIncome: 0,
  governmentSecurities: 0,
  bondsAndDebentures: 0,
  dividend: 0,
  otherFinancialAssetIncome: 0,
  tdsDeducted: 0,
};

export const emptyOtherSourceEntry: OtherSourceIncome = {
  category: "bank-interest",
  grossAmount: 0,
  bankChargesPaid: 0,
  tdsDeducted: 0,
};

export const emptyForeignIncomeEntry: ForeignIncome = {
  country: "",
  incomeType: "",
  grossAmount: 0,
  receivedViaLegalBankingChannel: true,
  foreignTaxPaid: 0,
};

export const emptyProfile: TaxpayerProfile = {
  assessmentYear: "2026-2027",
  age: 30,
  hasTin: true,
  hasForeignIncome: false,
};

export const emptyCredits: TaxCredits = {
  totalTdsDeducted: 0,
  advanceTaxPaid: 0,
  otherEligibleCredits: 0,
};

export interface WizardState {
  profile: TaxpayerProfile;
  selectedCategories: IncomeCategoryKey[];
  salaryIncome: SalaryIncome;
  houseProperty: HousePropertyIncome[];
  business: BusinessIncome[];
  agricultural: AgriculturalIncome;
  capitalGains: CapitalGainTransaction[];
  financialAssets: FinancialAssetIncome;
  otherSources: OtherSourceIncome[];
  foreignIncome: ForeignIncome[];
  investmentRebateItems: InvestmentRebateItem[];
  credits: TaxCredits;
}

export const emptyWizardState: WizardState = {
  profile: emptyProfile,
  selectedCategories: [],
  salaryIncome: emptySalaryIncome,
  houseProperty: [],
  business: [],
  agricultural: emptyAgriculturalIncome,
  capitalGains: [],
  financialAssets: emptyFinancialAssetIncome,
  otherSources: [],
  foreignIncome: [],
  investmentRebateItems: [],
  credits: emptyCredits,
};
