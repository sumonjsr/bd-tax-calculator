import TaxSlabLadder from "../components/TaxSlabLadder";

const incomeCategories = [
  "বেতন / চাকরি",
  "গৃহসম্পত্তি",
  "ব্যবসা ও পেশা",
  "কৃষি আয়",
  "মূলধনী মুনাফা",
  "আর্থিক সম্পদ",
  "অন্যান্য উৎস",
  "বৈদেশিক আয়",
];

interface HomeProps {
  onStartCalculator: () => void;
}

export default function Home({ onStartCalculator }: HomeProps) {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:grid-cols-2 sm:items-center sm:py-28">
        <div>
          <p className="font-data text-xs uppercase tracking-[0.2em] text-brick">
            ব্যক্তি আয়কর · বাংলাদেশ
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
            আপনার কর কত, ধাপে ধাপে জানুন।
          </h1>
          <p className="mt-6 max-w-md text-ink/70">
            বাংলাদেশে আয়কর যেভাবে হিসাব হয় ঠিক সেভাবেই তৈরি একটি ক্যালকুলেটর
            — বেতন, সম্পত্তি, ব্যবসা, মূলধনী মুনাফা এবং আরও অনেক কিছু, ধাপে
            ধাপে, প্রতিটি সংখ্যা দেখিয়ে — শুধু একটা চূড়ান্ত অঙ্ক নয়।
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onStartCalculator}
              className="inline-flex items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
            >
              ক্যালকুলেটর শুরু করুন
            </button>
            <span className="text-sm text-ink/50">কর নির্ধারণী বছর ২০২৬-২০২৭</span>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end">
          <TaxSlabLadder />
        </div>
      </section>

      <section className="border-t border-sage/30 bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl">সব ধরনের আয়ের জন্য তৈরি</h2>
          <p className="mt-3 max-w-xl text-paper/70">
            প্রতিটি খাতের নিজস্ব ফিল্ড ও নিয়ম অনুযায়ী এই ক্যালকুলেটর এই সব
            ধরনের আয় হিসাব করতে পারে।
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
            আন্দাজ নয়, যাচাই করা যায় এমন হিসাব
          </h2>
          <p className="mt-3 text-ink/70">
            এই ক্যালকুলেটর আপনার দেওয়া তথ্য এবং নির্বাচিত কর নির্ধারণী
            বছরের জন্য নির্ধারিত কর-নিয়ম অনুযায়ী একটি আনুমানিক হিসাব দেয়।
            রিটার্ন দাখিল বা compliance সংক্রান্ত সিদ্ধান্তের আগে ফলাফলটি
            প্রযোজ্য বাংলাদেশ আয়কর আইন এবং NBR-এর সরকারি নির্দেশনার সাথে
            যাচাই করে নিন।
          </p>
        </div>
      </section>
    </div>
  );
}
