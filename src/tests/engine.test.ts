import { describe, expect, it } from "vitest";
import { calculateTax } from "../calculator/engine";
import { availableAssessmentYears, isAssessmentYearConfigured } from "../calculator/rules";
import type { TaxCalculationInput, TaxpayerProfile } from "../types/tax";

const baseProfile: TaxpayerProfile = {
  assessmentYear: "2026-2027",
  age: 30,
  hasTin: true,
  hasForeignIncome: false,
};

describe("tax rule registry", () => {
  it("has AY 2026-2027 configured", () => {
    expect(availableAssessmentYears()).toEqual(["2026-2027"]);
    expect(isAssessmentYearConfigured("2026-2027")).toBe(true);
  });

  it("refuses an unconfigured assessment year", () => {
    const input: TaxCalculationInput = {
      profile: { ...baseProfile, assessmentYear: "2099-2100" },
    };
    expect(() => calculateTax(input)).toThrow(/no tax rule configuration/i);
  });
});

describe("unsupported income categories", () => {
  it("refuses to calculate when business income is present", () => {
    const input: TaxCalculationInput = {
      profile: baseProfile,
      business: [
        {
          grossReceipts: 1_000_000,
          costOfGoodsSold: 0,
          operatingExpenses: 0,
          salaryAndWages: 0,
          rent: 0,
          utilities: 0,
          depreciation: 0,
          interest: 0,
          otherAllowableExpenses: 0,
          disallowedExpenses: 0,
          tdsDeducted: 0,
          advanceTaxPaid: 0,
        },
      ],
    };
    expect(() => calculateTax(input)).toThrow(/business.*profession/i);
  });
});

describe("zero income", () => {
  it("produces zero tax for a taxpayer with no income entered", () => {
    const result = calculateTax({ profile: baseProfile });
    expect(result.totalTaxableIncome).toBe(0);
    expect(result.taxBeforeRebate).toBe(0);
    expect(result.finalTaxLiability).toBe(0);
  });
});

describe("salary income below threshold", () => {
  it("owes no tax when taxable salary stays under the general threshold", () => {
    const result = calculateTax({
      profile: baseProfile,
      salaryIncome: {
        basicSalary: 400_000,
        houseRentAllowance: 0,
        medicalAllowance: 0,
        conveyanceAllowance: 0,
        festivalBonus: 0,
        performanceBonus: 0,
        otherAllowances: 0,
        employerBenefits: 0,
        providentFundIncome: 0,
        gratuity: 0,
        pension: 0,
        otherEmploymentBenefits: 0,
        tdsDeducted: 0,
      },
    });
    expect(result.totalTaxableIncome).toBeCloseTo(266_666.67, 1);
    expect(result.taxBeforeRebate).toBe(0);
    expect(result.thresholdCategoryApplied).toBe("general");
  });
});

describe("salary income across multiple slabs", () => {
  it("computes tax progressively through several bands", () => {
    const result = calculateTax({
      profile: baseProfile,
      salaryIncome: {
        basicSalary: 3_000_000,
        houseRentAllowance: 0,
        medicalAllowance: 0,
        conveyanceAllowance: 0,
        festivalBonus: 0,
        performanceBonus: 0,
        otherAllowances: 0,
        employerBenefits: 0,
        providentFundIncome: 0,
        gratuity: 0,
        pension: 0,
        otherEmploymentBenefits: 0,
        tdsDeducted: 200_000,
      },
    });
    expect(result.totalTaxableIncome).toBe(2_500_000);
    expect(result.taxBeforeRebate).toBe(415_000);
    expect(result.totalCreditsApplied).toBe(200_000);
    expect(result.taxPayable).toBe(215_000);
  });
});

describe("female / senior threshold", () => {
  it("applies the higher female-or-senior threshold", () => {
    const result = calculateTax({
      profile: { ...baseProfile, gender: "female" },
      salaryIncome: {
        basicSalary: 450_000,
        houseRentAllowance: 0,
        medicalAllowance: 0,
        conveyanceAllowance: 0,
        festivalBonus: 0,
        performanceBonus: 0,
        otherAllowances: 0,
        employerBenefits: 0,
        providentFundIncome: 0,
        gratuity: 0,
        pension: 0,
        otherEmploymentBenefits: 0,
        tdsDeducted: 0,
      },
    });
    expect(result.thresholdCategoryApplied).toBe("female-or-senior");
    expect(result.taxFreeThresholdApplied).toBe(450_000);
  });

  it("picks the highest of multiple qualifying thresholds", () => {
    const result = calculateTax({
      profile: { ...baseProfile, gender: "female", isDisabled: true },
    });
    expect(result.thresholdCategoryApplied).toBe("disabled");
    expect(result.taxFreeThresholdApplied).toBe(525_000);
  });
});

