import { useMemo } from "react";
import type { TaxCalculationInput } from "../../../types/tax";
import { calculateTax } from "../../engine";
import { formatBDT } from "../../../utils/formatCurrency";
import { STEP_LABEL_BN, THRESHOLD_CATEGORY_LABEL_BN } from "../../../utils/bnLabels";

interface ResultStepProps {
  stepIndex: number;
  totalSteps: number;
  input: TaxCalculationInput;
  onBack: () => void;
  onStartOver: () => void;
}

export default function ResultStep({
  stepIndex,
  totalSteps,
  input,
  onBack,
  onStartOver,
}: ResultStepProps) {
  const outcome = useMemo(() => {
    try {
      return { result: calculateTax(input), error: null as string | null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : String(err) };
    }
  }, [input]);

  if (outcome.error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h2 className="font-display text-2xl text-ink">এখনই হিসাব করা গেল না</h2>
        <p className="mt-3 rounded-sm border border-brick/30 bg-brick/5 p-4 text-sm text-ink/80">
          {outcome.error}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 text-sm font-medium text-ink/60 hover:text-ink"
        >
          ← পেছনে
        </button>
      </div>
    );
  }

  const result = outcome.result!;
  const isRefund = result.refundDue > 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="font-data text-xs uppercase tracking-wider text-ink/50">
        ধাপ {stepIndex + 1} / {totalSteps} · কর নির্ধারণী বছর {result.assessmentYear}
      </p>

      <div className="mt-6 rounded-sm bg-ink p-8 text-paper">
        <p className="font-data text-xs uppercase tracking-wider text-paper/60">
          {isRefund ? "আনুমানিক ফেরতযোগ্য অর্থ" : "আনুমানিক প্রদেয় কর"}
        </p>
        <p className="mt-2 font-display text-4xl">
          {formatBDT(isRefund ? result.refundDue : result.taxPayable)}
        </p>
      </div>

      {result.advisoryNotes.length > 0 && (
        <div className="mt-4 space-y-2">
          {result.advisoryNotes.map((note, i) => (
            <p
              key={i}
              className="rounded-sm border border-gold/30 bg-gold/5 p-3 text-xs text-ink/70"
            >
              {note}
            </p>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-sm border border-sage/30">
        <h3 className="border-b border-sage/30 px-5 py-3 font-display text-base text-ink">
          হিসাবটি যেভাবে করা হয়েছে
        </h3>
        <dl>
          {result.steps.map((step, i) => {
            const label = STEP_LABEL_BN[step.label] ?? step.label;
            const note =
              step.label === "Tax-free threshold applied"
                ? `শ্রেণি: ${THRESHOLD_CATEGORY_LABEL_BN[result.thresholdCategoryApplied] ?? result.thresholdCategoryApplied}`
                : step.note;
            return (
              <div
                key={i}
                className={`flex items-baseline justify-between gap-4 px-5 py-3 text-sm ${
                  i % 2 === 0 ? "bg-paper" : "bg-paper-dim/40"
                }`}
              >
                <div>
                  <dt className="text-ink/80">{label}</dt>
                  {note && <dd className="mt-0.5 text-xs text-ink/50">{note}</dd>}
                </div>
                <dd className="whitespace-nowrap font-data text-ink">{formatBDT(step.amount)}</dd>
              </div>
            );
          })}
        </dl>
      </div>

      <p className="mt-6 text-xs text-ink/50">
        এই ক্যালকুলেটর আপনার দেওয়া তথ্য এবং {result.assessmentYear} কর নির্ধারণী
        বছরের জন্য নির্ধারিত কর-নিয়ম অনুযায়ী একটি আনুমানিক হিসাব দেয়। রিটার্ন
        দাখিল বা compliance সংক্রান্ত সিদ্ধান্তের আগে ফলাফলটি প্রযোজ্য বাংলাদেশ
        আয়কর আইন এবং NBR-এর সরকারি নির্দেশনার সাথে যাচাই করে নিন।
      </p>

      <div className="mt-8 flex items-center justify-between border-t border-sage/20 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-ink/60 hover:text-ink"
        >
          ← পেছনে
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-sm bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:opacity-90"
        >
          নতুন করে শুরু করুন
        </button>
      </div>
    </div>
  );
}
