import type { TaxCredits } from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";

interface CreditsStepProps {
  stepIndex: number;
  totalSteps: number;
  credits: TaxCredits;
  onChange: (credits: TaxCredits) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function CreditsStep({
  stepIndex,
  totalSteps,
  credits,
  onChange,
  onBack,
  onNext,
}: CreditsStepProps) {
  const set = <K extends keyof TaxCredits>(key: K, value: TaxCredits[K]) =>
    onChange({ ...credits, [key]: value });

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="Any other tax already paid?"
      description="TDS you already entered on income forms is counted automatically — this is for anything extra, like contract TDS."
      onBack={onBack}
      onNext={onNext}
    >
      <FormSection title="Additional credits">
        <NumberField
          id="totalTdsDeducted"
          label="Other TDS not already entered elsewhere"
          value={credits.totalTdsDeducted}
          onChange={(v) => set("totalTdsDeducted", v)}
        />
        <NumberField
          id="advanceTaxPaid"
          label="Advance tax paid"
          value={credits.advanceTaxPaid}
          onChange={(v) => set("advanceTaxPaid", v)}
        />
        <NumberField
          id="otherEligibleCredits"
          label="Other eligible tax credits"
          value={credits.otherEligibleCredits}
          onChange={(v) => set("otherEligibleCredits", v)}
        />
      </FormSection>
    </StepShell>
  );
}
