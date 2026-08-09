import type { FinancialAssetIncome } from "../../types/tax";

export interface FinancialAssetIncomeResult {
  totalTaxableIncome: number;
  totalTdsDeducted: number;
}

/**
 * Per the guideline (Section 7.1): TDS on Sanchayapatra interest, bank
 * deposit interest, and capital gains is non-final (adjustable
 * advance tax) — meaning the underlying income is fully taxable at
 * slab rates, and the TDS is only a credit against final liability.
 */
export function calculateFinancialAssetIncome(
  income: FinancialAssetIncome,
): FinancialAssetIncomeResult {
  const totalTaxableIncome =
    income.bankInterest +
    income.savingsCertificateIncome +
    income.fixedDepositIncome +
    income.governmentSecurities +
    income.bondsAndDebentures +
    income.dividend +
    income.otherFinancialAssetIncome;

  return { totalTaxableIncome, totalTdsDeducted: income.tdsDeducted };
}