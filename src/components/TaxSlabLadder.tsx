/**
 * Decorative signature element for the homepage hero.
 *
 * Renders as ascending steps to echo how Bangladesh's progressive
 * income tax slabs actually work — each step taxed at its own rate
 * rather than one flat number. Purely illustrative: no real rates or
 * thresholds are encoded here.
 */
export default function TaxSlabLadder() {
  const steps = [
    { width: 120, label: "0%" },
    { width: 155, label: "5%" },
    { width: 190, label: "10%" },
    { width: 225, label: "15%" },
    { width: 260, label: "20%" },
    { width: 295, label: "25%" },
  ];

  return (
    <svg
      viewBox="0 0 340 260"
      role="img"
      aria-label="ক্রমান্বয়ে বৃদ্ধি পাওয়া, ধাপে ধাপে কর ধার্য হওয়া আয়ের ইলাস্ট্রেশন"
      className="w-full max-w-sm"
    >
      <title>প্রগতিশীল কর স্ল্যাব, সিঁড়ির আকারে দেখানো হয়েছে</title>
      {steps.map((step, i) => {
        const stepHeight = 34;
        const y = 260 - (i + 1) * stepHeight;
        return (
          <g key={step.label}>
            <rect
              x={0}
              y={y}
              width={step.width}
              height={stepHeight - 4}
              rx={3}
              fill={i === steps.length - 1 ? "var(--color-gold)" : "var(--color-sage)"}
              opacity={0.15 + i * 0.13}
            />
            <text
              x={step.width - 10}
              y={y + (stepHeight - 4) / 2 + 4}
              textAnchor="end"
              className="font-data"
              fontSize="11"
              fill="var(--color-ink)"
              opacity={0.75}
            >
              {step.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
