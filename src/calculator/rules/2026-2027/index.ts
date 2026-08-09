import type { TaxRuleConfig } from "../types";

/**
 * Assessment Year 2026-2027 (Income Year 2025-2026) tax rules.
 *
 * Source: Bangladesh Income Tax Guidelines (Income Year 2025-2026 |
 * Assessment Year 2026-2027), based on the Finance Act 2026 and the
 * Income Tax Act 2023 (Act No. XII of 2023), as supplied by the site
 * owner.
 *
 * KNOWN OPEN QUESTIONS (do not resolve these silently — confirm with
 * the owner before relying on surcharge figures produced from this
 * config):
 *   1. Whether the ">1 motor vehicle OR >8,000 sq ft residential
 *      property" note on the 4-10 crore surcharge band is just
 *      explanatory context, or an independent trigger that can apply
 *      even below the 4-crore net-wealth threshold.
 *   2. Whether surcharge is computed on tax BEFORE or AFTER the
 *      investment rebate is applied. This config currently computes
 *      it on tax AFTER rebate — see calculateSurcharge.ts — pending
 *      confirmation.
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
          "Guideline also references a trigger of >1 motor vehicle OR " +
          ">8,000 sq ft residential property in this band — not yet " +
          "confirmed with the owner; not applied independently by the engine.",
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

  advanceTax: {
    liabilityThreshold: 600_000,
    installments: 4,
  },
};

export default rules2026_2027;