describe("investment rebate", () => {
  it("caps DPS eligibility at the per-item cap before applying the formula", () => {
    const result = calculateTax({
      profile: baseProfile,
      salaryIncome: {
        basicSalary: 3_000_000,
        houseRentAllowance: 0,
        medicalAllowance: 0,
        conveyanceAllowance: 0,
        festivalBonus: 0,
        performanceBonus: 0,
        otherAllowances: 0,
        employerBenefits: 0,
        providentFundIncome: 0,
        gratuity: 0,
        pension: 0,
        otherEmploymentBenefits: 0,
        tdsDeducted: 0,
      },
      investmentRebateItems: [{ category: "dps", amount: 200_000 }],
    });
    expect(result.investmentRebate).toBe(12_000);
    expect(result.taxAfterRebate).toBe(403_000);
  });
});

describe("minimum tax", () => {
  it("applies the standard minimum tax when computed tax is below it but income exceeds the threshold", () => {
    const result = calculateTax({
      profile: baseProfile,
      salaryIncome: {
        basicSalary: 405_000,
        houseRentAllowance: 0,
        medicalAllowance: 0,
        conveyanceAllowance: 0,
        festivalBonus: 0,
        performanceBonus: 0,
        otherAllowances: 0,
        employerBenefits: 0,
        providentFundIncome: 0,
        gratuity: 0,
        pension: 0,
        otherEmploymentBenefits: 0,
        tdsDeducted: 0,
      },
    });
    expect(result.totalTaxableIncome).toBeLessThan(400_000);
    expect(result.minimumTax).toBe(0);
  });
});

describe("non-resident taxpayer", () => {
  it("applies a flat rate regardless of thresholds", () => {
    const result = calculateTax({
      profile: { ...baseProfile, residentialStatus: "non-resident" },
      salaryIncome: {
        basicSalary: 900_000,
        houseRentAllowance: 0,
        medicalAllowance: 0,
        conveyanceAllowance: 0,
        festivalBonus: 0,
        performanceBonus: 0,
        otherAllowances: 0,
        employerBenefits: 0,
        providentFundIncome: 0,
        gratuity: 0,
        pension: 0,
        otherEmploymentBenefits: 0,
        tdsDeducted: 0,
      },
    });
    expect(result.totalTaxableIncome).toBe(600_000);
    expect(result.taxBeforeRebate).toBeCloseTo(180_000, 5);
  });
});

describe("wealth surcharge", () => {
  const salary = {
    basicSalary: 3_000_000,
    houseRentAllowance: 0,
    medicalAllowance: 0,
    conveyanceAllowance: 0,
    festivalBonus: 0,
    performanceBonus: 0,
    otherAllowances: 0,
    employerBenefits: 0,
    providentFundIncome: 0,
    gratuity: 0,
    pension: 0,
    otherEmploymentBenefits: 0,
    tdsDeducted: 0,
  };

  it("applies no surcharge at or below 4 crore net wealth, even with multiple vehicles", () => {
    const result = calculateTax({
      profile: { ...baseProfile, netWealth: 40_000_000, motorVehicleCount: 3 },
      salaryIncome: salary,
    });
    expect(result.surcharge).toBe(0);
  });

  it("applies 10% surcharge on tax-after-rebate in the 4-10 crore band", () => {
    const result = calculateTax({
      profile: { ...baseProfile, netWealth: 60_000_000 },
      salaryIncome: salary,
      investmentRebateItems: [{ category: "dps", amount: 120_000 }],
    });
    // taxBeforeRebate 415,000; rebate = min(75000, 12000, 750000) = 12,000
    // taxAfterRebate = 403,000; surcharge = 10% * 403,000 = 40,300
    expect(result.taxAfterRebate).toBe(403_000);
    expect(result.surcharge).toBeCloseTo(40_300, 5);
  });

  it("applies 35% surcharge above 50 crore net wealth", () => {
    const result = calculateTax({
      profile: { ...baseProfile, netWealth: 600_000_000 },
      salaryIncome: salary,
    });
    expect(result.surcharge).toBeCloseTo(415_000 * 0.35, 5);
  });

  it("flags Environmental Surcharge as an advisory note without calculating it", () => {
    const result = calculateTax({
      profile: { ...baseProfile, netWealth: 10_000_000, motorVehicleCount: 2 },
      salaryIncome: salary,
    });
    expect(result.surcharge).toBe(0); // wealth surcharge unaffected
    expect(result.advisoryNotes.some((n) => /environmental surcharge/i.test(n))).toBe(
      true,
    );
  });
});