import type { TaxCredits } from "../../types/tax";

export function calculateTDSCredit(
  totalTdsFromIncomeHeads: number,
  credits: TaxCredits | undefined,
): number {
  return totalTdsFromIncomeHeads + (credits?.totalTdsDeducted ?? 0);
}