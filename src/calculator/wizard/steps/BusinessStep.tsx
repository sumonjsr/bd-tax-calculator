import type { BusinessIncome } from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";
import { emptyBusinessEntry } from "../types";

interface BusinessStepProps {
  stepIndex: number;
  totalSteps: number;
  entries: BusinessIncome[];
  onChange: (entries: BusinessIncome[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function BusinessStep({
  stepIndex,
  totalSteps,
  entries,
  onChange,
  onBack,
  onNext,
}: BusinessStepProps) {
  const addEntry = () => onChange([...entries, { ...emptyBusinessEntry }]);
  const updateEntry = (index: number, patch: Partial<BusinessIncome>) =>
    onChange(entries.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  const removeEntry = (index: number) => onChange(entries.filter((_, i) => i !== index));

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="ব্যবসা / পেশার আয়"
      description="এককভাবে পরিচালিত ব্যবসার (Sole Proprietorship) জন্য — মোট টার্নওভার ও মোট খরচ (সব খাত মিলিয়ে) দিলেই আমরা লাভ বের করে নেব।"
      onBack={onBack}
      onNext={onNext}
    >
      {entries.length === 0 && (
        <p className="rounded-sm border border-dashed border-sage/40 px-4 py-6 text-center text-sm text-ink/50">
          এখনো কোনো ব্যবসা যোগ করা হয়নি।
        </p>
      )}

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <FormSection key={index} title={`ব্যবসা ${index + 1}`}>
            <NumberField
              id={`turnover-${index}`}
              label="মোট টার্নওভার"
              value={entry.grossTurnover}
              onChange={(v) => updateEntry(index, { grossTurnover: v })}
            />
            <NumberField
              id={`expense-${index}`}
              label="মোট খরচ (সব খাত মিলিয়ে)"
              value={entry.totalExpense}
              onChange={(v) => updateEntry(index, { totalExpense: v })}
            />
            <NumberField
              id={`business-tds-${index}`}
              label="কর্তনকৃত উৎসে কর (TDS)"
              value={entry.tdsDeducted}
              onChange={(v) => updateEntry(index, { tdsDeducted: v })}
            />
            <NumberField
              id={`business-advance-${index}`}
              label="পরিশোধিত অগ্রিম কর"
              value={entry.advanceTaxPaid}
              onChange={(v) => updateEntry(index, { advanceTaxPaid: v })}
            />
            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="text-sm text-brick hover:underline"
            >
              মুছে ফেলুন
            </button>
          </FormSection>
        ))}
      </div>

      <button
        type="button"
        onClick={addEntry}
        className="w-full rounded-sm border border-dashed border-sage/40 py-3 text-sm font-medium text-ink/70 hover:border-gold hover:text-ink"
      >
        + ব্যবসা যোগ করুন
      </button>
    </StepShell>
  );
}
