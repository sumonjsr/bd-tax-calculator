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
import InvestmentRebateStep from "../calculator/wizard/steps/InvestmentRebateStep";
import CreditsStep from "../calculator/wizard/steps/CreditsStep";
import ResultStep from "../calculator/wizard/steps/ResultStep";

type StepKind = "profile" | "incomeSelection" | IncomeCategoryKey | "investmentRebate" | "credits" | "result";

export default function Calculator() {
  const [state, setState] = useState<WizardState>(emptyWizardState);
  const [stepIndex, setStepIndex] = useState(0);

  // Dynamic step list: fixed steps, plus one step per selected income
  // category that has a real form (others are excluded until built).
  const steps: StepKind[] = useMemo(() => {
    const implementedSelected = state.selectedCategories.filter((c) =>
      IMPLEMENTED_CATEGORIES.includes(c),
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

  const engineInput: TaxCalculationInput = useMemo(
    () => ({
      profile: state.profile,
      salaryIncome: state.selectedCategories.includes("salary") ? state.salaryIncome : undefined,
      investmentRebateItems: state.investmentRebateItems,
      credits: state.credits,
    }),
    [state],
  );

  const current = steps[stepIndex];

  switch (current) {
    case "profile":
      return (
        <ProfileStep
          stepIndex={stepIndex}
          totalSteps={steps.length}
          profile={state.profile}
          onChange={(profile) => setState((s) => ({ ...s, profile }))}
          onNext={goNext}
        />
      );

    case "incomeSelection":
      return (
        <IncomeSelectionStep
          stepIndex={stepIndex}
          totalSteps={steps.length}
          selected={state.selectedCategories}
          onChange={(selectedCategories) => setState((s) => ({ ...s, selectedCategories }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "salary":
      return (
        <SalaryStep
          stepIndex={stepIndex}
          totalSteps={steps.length}
          salaryIncome={state.salaryIncome}
          onChange={(salaryIncome) => setState((s) => ({ ...s, salaryIncome }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "investmentRebate":
      return (
        <InvestmentRebateStep
          stepIndex={stepIndex}
          totalSteps={steps.length}
          items={state.investmentRebateItems}
          onChange={(investmentRebateItems) => setState((s) => ({ ...s, investmentRebateItems }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "credits":
      return (
        <CreditsStep
          stepIndex={stepIndex}
          totalSteps={steps.length}
          credits={state.credits}
          onChange={(credits) => setState((s) => ({ ...s, credits }))}
          onBack={goBack}
          onNext={goNext}
        />
      );

    case "result":
      return (
        <ResultStep
          stepIndex={stepIndex}
          totalSteps={steps.length}
          input={engineInput}
          onBack={goBack}
          onStartOver={startOver}
        />
      );

    default:
      return null;
  }
}
