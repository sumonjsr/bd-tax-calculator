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
  { value: "life-insurance", label: "Life insurance premium" },
  { value: "dps", label: "Deposit Pension Scheme (DPS)" },
  { value: "government-securities-sanchayapatra", label: "Government securities / Sanchayapatra" },
  { value: "listed-securities", label: "Listed stocks, mutual funds, or debentures" },
  { value: "gpf-rpf", label: "GPF / Recognized Provident Fund" },
  { value: "universal-pension-scheme", label: "Universal Pension Scheme" },
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
      title="Investment tax rebate"
      description="List investments that qualify for a rebate. Skip this if you don't have any — it's optional."
      onBack={onBack}
      onNext={onNext}
    >
      {items.length === 0 && (
        <p className="rounded-sm border border-dashed border-sage/40 px-4 py-6 text-center text-sm text-ink/50">
          No investments added yet.
        </p>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <FormSection key={index} title={`Investment ${index + 1}`}>
            <SelectField
              id={`rebate-category-${index}`}
              label="Category"
              value={item.category}
              onChange={(v) => updateItem(index, { category: v })}
              options={CATEGORY_OPTIONS}
            />
            <NumberField
              id={`rebate-amount-${index}`}
              label="Amount invested this year"
              value={item.amount}
              onChange={(v) => updateItem(index, { amount: v })}
            />
            {item.category === "life-insurance" && (
              <NumberField
                id={`rebate-sum-assured-${index}`}
                label="Policy sum assured"
                value={item.sumAssured ?? 0}
                onChange={(v) => updateItem(index, { sumAssured: v })}
                hint="Eligible premium is capped at 10% of sum assured."
              />
            )}
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-sm text-brick hover:underline"
            >
              Remove
            </button>
          </FormSection>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="w-full rounded-sm border border-dashed border-sage/40 py-3 text-sm font-medium text-ink/70 hover:border-gold hover:text-ink"
      >
        + Add an investment
      </button>
    </StepShell>
  );
}
