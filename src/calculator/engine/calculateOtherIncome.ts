import type { OtherSourceIncome } from "../../types/tax";

export interface OtherIncomeResult {
  /** Bank interest (net of bank charges), dividend, and casual/other
   * regular income — merges into the general slab pool. */
  regularPoolAddition: number;
  /** TDS on the regular-pool items above — adjustable against overall
   * tax liability. */
  adjustableTdsCredit: number;
  /** Sanchaypatra profit + lottery/prize winnings. Owner-confirmed:
   * Final Tax u/s 163 — kept entirely separate. NOT added to the
   * taxable income pool. */
  finalTaxIncome: number;
  /** TDS on the final-tax items above. Owner-confirmed: NOT
   * creditable or refundable against overall tax liability, even if
   * the taxpayer's other-income tax liability is zero. */
  finalTaxDeducted: number;
}

/**
 * Sections 66-69. Bank interest, dividend, and casual/other regular
 * income are ordinary taxable income with adjustable TDS. Sanchaypatra
 * and lottery/prize income are Final Tax (u/s 163) — owner-confirmed
 * to be excluded from the slab pool entirely, with their TDS neither
 * creditable nor refundable against the rest of the return.
 */
export function calculateOtherIncome(entries: OtherSourceIncome[]): OtherIncomeResult {
  let regularPoolAddition = 0;
  let adjustableTdsCredit = 0;
  let finalTaxIncome = 0;
  let finalTaxDeducted = 0;

  for (const entry of entries) {
    switch (entry.category) {
      case "bank-interest": {
        const net = Math.max(entry.grossAmount - (entry.bankChargesPaid ?? 0), 0);
        regularPoolAddition += net;
        adjustableTdsCredit += entry.tdsDeducted;
        break;
      }
      case "dividend":
      case "other-regular":
        regularPoolAddition += entry.grossAmount;
        adjustableTdsCredit += entry.tdsDeducted;
        break;
      case "sanchaypatra":
      case "lottery":
        finalTaxIncome += entry.grossAmount;
        finalTaxDeducted += entry.tdsDeducted;
        break;
    }
  }

  return { regularPoolAddition, adjustableTdsCredit, finalTaxIncome, finalTaxDeducted };
}
