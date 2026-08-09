import TaxSlabLadder from "../components/TaxSlabLadder";

const incomeCategories = [
  "Salary / Employment",
  "House Property",
  "Business & Profession",
  "Agricultural Income",
  "Capital Gains",
  "Financial Assets",
  "Other Sources",
  "Foreign Income",
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:grid-cols-2 sm:items-center sm:py-28">
        <div>
          <p className="font-data text-xs uppercase tracking-[0.2em] text-brick">
            Individual income tax · Bangladesh
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
            Know what you owe, one slab at a time.
          </h1>
          <p className="mt-6 max-w-md text-ink/70">
            A calculator built around how Bangladesh actually taxes income —
            salary, property, business, capital gains, and more — walked
            through step by step, with every figure shown, not just a final
            number.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span
              className="inline-flex cursor-not-allowed items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium text-paper opacity-50"
              aria-disabled="true"
            >
              Start calculator — coming soon
            </span>
            <span className="text-sm text-ink/50">
              Foundation in progress · Phase 1
            </span>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end">
          <TaxSlabLadder />
        </div>
      </section>

      <section className="border-t border-sage/30 bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl">Built for every income type</h2>
          <p className="mt-3 max-w-xl text-paper/70">
            The calculator will support these categories from day one, each
            with its own set of fields and rules.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-paper/85 sm:grid-cols-4">
            {incomeCategories.map((category) => (
              <li key={category} className="border-l-2 border-gold/60 pl-3">
                {category}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl text-ink">
            An estimate you can check, not a black box
          </h2>
          <p className="mt-3 text-ink/70">
            This calculator provides an estimated tax calculation based on
            the information you enter and the tax rules configured for the
            selected assessment year. For filing or compliance decisions,
            verify the result against applicable Bangladesh tax law and
            official NBR guidance.
          </p>
        </div>
      </section>
    </div>
  );
}
