import { useMemo, useState } from "react";
import type { TaxCalculationInput } from "../types/tax";
import {
  IMPLEMENTED_CATEGORIES,
  emptyWizardState,
  type IncomeCategoryKey,
  type WizardState,
} from "../calculator/wizard/types";
import ProfileStep from "../calculator/wizard/steps/ProfileStep";
import IncomeSelectionStep from "../calculator/wizard/steps/IncomeSelectionStep";
import SalaryStep from "../calculator/wizard/steps/SalaryStep";
import HousePropertyStep from "../calculator/wizard/steps/HousePropertyStep";
import BusinessStep from "../calculator/wizard/steps/BusinessStep";
import AgriculturalStep from "../calculator/wizard/steps/AgriculturalStep";
import CapitalGainsStep from "../calculator/wizard/steps/CapitalGainsStep";
import FinancialAssetsStep from "../calculator/wizard/steps/FinancialAssetsStep";
import OtherSourcesStep from "../calculator/wizard/steps/OtherSourcesStep";
import ForeignIncomeStep from "../calculator/wizard/steps/ForeignIncomeStep";
import InvestmentRebateStep from "../calculator/wizard/steps/InvestmentRebateStep";
import CreditsStep from "../calculator/wizard/steps/CreditsStep";
import ResultStep from "../calculator/wizard/steps/ResultStep";

type StepKind =
  | "profile"
  | "incomeSelection"
  | IncomeCategoryKey
  | "investmentRebate"
  | "credits"
  | "result";

// Fixed order income category steps appear in, regardless of selection order.
const CATEGORY_ORDER: IncomeCategoryKey[] = [
  "salary",
  "houseProperty",
  "business",
  "agricultural",
  "capitalGains",
  "financialAssets",
  "otherSources",
  "foreignIncome",
];

export default function Calculator() {
  const [state, setState] = useState<WizardState>(emptyWizardState);
  const [stepIndex, setStepIndex] = useState(0);

  const steps: StepKind[] = useMemo(() => {
    const implementedSelected = CATEGORY_ORDER.filter(
      (c) => state.selectedCategories.includes(c) && IMPLEMENTED_CATEGORIES.includes(c),
    );
    return [
      "profile",
      "incomeSelection",
      ...implementedSelected,
      "investmentRebate",
      "credits",
      "result",
    ];
  }, [state.selectedCategories]);

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));
  const startOver = () => {
    setState(emptyWizardState);
    setStepIndex(0);
  };

  const engineInput: TaxCalculationInput = useMemo(() => {
    const has = (key: IncomeCategoryKey) => state.selectedCategories.includes(key);
    return {
      profile: state.profile,
      salaryIncome: has("salary") ? state.salaryIncome : undefined,
      houseProperty: has("houseProperty") ? state.houseProperty : undefined,
      business: has("business") ? state.business : undefined,
      agricultural: has("agricultural") ? state.agricultural : undefined,
      capitalGains: has("capitalGains") ? state.capitalGains : undefined,
      financialAssets: has("financialAssets") ? state.financialAssets : undefined,
      otherSources: has("otherSources") ? state.otherSources : undefined,
      foreignIncome: has("foreignIncome") ? state.foreignIncome : undefined,
      investmentRebateItems: state.investmentRebateItems,
      credits: state.credits,
    };
  }, [state]);

  const current = steps[stepIndex];
  const shared = { stepIndex, totalSteps: steps.length };

  switch (current) {
    case "profile":
      return (
        <ProfileStep
          {...shared}
          profile={state.profile}
          onChange={(profile) => setState((s) => ({ ...s, profile }))}
          onNext={goNext}
        />
      );

    case "incomeSelection":
      return (
        <IncomeSelectionStep
          {...shared}
          selected={state.selectedCategories}
          onChange={(selectedCategories) => setState((s) => ({ ...s, selectedCategories }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "salary":
      return (
        <SalaryStep
          {...shared}
          salaryIncome={state.salaryIncome}
          onChange={(salaryIncome) => setState((s) => ({ ...s, salaryIncome }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "houseProperty":
      return (
        <HousePropertyStep
          {...shared}
          entries={state.houseProperty}
          onChange={(houseProperty) => setState((s) => ({ ...s, houseProperty }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "business":
      return (
        <BusinessStep
          {...shared}
          entries={state.business}
          onChange={(business) => setState((s) => ({ ...s, business }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "agricultural":
      return (
        <AgriculturalStep
          {...shared}
          value={state.agricultural}
          onChange={(agricultural) => setState((s) => ({ ...s, agricultural }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "capitalGains":
      return (
        <CapitalGainsStep
          {...shared}
          entries={state.capitalGains}
          onChange={(capitalGains) => setState((s) => ({ ...s, capitalGains }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "financialAssets":
      return (
        <FinancialAssetsStep
          {...shared}
          value={state.financialAssets}
          onChange={(financialAssets) => setState((s) => ({ ...s, financialAssets }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "otherSources":
      return (
        <OtherSourcesStep
          {...shared}
          entries={state.otherSources}
          onChange={(otherSources) => setState((s) => ({ ...s, otherSources }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "foreignIncome":
      return (
        <ForeignIncomeStep
          {...shared}
          entries={state.foreignIncome}
          onChange={(foreignIncome) => setState((s) => ({ ...s, foreignIncome }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "investmentRebate":
      return (
        <InvestmentRebateStep
          {...shared}
          items={state.investmentRebateItems}
          onChange={(investmentRebateItems) => setState((s) => ({ ...s, investmentRebateItems }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "credits":
      return (
        <CreditsStep
          {...shared}
          credits={state.credits}
          onChange={(credits) => setState((s) => ({ ...s, credits }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "result":
      return (
        <ResultStep {...shared} input={engineInput} onBack={goBack} onStartOver={startOver} />
      );

    default:
      return null;
  }
}
