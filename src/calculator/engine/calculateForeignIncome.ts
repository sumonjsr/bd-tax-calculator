import type { ForeignIncome } from "../../types/tax";

export interface ForeignIncomeResult {
  /** Fully exempt — owner-confirmed for income remitted via a legal
   * banking channel. Not added to taxable income anywhere; surfaced
   * only in the exempt-income figure for transparency. */
  exemptForeignIncome: number;
  advisoryNotes: string[];
}

/**
 * Owner-confirmed rules:
 *   - Foreign income remitted via a legal banking channel is fully
 *     tax-exempt (residents and non-residents alike).
 *   - Foreign income NOT received via a legal banking channel is left
 *     UNCONFIGURED — this function refuses rather than guessing a tax
 *     treatment, since it would require manual professional review
 *     (and may raise Money Laundering / Foreign Exchange Regulation
 *     Act concerns outside this calculator's scope).
 *   - Foreign Tax Credit (double-taxation relief, Sections 225/226,
 *     DTAA-dependent) is left UNCONFIGURED — never applied as a
 *     credit, even when foreignTaxPaid is entered. Surfaced only as
 *     an advisory note recommending professional consultation.
 */
export function calculateForeignIncome(entries: ForeignIncome[]): ForeignIncomeResult {
  const needsManualReview = entries.filter((e) => !e.receivedViaLegalBankingChannel);
  if (needsManualReview.length > 0) {
    const names = needsManualReview.map((e) => `${e.country} (${e.incomeType})`).join(", ");
    throw new Error(
      `Foreign income received outside official banking channels requires manual tax ` +
        `evaluation under general income tax rules and is not yet configured in this ` +
        `calculator: ${names}. Remove these entries or consult a tax professional.`,
    );
  }

  const exemptForeignIncome = entries.reduce((sum, e) => sum + e.grossAmount, 0);

  const advisoryNotes: string[] = [];
  if (entries.some((e) => e.foreignTaxPaid > 0)) {
    advisoryNotes.push(
      "Foreign Tax Credit (u/s 225/226, DTAA-dependent) is not calculated by this " +
        "tool — the foreign tax paid amount you entered has not been applied as a " +
        "credit. Consult a qualified tax consultant for double-taxation relief.",
    );
  }

  return { exemptForeignIncome, advisoryNotes };
}
