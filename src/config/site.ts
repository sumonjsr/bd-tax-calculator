/**
 * Site-wide constants. Brand name is a placeholder (Section 35 of the
 * brief) — kept in one place so it's a one-line change later, not a
 * find-and-replace across the codebase.
 */
export const siteConfig = {
  name: "Bangladesh Tax Calculator",
  description:
    "Estimate your Bangladesh individual income tax across salary, property, business, capital gains and more.",
  defaultAssessmentYear: "2025-2026",
} as const;
