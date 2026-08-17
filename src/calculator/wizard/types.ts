import type {
  InvestmentRebateItem,
  SalaryIncome,
  TaxCredits,
  TaxpayerProfile,
} from "../../types/tax";

/**
 * Income categories the wizard can collect. Only "salary" has a real
 * form so far — the rest are wired into the engine but still need
 * their step UI built (Phase 5 continues incrementally).
 */
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

/** Categories with a working step form. Others show a "coming soon"
 * placeholder if selected. */
export const IMPLEMENTED_CATEGORIES: IncomeCategoryKey[] = ["salary"];

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
  investmentRebateItems: InvestmentRebateItem[];
  credits: TaxCredits;
}

export const emptyWizardState: WizardState = {
  profile: emptyProfile,
  selectedCategories: [],
  salaryIncome: emptySalaryIncome,
  investmentRebateItems: [],
  credits: emptyCredits,
};
