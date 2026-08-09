import type { TaxCalculationInput, TaxCalculationResult } from "../../types/tax";
import { getTaxRules } from "../rules";

/**
 * Single entry point the UI calls to get a tax result.
 *
 * PHASE 1 SCAFFOLDING: this wires the pipeline shape described in the
 * brief (UI -> input model -> engine -> rules -> result) but every
 * calculation step below is a stub. None of it should be trusted for
 * a real figure yet — it exists so Phase 4 has a concrete file to
 * fill in once tax rules are supplied, and so the architecture can be
 * exercised by tests and the UI without lying about producing a real
 * number.
 */
export function calculateTax(input: TaxCalculationInput): TaxCalculationResult {
  // Throws clearly if the selected assessment year has no configured
  // rules yet, rather than silently calculating with guessed figures.
  const rules = getTaxRules(input.profile.assessmentYear);

  throw new Error(
    `Tax engine for assessment year "${rules.assessmentYear}" is not yet implemented. ` +
      `This is Phase 1 scaffolding — calculation logic lands in Phase 4.`,
  );
}
