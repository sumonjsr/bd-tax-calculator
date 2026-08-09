import { describe, expect, it } from "vitest";
import { calculateTax } from "../calculator/engine";
import {
  availableAssessmentYears,
  isAssessmentYearConfigured,
} from "../calculator/rules";
import type { TaxCalculationInput } from "../types/tax";

describe("tax rule registry", () => {
  it("lists the scaffolded assessment years", () => {
    expect(availableAssessmentYears()).toEqual(["2025-2026", "2026-2027"]);
  });

  it("reports no assessment year as configured yet", () => {
    for (const year of availableAssessmentYears()) {
      expect(isAssessmentYearConfigured(year)).toBe(false);
    }
  });
});

describe("calculateTax (Phase 1 scaffold)", () => {
  const baseInput: TaxCalculationInput = {
    profile: {
      assessmentYear: "2025-2026",
      age: 30,
      hasTin: true,
      hasForeignIncome: false,
    },
  };

  it("refuses to calculate for a scaffolded-but-unconfigured assessment year rather than guessing", () => {
    // 2025-2026 exists in the registry but its rule file is still `null`.
    expect(() => calculateTax(baseInput)).toThrow(/no tax rule configuration/i);
  });

  it("refuses to calculate for an assessment year with no rule file at all", () => {
    const input: TaxCalculationInput = {
      ...baseInput,
      profile: { ...baseInput.profile, assessmentYear: "2099-2100" },
    };
    expect(() => calculateTax(input)).toThrow(/no tax rule configuration/i);
  });
});
