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
      title="Salary & employment income"
      description="Enter your annual figures. Leave anything that doesn't apply at zero."
      onBack={onBack}
      onNext={onNext}
    >
      <FormSection title="Regular pay">
        <NumberField id="basicSalary" label="Basic salary" value={salaryIncome.basicSalary} onChange={(v) => set("basicSalary", v)} />
        <NumberField id="houseRentAllowance" label="House rent allowance" value={salaryIncome.houseRentAllowance} onChange={(v) => set("houseRentAllowance", v)} />
        <NumberField id="medicalAllowance" label="Medical allowance" value={salaryIncome.medicalAllowance} onChange={(v) => set("medicalAllowance", v)} />
        <NumberField id="conveyanceAllowance" label="Conveyance allowance" value={salaryIncome.conveyanceAllowance} onChange={(v) => set("conveyanceAllowance", v)} />
      </FormSection>

      <FormSection title="Bonuses & other pay">
        <NumberField id="festivalBonus" label="Festival bonus" value={salaryIncome.festivalBonus} onChange={(v) => set("festivalBonus", v)} />
        <NumberField id="performanceBonus" label="Performance bonus" value={salaryIncome.performanceBonus} onChange={(v) => set("performanceBonus", v)} />
        <NumberField id="otherAllowances" label="Other allowances" value={salaryIncome.otherAllowances} onChange={(v) => set("otherAllowances", v)} />
        <NumberField id="employerBenefits" label="Employer benefits / perquisites" value={salaryIncome.employerBenefits} onChange={(v) => set("employerBenefits", v)} />
      </FormSection>

      <FormSection title="Retirement & separation benefits">
        <NumberField id="providentFundIncome" label="Provident fund income" value={salaryIncome.providentFundIncome} onChange={(v) => set("providentFundIncome", v)} />
        <NumberField id="gratuity" label="Gratuity" value={salaryIncome.gratuity} onChange={(v) => set("gratuity", v)} />
        <NumberField id="pension" label="Pension" value={salaryIncome.pension} onChange={(v) => set("pension", v)} />
        <NumberField id="otherEmploymentBenefits" label="Other employment benefits" value={salaryIncome.otherEmploymentBenefits} onChange={(v) => set("otherEmploymentBenefits", v)} />
      </FormSection>

      <FormSection title="Tax already paid">
        <NumberField
          id="tdsDeducted"
          label="TDS deducted by employer"
          value={salaryIncome.tdsDeducted}
          onChange={(v) => set("tdsDeducted", v)}
        />
      </FormSection>
    </StepShell>
  );
}
