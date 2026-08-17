/**
 * The calculation engine (src/calculator/engine) returns English
 * labels and category keys by design — it stays UI/language-agnostic.
 * This file maps those known values to Bangla for display. Anything
 * not in these maps falls back to the engine's original English text
 * (see ResultStep.tsx) rather than showing nothing.
 */

export const STEP_LABEL_BN: Record<string, string> = {
  "Gross income": "মোট আয়",
  "Total taxable income": "মোট করযোগ্য আয়",
  "Tax-free threshold applied": "প্রযোজ্য করমুক্ত সীমা",
  "Tax before rebate": "রেয়াতের আগে কর",
  "Investment rebate": "বিনিয়োগ কর রেয়াত",
  "Tax after rebate": "রেয়াতের পরে কর",
  Surcharge: "সারচার্জ",
  "Minimum tax check": "সর্বনিম্ন কর যাচাই",
  "Regular tax (before capital gains)": "নিয়মিত কর (মূলধনী মুনাফার আগে)",
  "Capital gains tax": "মূলধনী মুনাফার কর",
  "Final tax liability": "চূড়ান্ত কর দায়",
  "TDS credit": "উৎসে কর (TDS) ক্রেডিট",
  "Advance tax credit": "অগ্রিম কর ক্রেডিট",
  "Other credits": "অন্যান্য ক্রেডিট",
};

export const THRESHOLD_CATEGORY_LABEL_BN: Record<string, string> = {
  general: "সাধারণ করদাতা",
  "female-or-senior": "নারী / প্রবীণ নাগরিক (৬৫+)",
  "third-gender": "তৃতীয় লিঙ্গ",
  disabled: "প্রতিবন্ধী ব্যক্তি",
  "freedom-fighter": "গেজেটেড যুদ্ধাহত মুক্তিযোদ্ধা",
};
