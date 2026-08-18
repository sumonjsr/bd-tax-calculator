import type { CapitalGainAssetType, CapitalGainTransaction } from "../../../types/tax";
import NumberField from "../../../components/forms/NumberField";
import SelectField from "../../../components/forms/SelectField";
import ToggleField from "../../../components/forms/ToggleField";
import FormSection from "../../../components/forms/FormSection";
import StepShell from "../StepShell";
import { emptyCapitalGainEntry } from "../types";

interface CapitalGainsStepProps {
  stepIndex: number;
  totalSteps: number;
  entries: CapitalGainTransaction[];
  onChange: (entries: CapitalGainTransaction[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const ASSET_TYPE_OPTIONS: Array<{ value: CapitalGainAssetType; label: string }> = [
  { value: "real-estate", label: "জমি / স্থাবর সম্পত্তি" },
  { value: "listed-shares", label: "তালিকাভুক্ত শেয়ার" },
  { value: "unlisted-shares", label: "অতালিকাভুক্ত শেয়ার" },
  { value: "govt-bond", label: "সরকারি বন্ড (সম্পূর্ণ করমুক্ত)" },
];

export default function CapitalGainsStep({
  stepIndex,
  totalSteps,
  entries,
  onChange,
  onBack,
  onNext,
}: CapitalGainsStepProps) {
  const addEntry = () => onChange([...entries, { ...emptyCapitalGainEntry }]);
  const updateEntry = (index: number, patch: Partial<CapitalGainTransaction>) =>
    onChange(entries.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  const removeEntry = (index: number) => onChange(entries.filter((_, i) => i !== index));

  return (
    <StepShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="মূলধনী মুনাফা (Capital Gains)"
      description="প্রতিটি বিক্রয়ের জন্য আলাদা এন্ট্রি যোগ করুন।"
      onBack={onBack}
      onNext={onNext}
    >
      {entries.length === 0 && (
        <p className="rounded-sm border border-dashed border-sage/40 px-4 py-6 text-center text-sm text-ink/50">
          এখনো কোনো বিক্রয় যোগ করা হয়নি।
        </p>
      )}

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <FormSection key={index} title={`বিক্রয় ${index + 1}`}>
            <SelectField
              id={`asset-type-${index}`}
              label="সম্পদের ধরন"
              value={entry.assetType}
              onChange={(v) => updateEntry(index, { assetType: v })}
              options={ASSET_TYPE_OPTIONS}
            />
            <NumberField
              id={`sale-consideration-${index}`}
              label="বিক্রয় মূল্য"
              value={entry.saleConsideration}
              onChange={(v) => updateEntry(index, { saleConsideration: v })}
            />
            {entry.assetType === "real-estate" && (
              <NumberField
                id={`mouza-value-${index}`}
                label="মৌজা মূল্য (Deed value)"
                value={entry.mouzaValue ?? 0}
                onChange={(v) => updateEntry(index, { mouzaValue: v })}
                hint="বিক্রয় মূল্য ও মৌজা মূল্যের মধ্যে যেটা বেশি সেটা হিসাবে নেওয়া হবে।"
              />
            )}
            <NumberField
              id={`cost-acquisition-${index}`}
              label="ক্রয় মূল্য"
              value={entry.costOfAcquisition}
              onChange={(v) => updateEntry(index, { costOfAcquisition: v })}
            />
            <NumberField
              id={`cost-improvement-${index}`}
              label="উন্নয়ন খরচ"
              value={entry.costOfImprovement}
              onChange={(v) => updateEntry(index, { costOfImprovement: v })}
            />
            <NumberField
              id={`transfer-expenses-${index}`}
              label="হস্তান্তর খরচ"
              value={entry.transferExpenses}
              onChange={(v) => updateEntry(index, { transferExpenses: v })}
            />
            <NumberField
              id={`holding-period-${index}`}
              label="মালিকানার মেয়াদ (মাসে)"
              prefix=""
              value={entry.holdingPeriodMonths}
              onChange={(v) => updateEntry(index, { holdingPeriodMonths: v })}
              hint="৬০ মাসের বেশি হলে দীর্ঘমেয়াদী (Long-term) ধরা হয়।"
            />
            {entry.assetType === "listed-shares" && (
              <ToggleField
                id={`sponsor-director-${index}`}
                label="আমি এই কোম্পানির স্পনসর/পরিচালক"
                checked={entry.isSponsorDirector ?? false}
                onChange={(v) => updateEntry(index, { isSponsorDirector: v })}
              />
            )}
            <NumberField
              id={`cg-tds-${index}`}
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
        + বিক্রয় যোগ করুন
      </button>
    </StepShell>
  );
}
