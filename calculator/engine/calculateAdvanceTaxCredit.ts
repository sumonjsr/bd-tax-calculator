import type { TaxCredits } from "../../types/tax";

export function calculateAdvanceTaxCredit(credits: TaxCredits | undefined): number {
  return credits?.advanceTaxPaid ?? 0;
}
