import type { TaxRuleConfig } from "../types";

/**
 * Assessment Year 2026-2027 (Income Year 2025-2026) tax rules.
 *
 * Source: Bangladesh Income Tax Guidelines (Income Year 2025-2026 |
 * Assessment Year 2026-2027), based on the Finance Act 2026 and the
 * Income Tax Act 2023 (Act No. XII of 2023), as supplied by the site
 * owner.
 *
 * SURCHARGE RULES — CONFIRMED (per owner clarification citing Section
 * 166 and the Finance Act 2026 First Schedule):
 *   1. The ">1 motor vehicle OR >8,000 sq ft residential property"
 *      condition is a floor/minimum-rate clause that only applies
 *      *within* the 4-10 crore net-wealth band, where the rate is
 *      already a uniform 10% either way — it is NOT an independent
 *      trigger below the 4-crore threshold. Below 4 crore, surcharge
 *      is always 0% regardless of vehicle/property count.
 *   2. Surcharge is computed on Net Tax Payable — i.e. tax AFTER the
 *      investment rebate is applied. See calculateSurcharge.ts.
 *
 * OUT OF SCOPE — NOT IMPLEMENTED: "Environmental Surcharge" is a
 * separate, per-motor-vehicle tax (paid at vehicle registration or via
 * the return) that applies even when net wealth is under 4 crore if
 * the taxpayer owns multiple vehicles. It is legally distinct from
 * Wealth Surcharge and must never be added into the wealth-surcharge
 * figure. No rate/amount has been supplied for it yet, so it is not
 * calculated anywhere in this engine — only flagged as an advisory
 * note when relevant (see calculateTaxPayable.ts).
 */
const rules2026_2027: TaxRuleConfig = {
  assessmentYear: "2026-2027",
  incomeYear: "2025-2026",
  source:
    "Income Tax Act, 2023 (Act No. XII of 2023) read with Finance Act, 2026 — " +
    "Schedule 1 (slabs/rates); Sixth Schedule Part 1 & 3 (salary exemption, " +
    "investment rebate); Sections 163 & 166 (surcharge, minimum tax).",
  lastUpdated: "2026-08-09",

  taxFreeThresholds: {
    general: 400_000,
    "female-or-senior": 450_000,
    "third-gender": 525_000,
    disabled: 525_000,
    "freedom-fighter": 550_000,
  },
  disabledChildAllowance: 50_000,

  incomeTaxSlabBands: [
    { widthAboveThreshold: 300_000, rate: 0.1 },
    { widthAboveThreshold: 400_000, rate: 0.15 },
    { widthAboveThreshold: 500_000, rate: 0.2 },
    { widthAboveThreshold: 2_000_000, rate: 0.25 },
    { widthAboveThreshold: null, rate: 0.3 },
  ],
  nonResidentFlatRate: 0.3,

  salaryExemption: {
    fraction: 1 / 3,
    cap: 500_000,
  },

  houseProperty: {
    statutoryRepairAllowance: {
      residential: 0.25,
      commercial: 0.3,
    },
  },

  investmentRebate: {
    eligibleCategories: [
      {
        category: "life-insurance",
        label: "Life insurance premium",
        perItemCap: null,
        capAsPercentOf: { field: "sumAssured", percent: 0.1 },
      },
      {
        category: "dps",
        label: "Deposit Pension Scheme (DPS)",
        perItemCap: 120_000,
      },
      {
        category: "government-securities-sanchayapatra",
        label: "Government securities and Sanchayapatra",
        perItemCap: null,
      },
      {
        category: "listed-securities",
        label: "Listed stocks, mutual funds, or debentures",
        perItemCap: null,
      },
      {
        category: "gpf-rpf",
        label: "GPF / Recognized Provident Fund",
        perItemCap: null,
      },
      {
        category: "universal-pension-scheme",
        label: "Universal Pension Scheme",
        perItemCap: null,
      },
    ],
    formula: {
      maxPercentOfTaxableIncome: 0.03,
      percentOfEligibleInvestment: 0.1,
      absoluteCap: 750_000,
    },
  },

  surcharge: {
    bands: [
      { minNetWealth: 0, maxNetWealth: 40_000_000, rate: 0 },
      {
        minNetWealth: 40_000_000,
        maxNetWealth: 100_000_000,
        rate: 0.1,
        note:
          "Confirmed: >1 motor vehicle or >8,000 sq ft residential property " +
          "acts as a floor within this band, but the band rate is already " +
          "a uniform 10% either way — no separate handling needed.",
      },
      { minNetWealth: 100_000_000, maxNetWealth: 200_000_000, rate: 0.2 },
      { minNetWealth: 200_000_000, maxNetWealth: 500_000_000, rate: 0.3 },
      { minNetWealth: 500_000_000, maxNetWealth: null, rate: 0.35 },
    ],
  },

  minimumTax: {
    standard: 5_000,
    firstTimeFiler: 1_000,
  },

  business: {
    // Owner-confirmed (superseding an earlier 0.6% draft): 1% of gross
    // turnover for Sole Proprietorship business income. Applies
    // (compared against the standard/first-time-filer minimum tax,
    // whichever is higher) whenever combined income falls into
    // minimum-tax territory — including when the business itself is
    // at a loss. See calculateMinimumTax.ts.
    minimumTaxRateOnTurnover: 0.01,
  },

  agriculture: {
    // Owner-supplied (Sections 38-44, Finance Act 2026, Sixth Schedule
    // Part 1). Confirmed: all 5 deduction types in Sec 40(1)(b-g)
    // apply (land revenue, loan interest, insurance, depreciation,
    // irrigation maintenance) — not just the two in the original
    // pseudo-code. Confirmed: Dairy/Mushroom/Nursery gets the same
    // exemption treatment as Fisheries/Poultry, at a lower threshold.
    noBooksProductionCostRate: 0.6,
    soleAgricultureAdditionalExemption: 200_000,
    fisheriesPoultryExemptionThreshold: 2_000_000,
    dairyMushroomNurseryExemptionThreshold: 1_000_000,
  },

  advanceTax: {
    liabilityThreshold: 600_000,
    installments: 4,
  },
};

export default rules2026_2027;
