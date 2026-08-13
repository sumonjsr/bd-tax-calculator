import type { TaxCalculationInput, TaxCalculationResult } from "../../types/tax";
import type { TaxRuleConfig } from "../rules/types";
import { calculateTaxableIncome } from "./calculateTaxableIncome";
import { calculateTaxBeforeRebate } from "./calculateTaxBeforeRebate";
import { calculateTaxRebate } from "./calculateTaxRebate";
import { calculateSurcharge } from "./calculateSurcharge";
import { calculateMinimumTax } from "./calculateMinimumTax";
import { calculateTDSCredit } from "./calculateTDSCredit";
import { calculateAdvanceTaxCredit } from "./calculateAdvanceTaxCredit";

/**
 * Runs the full pipeline and assembles the final result, including the
 * step-by-step explanation shown on the results screen.
 *
 * NOTE on surcharge base: computed on tax AFTER the investment rebate.
 *
 * Capital gains (owner-confirmed): the flat-rate capital gains tax
 * (LTCG real estate, listed shares, and the long-term-unlisted-shares
 * lower-of comparison) is computed entirely separately from the
 * regular pipeline and added on top AFTER the minimum-tax comparison
 * — it does not interact with rebate, surcharge, or minimum tax.
 */
export function calculateTaxPayable(
  input: TaxCalculationInput,
  rules: TaxRuleConfig,
): TaxCalculationResult {
  const income = calculateTaxableIncome(input, rules);

  const { thresholdApplied, taxBeforeRebate } = calculateTaxBeforeRebate(
    income.totalTaxableIncome,
    input.profile,
    rules,
  );

  const { eligibleInvestmentAmount, rebateAmount } = calculateTaxRebate(
    input.investmentRebateItems ?? [],
    income.totalTaxableIncome,
    rules,
  );

  const taxAfterRebate = Math.max(taxBeforeRebate - rebateAmount, 0);

  const surcharge = calculateSurcharge(taxAfterRebate, input.profile, rules);
  const taxWithSurcharge = taxAfterRebate + surcharge.surchargeAmount;

  const minimumTaxResult = calculateMinimumTax(
    income.totalTaxableIncome,
    thresholdApplied.threshold,
    input.profile,
    rules,
    income.businessGrossTurnover,
  );
  const applicableMinimumTax = minimumTaxResult.applicableMinimumTax;

  const regularTaxBeforeCapitalGains = Math.max(taxWithSurcharge, applicableMinimumTax);

  // Long-term unlisted shares: owner-confirmed "lower of" comparison.
  // Step A — incremental slab tax: tax on (pool + this gain) minus tax
  // on the pool alone (pool already includes short-term capital gains).
  // Step B — flat 15% of the gain. Final: whichever is lower.
  let longTermUnlistedSharesTax = 0;
  if (income.longTermUnlistedShareGains > 0) {
    const { taxBeforeRebate: taxWithLongTermUnlisted } = calculateTaxBeforeRebate(
      income.totalTaxableIncome + income.longTermUnlistedShareGains,
      input.profile,
      rules,
    );
    const incrementalSlabTax = taxWithLongTermUnlisted - taxBeforeRebate;
    const flatTax =
      income.longTermUnlistedShareGains * rules.capitalGains.unlistedSharesLongTermFlatRate;
    longTermUnlistedSharesTax = Math.min(incrementalSlabTax, flatTax);
  }

  const capitalGainsTax = income.flatRateCapitalGainsTax + longTermUnlistedSharesTax;

  const finalTaxLiability = regularTaxBeforeCapitalGains + capitalGainsTax;

  const tdsCredit = calculateTDSCredit(income.totalTdsFromIncomeHeads, input.credits);
  const advanceTaxCredit =
    calculateAdvanceTaxCredit(input.credits) + income.totalAdvanceTaxFromIncomeHeads;
  const otherCredits = input.credits?.otherEligibleCredits ?? 0;
  const totalCreditsApplied = tdsCredit + advanceTaxCredit + otherCredits;

  const netPosition = finalTaxLiability - totalCreditsApplied;

  const advisoryNotes: string[] = [];
  if ((input.profile.motorVehicleCount ?? 0) > 1) {
    advisoryNotes.push(
      "You own more than one motor vehicle: a separate Environmental " +
        "Surcharge (paid at vehicle registration or via return) may apply " +
        "regardless of net wealth. This is distinct from Wealth Surcharge " +
        "and is not included in the figures above — rate not yet configured.",
    );
  }

  return {
    assessmentYear: rules.assessmentYear,
    grossIncome: income.grossIncome,
    exemptIncome: input.exemptIncome ?? 0,
    totalTaxableIncome: income.totalTaxableIncome,
    thresholdCategoryApplied: thresholdApplied.category,
    taxFreeThresholdApplied: thresholdApplied.threshold,
    taxBeforeRebate,
    investmentRebate: rebateAmount,
    taxAfterRebate,
    surcharge: surcharge.surchargeAmount,
    surchargeNote: surcharge.note,
    minimumTax: applicableMinimumTax,
    regularTaxBeforeCapitalGains,
    capitalGainsTax,
    finalTaxLiability,
    totalCreditsApplied,
    taxPayable: Math.max(netPosition, 0),
    refundDue: Math.max(-netPosition, 0),
    advanceTaxInstallmentRequired: finalTaxLiability > rules.advanceTax.liabilityThreshold,
    advisoryNotes,
    steps: [
      { label: "Gross income", amount: income.grossIncome },
      { label: "Total taxable income", amount: income.totalTaxableIncome },
      {
        label: "Tax-free threshold applied",
        amount: thresholdApplied.threshold,
        note: `Category: ${thresholdApplied.category}`,
      },
      { label: "Tax before rebate", amount: taxBeforeRebate },
      {
        label: "Investment rebate",
        amount: -rebateAmount,
        note: `Eligible investment: ${eligibleInvestmentAmount}`,
      },
      { label: "Tax after rebate", amount: taxAfterRebate },
      { label: "Surcharge", amount: surcharge.surchargeAmount, note: surcharge.note },
      { label: "Minimum tax check", amount: applicableMinimumTax, note: minimumTaxResult.note },
      { label: "Regular tax (before capital gains)", amount: regularTaxBeforeCapitalGains },
      {
        label: "Capital gains tax",
        amount: capitalGainsTax,
        note:
          income.longTermUnlistedShareGains > 0
            ? `Includes long-term unlisted shares: lower of incremental slab tax or 15% flat`
            : undefined,
      },
      { label: "Final tax liability", amount: finalTaxLiability },
      { label: "TDS credit", amount: -tdsCredit },
      { label: "Advance tax credit", amount: -advanceTaxCredit },
      { label: "Other credits", amount: -otherCredits },
    ],
  };
}
