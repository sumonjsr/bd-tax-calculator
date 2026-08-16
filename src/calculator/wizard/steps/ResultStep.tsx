import { useMemo } from "react";
import type { TaxCalculationInput } from "../../../types/tax";
import { calculateTax } from "../../engine";
import { formatBDT } from "../../../utils/formatCurrency";

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
        <h2 className="font-display text-2xl text-ink">Couldn't calculate this yet</h2>
        <p className="mt-3 rounded-sm border border-brick/30 bg-brick/5 p-4 text-sm text-ink/80">
          {outcome.error}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 text-sm font-medium text-ink/60 hover:text-ink"
        >
          ← Back
        </button>
      </div>
    );
  }

  const result = outcome.result!;
  const isRefund = result.refundDue > 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="font-data text-xs uppercase tracking-wider text-ink/50">
        Step {stepIndex + 1} of {totalSteps} · Assessment Year {result.assessmentYear}
      </p>

      <div className="mt-6 rounded-sm bg-ink p-8 text-paper">
        <p className="font-data text-xs uppercase tracking-wider text-paper/60">
          {isRefund ? "Estimated refund due" : "Estimated tax payable"}
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
          How this was calculated
        </h3>
        <dl>
          {result.steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-baseline justify-between gap-4 px-5 py-3 text-sm ${
                i % 2 === 0 ? "bg-paper" : "bg-paper-dim/40"
              }`}
            >
              <div>
                <dt className="text-ink/80">{step.label}</dt>
                {step.note && <dd className="mt-0.5 text-xs text-ink/50">{step.note}</dd>}
              </div>
              <dd className="whitespace-nowrap font-data text-ink">{formatBDT(step.amount)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-6 text-xs text-ink/50">
        This calculator provides an estimated tax calculation based on the information
        you entered and the tax rules configured for AY {result.assessmentYear}. For
        filing or compliance decisions, verify the result against applicable Bangladesh
        tax law and official NBR guidance.
      </p>

      <div className="mt-8 flex items-center justify-between border-t border-sage/20 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-ink/60 hover:text-ink"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-sm bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:opacity-90"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
