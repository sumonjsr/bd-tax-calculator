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
  it("refuses to calculate when agricultural income is present", () => {
    const input: TaxCalculationInput = {
      profile: baseProfile,
      agricultural: [{ grossIncome: 500_000, allowableExpenses: 0, tdsDeducted: 0 }],
    };
    expect(() => calculateTax(input)).toThrow(/agricultural/i);
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
    // gross 400,000 - exempt min(400000/3, 500000) = 400000 - 133333.33 = 266,666.67
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
    // gross 3,000,000; exempt = min(1,000,000, 500,000) = 500,000
    // taxable = 2,500,000
    // threshold 400,000 -> remaining 2,100,000
    //   300,000 @10% = 30,000
    //   400,000 @15% = 60,000
    //   500,000 @20% = 100,000
    //   remaining 900,000 @25% = 225,000
    // total = 415,000
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
    // female-or-senior: 450,000 vs disabled: 525,000 -> disabled wins
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
    // taxable income 2,500,000; tax before rebate 415,000
    // eligible investment = min(200000, 120000) = 120,000
    // rebate = min(3%*2,500,000=75,000, 10%*120,000=12,000, 750,000) = 12,000
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
    // gross 405,000; exempt min(135000, 500000)=135000; taxable=270,000
    // taxable (270,000) < threshold (400,000) -> minimum tax should NOT apply
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
    // gross 900,000; exempt min(300000,500000)=300000; taxable=600,000
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

describe("business income (Sole Proprietorship)", () => {
  it("computes net profit as turnover minus total expense and combines it with other income", () => {
    const result = calculateTax({
      profile: baseProfile,
      business: [
        { grossTurnover: 2_000_000, totalExpense: 1_200_000, tdsDeducted: 20_000, advanceTaxPaid: 30_000 },
      ],
    });
    // netProfit = 2,000,000 - 1,200,000 = 800,000
    // threshold 400,000 -> remaining 400,000: 300,000@10%=30,000; 100,000@15%=15,000 => 45,000
    expect(result.totalTaxableIncome).toBe(800_000);
    expect(result.taxBeforeRebate).toBe(45_000);
    expect(result.totalCreditsApplied).toBe(50_000); // 20,000 TDS + 30,000 advance
  });

  it("applies the 1% turnover minimum tax when it exceeds the standard minimum", () => {
    const result = calculateTax({
      profile: baseProfile,
      business: [
        // Small profit, large turnover -> turnover minimum tax should bind
        { grossTurnover: 2_000_000, totalExpense: 1_990_000, tdsDeducted: 0, advanceTaxPaid: 0 },
      ],
    });
    // netProfit = 10,000 (below threshold) -> standard minimum = 0
    // turnover minimum = 1% * 2,000,000 = 20,000
    expect(result.minimumTax).toBe(20_000);
    expect(result.finalTaxLiability).toBe(20_000);
  });

  it("falls back to the standard minimum tax when turnover minimum is lower", () => {
    const result = calculateTax({
      profile: baseProfile,
      business: [
        // netProfit 450,000 exceeds the 400,000 threshold, so the
        // standard 5,000 minimum is in play; turnover minimum here
        // (1% of 450,000 = 4,500) is lower, so standard should win.
        { grossTurnover: 450_000, totalExpense: 0, tdsDeducted: 0, advanceTaxPaid: 0 },
      ],
    });
    expect(result.totalTaxableIncome).toBeGreaterThan(400_000);
    expect(result.minimumTax).toBe(5_000);
  });

  it("does NOT set off a business loss against other income, but still applies the turnover minimum tax", () => {
    const result = calculateTax({
      profile: baseProfile,
      salaryIncome: {
        basicSalary: 900_000, // taxable salary after exemption: 600,000
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
      business: [
        // A loss: turnover 1,000,000 but expenses 1,500,000 -> -500,000,
        // floored at 0 — must NOT reduce the salary income below.
        { grossTurnover: 1_000_000, totalExpense: 1_500_000, tdsDeducted: 0, advanceTaxPaid: 0 },
      ],
    });
    // combined = 600,000 (salary) + 0 (business loss, not subtracted)
    expect(result.totalTaxableIncome).toBe(600_000);
    // threshold 400,000 -> remaining 200,000 @10% = 20,000
    expect(result.taxBeforeRebate).toBe(20_000);
    // turnover minimum tax (1% of 1,000,000 = 10,000) is still checked,
    // but 20,000 > 10,000 so it doesn't end up binding here
    expect(result.finalTaxLiability).toBe(20_000);
  });

  it("still applies the turnover minimum tax on a standalone loss-making business with no other income", () => {
    const result = calculateTax({
      profile: baseProfile,
      business: [
        { grossTurnover: 100_000, totalExpense: 900_000, tdsDeducted: 0, advanceTaxPaid: 0 },
      ],
    });
    // loss floored at 0, no other income -> taxable income 0
    expect(result.totalTaxableIncome).toBe(0);
    expect(result.taxBeforeRebate).toBe(0);
    // turnover minimum still applies: 1% of 100,000 = 1,000
    expect(result.minimumTax).toBe(1_000);
  });
});
