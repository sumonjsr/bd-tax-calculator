import type {
  InvestmentRebateCategory,
  InvestmentRebateItem,
} from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import SelectField from "../../../components/forms/SelectField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";

interface InvestmentRebateStepProps {
  stepIndex: number;
  totalSteps: number;
  items: InvestmentRebateItem[];
  onChange: (items: InvestmentRebateItem[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const CATEGORY_OPTIONS: Array<{ value: InvestmentRebateCategory; label: string }> = [
  { value: "life-insurance", label: "জীবন বীমার প্রিমিয়াম" },
  { value: "dps", label: "ডিপোজিট পেনশন স্কিম (DPS)" },
  { value: "government-securities-sanchayapatra", label: "সরকারি সিকিউরিটিজ / সঞ্চয়পত্র" },
  { value: "listed-securities", label: "তালিকাভুক্ত শেয়ার, মিউচুয়াল ফান্ড বা ডিবেঞ্চার" },
  { value: "gpf-rpf", label: "GPF / স্বীকৃত ভবিষ্য তহবিল" },
  { value: "universal-pension-scheme", label: "সর্বজনীন পেনশন স্কিম" },
];

export default function InvestmentRebateStep({
  stepIndex,
  totalSteps,
  items,
  onChange,
  onBack,
  onNext,
}: InvestmentRebateStepProps) {
  const addItem = () => {
    onChange([...items, { category: "dps", amount: 0 }]);
  };

  const updateItem = (index: number, patch: Partial<InvestmentRebateItem>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="বিনিয়োগ কর রেয়াত"
      description="যেসব বিনিয়োগ রেয়াতের জন্য যোগ্য সেগুলো তালিকাভুক্ত করুন। কোনো বিনিয়োগ না থাকলে এই ধাপ বাদ দিতে পারেন — এটা ঐচ্ছিক।"
      onBack={onBack}
      onNext={onNext}
    >
      {items.length === 0 && (
        <p className="rounded-sm border border-dashed border-sage/40 px-4 py-6 text-center text-sm text-ink/50">
          এখনো কোনো বিনিয়োগ যোগ করা হয়নি।
        </p>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <FormSection key={index} title={`বিনিয়োগ ${index + 1}`}>
            <SelectField
              id={`rebate-category-${index}`}
              label="খাত"
              value={item.category}
              onChange={(v) => updateItem(index, { category: v })}
              options={CATEGORY_OPTIONS}
            />
            <NumberField
              id={`rebate-amount-${index}`}
              label="এই বছর বিনিয়োগকৃত অঙ্ক"
              value={item.amount}
              onChange={(v) => updateItem(index, { amount: v })}
            />
            {item.category === "life-insurance" && (
              <NumberField
                id={`rebate-sum-assured-${index}`}
                label="পলিসির সাম অ্যাসিওরড (Sum Assured)"
                value={item.sumAssured ?? 0}
                onChange={(v) => updateItem(index, { sumAssured: v })}
                hint="যোগ্য প্রিমিয়াম সাম অ্যাসিওরডের ১০%-এ সীমাবদ্ধ।"
              />
            )}
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-sm text-brick hover:underline"
            >
              মুছে ফেলুন
            </button>
          </FormSection>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="w-full rounded-sm border border-dashed border-sage/40 py-3 text-sm font-medium text-ink/70 hover:border-gold hover:text-ink"
      >
        + বিনিয়োগ যোগ করুন
      </button>
    </StepShell>
  );
}
