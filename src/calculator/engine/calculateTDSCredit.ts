import type { TaxCredits } from "../../types/tax";

/**
 * Combines TDS captured on individual income-head entries (salary,
 * house property, financial assets) with any additional TDS the
 * taxpayer enters directly (e.g. contract TDS not tied to a modeled
 * income head yet).
 */
export function calculateTDSCredit(
  totalTdsFromIncomeHeads: number,
  credits: TaxCredits | undefined,
): number {
  return totalTdsFromIncomeHeads + (credits?.totalTdsDeducted ?? 0);
}
