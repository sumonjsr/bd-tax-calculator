import type { OtherSourceCategory, OtherSourceIncome } from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import SelectField from "../../../components/forms/SelectField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";
import { emptyOtherSourceEntry } from "../types";

interface OtherSourcesStepProps {
  stepIndex: number;
  totalSteps: number;
  entries: OtherSourceIncome[];
  onChange: (entries: OtherSourceIncome[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const CATEGORY_OPTIONS: Array<{ value: OtherSourceCategory; label: string }> = [
  { value: "bank-interest", label: "ব্যাংক সুদ" },
  { value: "dividend", label: "ডিভিডেন্ড" },
  { value: "sanchaypatra", label: "সঞ্চয়পত্রের মুনাফা (Final Tax)" },
  { value: "lottery", label: "লটারি / পুরস্কার (Final Tax)" },
  { value: "other-regular", label: "অন্যান্য নিয়মিত আয়" },
];

export default function OtherSourcesStep({
  stepIndex,
  totalSteps,
  entries,
  onChange,
  onBack,
  onNext,
}: OtherSourcesStepProps) {
  const addEntry = () => onChange([...entries, { ...emptyOtherSourceEntry }]);
  const updateEntry = (index: number, patch: Partial<OtherSourceIncome>) =>
    onChange(entries.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  const removeEntry = (index: number) => onChange(entries.filter((_, i) => i !== index));

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="অন্যান্য উৎস থেকে আয়"
      description="সঞ্চয়পত্র ও লটারি Final Tax হিসেবে গণ্য হয় — এগুলোর উৎসে কর সমন্বয়/ফেরতযোগ্য নয়।"
      onBack={onBack}
      onNext={onNext}
    >
      {entries.length === 0 && (
        <p className="rounded-sm border border-dashed border-sage/40 px-4 py-6 text-center text-sm text-ink/50">
          এখনো কিছু যোগ করা হয়নি।
        </p>
      )}

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <FormSection key={index} title={`আয় ${index + 1}`}>
            <SelectField
              id={`other-category-${index}`}
              label="খাত"
              value={entry.category}
              onChange={(v) => updateEntry(index, { category: v })}
              options={CATEGORY_OPTIONS}
            />
            <NumberField
              id={`other-amount-${index}`}
              label="মোট আয়"
              value={entry.grossAmount}
              onChange={(v) => updateEntry(index, { grossAmount: v })}
            />
            {entry.category === "bank-interest" && (
              <NumberField
                id={`bank-charges-${index}`}
                label="ব্যাংক চার্জ / কমিশন"
                value={entry.bankChargesPaid ?? 0}
                onChange={(v) => updateEntry(index, { bankChargesPaid: v })}
              />
            )}
            <NumberField
              id={`other-tds-${index}`}
              label="কর্তনকৃত উৎসে কর (TDS)"
              value={entry.tdsDeducted}
              onChange={(v) => updateEntry(index, { tdsDeducted: v })}
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
