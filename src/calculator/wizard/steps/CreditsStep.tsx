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
      title="আর কোনো কর ইতিমধ্যে পরিশোধ করেছেন?"
      description="আয়ের ফর্মে যে TDS আগেই লিখেছেন সেটা এমনিতেই হিসাবে চলে আসবে — এখানে শুধু বাড়তি কিছু থাকলে দিন, যেমন কন্ট্রাক্ট TDS।"
      onBack={onBack}
      onNext={onNext}
    >
      <FormSection title="বাড়তি ক্রেডিট">
        <NumberField
          id="totalTdsDeducted"
          label="অন্য কোথাও না লেখা TDS"
          value={credits.totalTdsDeducted}
          onChange={(v) => set("totalTdsDeducted", v)}
        />
        <NumberField
          id="advanceTaxPaid"
          label="পরিশোধিত অগ্রিম কর"
          value={credits.advanceTaxPaid}
          onChange={(v) => set("advanceTaxPaid", v)}
        />
        <NumberField
          id="otherEligibleCredits"
          label="অন্যান্য যোগ্য কর ক্রেডিট"
          value={credits.otherEligibleCredits}
          onChange={(v) => set("otherEligibleCredits", v)}
        />
      </FormSection>
    </StepShell>
  );
}
