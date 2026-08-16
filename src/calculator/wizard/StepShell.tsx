import type { ReactNode } from "react";

interface StepShellProps {
  stepIndex: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export default function StepShell({
  stepIndex,
  totalSteps,
  title,
  description,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
}: StepShellProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= stepIndex ? "bg-gold" : "bg-sage/20"}`}
            />
          ))}
        </div>
        <p className="mt-3 font-data text-xs uppercase tracking-wider text-ink/50">
          Step {stepIndex + 1} of {totalSteps}
        </p>
      </div>

      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {description && <p className="mt-2 text-ink/60">{description}</p>}

      <div className="mt-8 space-y-6">{children}</div>

      <div className="mt-10 flex items-center justify-between border-t border-sage/20 pt-6">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-ink/60 hover:text-ink"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="rounded-sm bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
