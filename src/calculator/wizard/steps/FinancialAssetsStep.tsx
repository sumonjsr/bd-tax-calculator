import type { FinancialAssetIncome } from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";

interface FinancialAssetsStepProps {
  stepIndex: number;
  totalSteps: number;
  value: FinancialAssetIncome;
  onChange: (value: FinancialAssetIncome) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function FinancialAssetsStep({
  stepIndex,
  totalSteps,
  value,
  onChange,
  onBack,
  onNext,
}: FinancialAssetsStepProps) {
  const set = <K extends keyof FinancialAssetIncome>(key: K, v: FinancialAssetIncome[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="আর্থিক সম্পদ থেকে আয়"
      description="ব্যাংক সুদ, সঞ্চয়পত্র, ডিভিডেন্ড ইত্যাদি এখানে দিন।"
      onBack={onBack}
      onNext={onNext}
    >
      <FormSection title="আয়">
        <NumberField id="bankInterest" label="ব্যাংক আমানতের সুদ" value={value.bankInterest} onChange={(v) => set("bankInterest", v)} />
        <NumberField id="savingsCertificateIncome" label="সঞ্চয়পত্রের মুনাফা" value={value.savingsCertificateIncome} onChange={(v) => set("savingsCertificateIncome", v)} />
        <NumberField id="fixedDepositIncome" label="স্থায়ী আমানতের (FDR) আয়" value={value.fixedDepositIncome} onChange={(v) => set("fixedDepositIncome", v)} />
        <NumberField id="governmentSecurities" label="সরকারি সিকিউরিটিজ থেকে আয়" value={value.governmentSecurities} onChange={(v) => set("governmentSecurities", v)} />
        <NumberField id="bondsAndDebentures" label="বন্ড ও ডিবেঞ্চার থেকে আয়" value={value.bondsAndDebentures} onChange={(v) => set("bondsAndDebentures", v)} />
        <NumberField id="dividend" label="ডিভিডেন্ড" value={value.dividend} onChange={(v) => set("dividend", v)} />
        <NumberField id="otherFinancialAssetIncome" label="অন্যান্য আর্থিক সম্পদ থেকে আয়" value={value.otherFinancialAssetIncome} onChange={(v) => set("otherFinancialAssetIncome", v)} />
      </FormSection>

      <FormSection title="ইতিমধ্যে পরিশোধিত কর">
        <NumberField id="financialTds" label="কর্তনকৃত উৎসে কর (TDS)" value={value.tdsDeducted} onChange={(v) => set("tdsDeducted", v)} />
      </FormSection>
    </StepShell>
  );
}
