import type { BusinessIncome } from "../../types/tax";

export interface BusinessIncomeResult {
  grossTurnover: number;
  /** Net profit before tax, floored at zero. Owner-confirmed: a
   * business loss is NOT set off against the taxpayer's other income
   * — only positive net profit is added to total taxable income. A
   * loss still triggers the turnover minimum tax check, though (see
   * calculateMinimumTax.ts). */
  taxableProfit: number;
  tdsDeducted: number;
  advanceTaxPaid: number;
}

/**
 * Sole Proprietorship business/profession income (owner-confirmed
 * scope — companies and partnerships are separate legal entities with
 * their own returns and are out of scope here).
 *
 * Owner-confirmed simplified model: Net Profit Before Tax = Gross
 * Turnover - Total Expense (all-inclusive). Owner-confirmed: a loss is
 * NOT set off against other income — it contributes zero to taxable
 * income (not negative) — but gross turnover is still tracked for the
 * 1% turnover minimum tax check in calculateMinimumTax.ts, which
 * applies regardless of a loss.
 */
export function calculateBusinessIncome(entries: BusinessIncome[]): BusinessIncomeResult {
  const taxableProfit = entries.reduce(
    (sum, entry) => sum + Math.max(entry.grossTurnover - entry.totalExpense, 0),
    0,
  );
  const grossTurnover = entries.reduce((sum, e) => sum + e.grossTurnover, 0);
  const tdsDeducted = entries.reduce((sum, e) => sum + e.tdsDeducted, 0);
  const advanceTaxPaid = entries.reduce((sum, e) => sum + e.advanceTaxPaid, 0);

  return { grossTurnover, taxableProfit, tdsDeducted, advanceTaxPaid };
}
