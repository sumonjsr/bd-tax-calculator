import type { SalaryIncome } from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";

interface SalaryStepProps {
  stepIndex: number;
  totalSteps: number;
  salaryIncome: SalaryIncome;
  onChange: (salaryIncome: SalaryIncome) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function SalaryStep({
  stepIndex,
  totalSteps,
  salaryIncome,
  onChange,
  onBack,
  onNext,
}: SalaryStepProps) {
  const set = <K extends keyof SalaryIncome>(key: K, value: SalaryIncome[K]) =>
    onChange({ ...salaryIncome, [key]: value });

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="বেতন ও চাকরির আয়"
      description="বাৎসরিক অঙ্ক লিখুন। যা প্রযোজ্য নয় সেটা শূন্য রেখে দিন।"
      onBack={onBack}
      onNext={onNext}
    >
      <FormSection title="নিয়মিত বেতন">
        <NumberField id="basicSalary" label="মূল বেতন" value={salaryIncome.basicSalary} onChange={(v) => set("basicSalary", v)} />
        <NumberField id="houseRentAllowance" label="বাড়ি ভাড়া ভাতা" value={salaryIncome.houseRentAllowance} onChange={(v) => set("houseRentAllowance", v)} />
        <NumberField id="medicalAllowance" label="চিকিৎসা ভাতা" value={salaryIncome.medicalAllowance} onChange={(v) => set("medicalAllowance", v)} />
        <NumberField id="conveyanceAllowance" label="যাতায়াত ভাতা" value={salaryIncome.conveyanceAllowance} onChange={(v) => set("conveyanceAllowance", v)} />
      </FormSection>

      <FormSection title="বোনাস ও অন্যান্য পাওনা">
        <NumberField id="festivalBonus" label="উৎসব বোনাস" value={salaryIncome.festivalBonus} onChange={(v) => set("festivalBonus", v)} />
        <NumberField id="performanceBonus" label="পারফরম্যান্স বোনাস" value={salaryIncome.performanceBonus} onChange={(v) => set("performanceBonus", v)} />
        <NumberField id="otherAllowances" label="অন্যান্য ভাতা" value={salaryIncome.otherAllowances} onChange={(v) => set("otherAllowances", v)} />
        <NumberField id="employerBenefits" label="নিয়োগকর্তার দেওয়া সুবিধা (Perquisites)" value={salaryIncome.employerBenefits} onChange={(v) => set("employerBenefits", v)} />
      </FormSection>

      <FormSection title="অবসর ও অবসান-সংক্রান্ত সুবিধা">
        <NumberField id="providentFundIncome" label="ভবিষ্য তহবিলের আয়" value={salaryIncome.providentFundIncome} onChange={(v) => set("providentFundIncome", v)} />
        <NumberField id="gratuity" label="গ্র্যাচুইটি" value={salaryIncome.gratuity} onChange={(v) => set("gratuity", v)} />
        <NumberField id="pension" label="পেনশন" value={salaryIncome.pension} onChange={(v) => set("pension", v)} />
        <NumberField id="otherEmploymentBenefits" label="অন্যান্য চাকরি-সংক্রান্ত সুবিধা" value={salaryIncome.otherEmploymentBenefits} onChange={(v) => set("otherEmploymentBenefits", v)} />
      </FormSection>

      <FormSection title="ইতিমধ্যে পরিশোধিত কর">
        <NumberField
          id="tdsDeducted"
          label="নিয়োগকর্তার কর্তনকৃত উৎসে কর (TDS)"
          value={salaryIncome.tdsDeducted}
          onChange={(v) => set("tdsDeducted", v)}
        />
      </FormSection>
    </StepShell>
  );
}
