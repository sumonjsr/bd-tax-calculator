import {
  IMPLEMENTED_CATEGORIES,
  INCOME_CATEGORY_LABELS,
  type IncomeCategoryKey,
} from "../types";
import StepShell from "../StepShell";

interface IncomeSelectionStepProps {
  stepIndex: number;
  totalSteps: number;
  selected: IncomeCategoryKey[];
  onChange: (selected: IncomeCategoryKey[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function IncomeSelectionStep({
  stepIndex,
  totalSteps,
  selected,
  onChange,
  onBack,
  onNext,
}: IncomeSelectionStepProps) {
  const toggle = (key: IncomeCategoryKey) => {
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
  };

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="Which income do you have?"
      description="Select everything that applies. You'll only fill in forms for what you pick."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={selected.length === 0}
    >
      <div className="space-y-2">
        {(Object.keys(INCOME_CATEGORY_LABELS) as IncomeCategoryKey[]).map((key) => {
          const isChecked = selected.includes(key);
          const isImplemented = IMPLEMENTED_CATEGORIES.includes(key);
          return (
            <label
              key={key}
              className={`flex items-center justify-between gap-3 rounded-sm border px-4 py-3.5 transition-colors ${
                isChecked ? "border-gold bg-gold/10" : "border-sage/30 bg-paper"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(key)}
                  className="h-4 w-4 accent-gold"
                />
                <span className="text-sm text-ink">{INCOME_CATEGORY_LABELS[key]}</span>
              </span>
              {!isImplemented && (
                <span className="rounded-full bg-sage/20 px-2 py-0.5 text-xs text-ink/60">
                  Coming soon
                </span>
              )}
            </label>
          );
        })}
      </div>
    </StepShell>
  );
}
