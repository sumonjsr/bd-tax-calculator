import type { HousePropertyIncome } from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import SelectField from "../../../components/forms/SelectField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";
import { emptyHousePropertyEntry } from "../types";

interface HousePropertyStepProps {
  stepIndex: number;
  totalSteps: number;
  entries: HousePropertyIncome[];
  onChange: (entries: HousePropertyIncome[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function HousePropertyStep({
  stepIndex,
  totalSteps,
  entries,
  onChange,
  onBack,
  onNext,
}: HousePropertyStepProps) {
  const addEntry = () => onChange([...entries, { ...emptyHousePropertyEntry }]);
  const updateEntry = (index: number, patch: Partial<HousePropertyIncome>) =>
    onChange(entries.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  const removeEntry = (index: number) => onChange(entries.filter((_, i) => i !== index));

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="গৃহসম্পত্তি থেকে আয়"
      description="প্রতিটি ভাড়া দেওয়া সম্পত্তির জন্য আলাদা এন্ট্রি যোগ করুন। মেরামত-খরচ আলাদা করে লিখতে হবে না — সেটা আইন অনুযায়ী স্বয়ংক্রিয়ভাবে হিসাব হয়ে যাবে।"
      onBack={onBack}
      onNext={onNext}
    >
      {entries.length === 0 && (
        <p className="rounded-sm border border-dashed border-sage/40 px-4 py-6 text-center text-sm text-ink/50">
          এখনো কোনো সম্পত্তি যোগ করা হয়নি।
        </p>
      )}

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <FormSection key={index} title={`সম্পত্তি ${index + 1}`}>
            <SelectField
              id={`property-type-${index}`}
              label="সম্পত্তির ধরন"
              value={entry.propertyType}
              onChange={(v) => updateEntry(index, { propertyType: v })}
              options={[
                { value: "residential", label: "আবাসিক" },
                { value: "commercial", label: "বাণিজ্যিক" },
              ]}
            />
            <NumberField
              id={`gross-rental-${index}`}
              label="মোট ভাড়া আয়"
              value={entry.grossRentalIncome}
              onChange={(v) => updateEntry(index, { grossRentalIncome: v })}
            />
            <NumberField
              id={`vacancy-${index}`}
              label="খালি থাকার সমন্বয় (Vacancy adjustment)"
              value={entry.vacancyAdjustment}
              onChange={(v) => updateEntry(index, { vacancyAdjustment: v })}
            />
            <NumberField
              id={`municipal-${index}`}
              label="পৌর কর / সিটি কর্পোরেশন কর"
              value={entry.municipalTaxes}
              onChange={(v) => updateEntry(index, { municipalTaxes: v })}
            />
            <NumberField
              id={`mortgage-${index}`}
              label="বন্ধকী ঋণের সুদ"
              value={entry.mortgageInterest}
              onChange={(v) => updateEntry(index, { mortgageInterest: v })}
            />
            <NumberField
              id={`insurance-${index}`}
              label="বীমা প্রিমিয়াম"
              value={entry.insurancePremium}
              onChange={(v) => updateEntry(index, { insurancePremium: v })}
            />
            <NumberField
              id={`tds-${index}`}
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
        + সম্পত্তি যোগ করুন
      </button>
    </StepShell>
  );
}
