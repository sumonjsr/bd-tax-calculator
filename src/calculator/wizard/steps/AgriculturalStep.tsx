import type { AgriculturalIncome } from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import ToggleField from "../../../components/forms/ToggleField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";

interface AgriculturalStepProps {
  stepIndex: number;
  totalSteps: number;
  value: AgriculturalIncome;
  onChange: (value: AgriculturalIncome) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function AgriculturalStep({
  stepIndex,
  totalSteps,
  value,
  onChange,
  onBack,
  onNext,
}: AgriculturalStepProps) {
  const set = <K extends keyof AgriculturalIncome>(key: K, v: AgriculturalIncome[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="কৃষি আয়"
      description="ফসল, জমি ভাড়া, এবং সংশ্লিষ্ট কৃষি ব্যবসা (মৎস্য, পোল্ট্রি, ডেইরি ইত্যাদি) একসাথে এখানে দিন।"
      onBack={onBack}
      onNext={onNext}
    >
      <FormSection title="ফসল থেকে আয়">
        <ToggleField
          id="hasBooksOfAccounts"
          label="হিসাবের বই সংরক্ষণ করেন"
          checked={value.hasBooksOfAccounts}
          onChange={(v) => set("hasBooksOfAccounts", v)}
          hint="না থাকলে উৎপাদন খরচ হিসেবে বিক্রয়ের ৬০% স্বয়ংক্রিয়ভাবে বাদ যাবে।"
        />
        <NumberField
          id="cropSalesReceipts"
          label="ফসল বিক্রয়ের মোট আয়"
          value={value.cropSalesReceipts}
          onChange={(v) => set("cropSalesReceipts", v)}
        />
        {value.hasBooksOfAccounts && (
          <NumberField
            id="actualProductionCost"
            label="প্রকৃত উৎপাদন খরচ"
            value={value.actualProductionCost}
            onChange={(v) => set("actualProductionCost", v)}
          />
        )}
        <NumberField
          id="landLeaseRent"
          label="জমি ভাড়া থেকে আয়"
          value={value.landLeaseRent}
          onChange={(v) => set("landLeaseRent", v)}
        />
      </FormSection>

      <FormSection title="অনুমোদনযোগ্য খরচ">
        <NumberField id="landRevenuePaid" label="ভূমি রাজস্ব" value={value.landRevenuePaid} onChange={(v) => set("landRevenuePaid", v)} />
        <NumberField id="loanInterestPaid" label="ঋণের সুদ" value={value.loanInterestPaid} onChange={(v) => set("loanInterestPaid", v)} />
        <NumberField id="agriInsurancePremium" label="বীমা প্রিমিয়াম" value={value.insurancePremium} onChange={(v) => set("insurancePremium", v)} />
        <NumberField id="agriDepreciation" label="অবচয় (Depreciation)" value={value.depreciation} onChange={(v) => set("depreciation", v)} />
        <NumberField id="irrigationMaintenanceExpense" label="সেচ ব্যবস্থার রক্ষণাবেক্ষণ খরচ" value={value.irrigationMaintenanceExpense} onChange={(v) => set("irrigationMaintenanceExpense", v)} />
      </FormSection>

      <FormSection
        title="সংশ্লিষ্ট কৃষি ব্যবসা"
        description="মৎস্য/পোল্ট্রি: প্রথম ২০ লাখ টাকা করমুক্ত। ডেইরি/মাশরুম/নার্সারি: প্রথম ১০ লাখ টাকা করমুক্ত।"
      >
        <NumberField id="fisheriesIncome" label="মৎস্য চাষ থেকে আয়" value={value.fisheriesIncome} onChange={(v) => set("fisheriesIncome", v)} />
        <NumberField id="poultryIncome" label="পোল্ট্রি খামার থেকে আয়" value={value.poultryIncome} onChange={(v) => set("poultryIncome", v)} />
        <NumberField id="dairyMushroomNurseryIncome" label="ডেইরি / মাশরুম / নার্সারি থেকে আয়" value={value.dairyMushroomNurseryIncome} onChange={(v) => set("dairyMushroomNurseryIncome", v)} />
      </FormSection>

      <FormSection title="ইতিমধ্যে পরিশোধিত কর">
        <NumberField id="agriTds" label="কর্তনকৃত উৎসে কর (TDS)" value={value.tdsDeducted} onChange={(v) => set("tdsDeducted", v)} />
      </FormSection>
    </StepShell>
  );
}
