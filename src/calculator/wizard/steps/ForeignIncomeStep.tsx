import type { ForeignIncome } from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import ToggleField from "../../../components/forms/ToggleField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";
import { emptyForeignIncomeEntry } from "../types";

interface ForeignIncomeStepProps {
  stepIndex: number;
  totalSteps: number;
  entries: ForeignIncome[];
  onChange: (entries: ForeignIncome[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ForeignIncomeStep({
  stepIndex,
  totalSteps,
  entries,
  onChange,
  onBack,
  onNext,
}: ForeignIncomeStepProps) {
  const addEntry = () => onChange([...entries, { ...emptyForeignIncomeEntry }]);
  const updateEntry = (index: number, patch: Partial<ForeignIncome>) =>
    onChange(entries.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  const removeEntry = (index: number) => onChange(entries.filter((_, i) => i !== index));

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="বৈদেশিক আয়"
      description="বৈধ ব্যাংকিং চ্যানেলে আনা আয় সম্পূর্ণ করমুক্ত। অন্যভাবে আনা আয়ের জন্য পেশাদার পরামর্শ প্রয়োজন — সেক্ষেত্রে এই ক্যালকুলেটর হিসাব করবে না।"
      onBack={onBack}
      onNext={onNext}
    >
      {entries.length === 0 && (
        <p className="rounded-sm border border-dashed border-sage/40 px-4 py-6 text-center text-sm text-ink/50">
          এখনো কোনো আয় যোগ করা হয়নি।
        </p>
      )}

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <FormSection key={index} title={`আয় ${index + 1}`}>
            <div>
              <label htmlFor={`country-${index}`} className="block text-sm font-medium text-ink/80">
                দেশ
              </label>
              <input
                id={`country-${index}`}
                type="text"
                value={entry.country}
                onChange={(e) => updateEntry(index, { country: e.target.value })}
                className="mt-1.5 w-full rounded-sm border border-sage/40 bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <div>
              <label htmlFor={`income-type-${index}`} className="block text-sm font-medium text-ink/80">
                আয়ের ধরন
              </label>
              <input
                id={`income-type-${index}`}
                type="text"
                placeholder="যেমন: ফ্রিল্যান্সিং, বেতন, পরামর্শ"
                value={entry.incomeType}
                onChange={(e) => updateEntry(index, { incomeType: e.target.value })}
                className="mt-1.5 w-full rounded-sm border border-sage/40 bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-gold placeholder:text-ink/30"
              />
            </div>
            <NumberField
              id={`foreign-amount-${index}`}
              label="মোট আয়"
              value={entry.grossAmount}
              onChange={(v) => updateEntry(index, { grossAmount: v })}
            />
            <ToggleField
              id={`legal-channel-${index}`}
              label="বৈধ ব্যাংকিং চ্যানেলে আনা হয়েছে"
              checked={entry.receivedViaLegalBankingChannel}
              onChange={(v) => updateEntry(index, { receivedViaLegalBankingChannel: v })}
              hint="ব্যাংক ওয়্যার, MFS (bKash/Nagad), Payoneer/Wise ইত্যাদি বৈধ চ্যানেল ধরা হয়।"
            />
            <NumberField
              id={`foreign-tax-paid-${index}`}
              label="বিদেশে পরিশোধিত কর (যদি থাকে)"
              value={entry.foreignTaxPaid}
              onChange={(v) => updateEntry(index, { foreignTaxPaid: v })}
              hint="এই পরিমাণ স্বয়ংক্রিয়ভাবে ক্রেডিট হিসেবে সমন্বয় হবে না — DTAA-ভিত্তিক হিসাবের জন্য পেশাদার পরামর্শ নিন।"
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
        + আয় যোগ করুন
      </button>
    </StepShell>
  );
}
