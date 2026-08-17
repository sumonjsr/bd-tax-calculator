import type { ReactNode } from "react";

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        মূল কনটেন্টে যান
      </a>

      <header className="border-b border-sage/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="font-display text-lg tracking-tight text-ink">
            বাংলাদেশ ট্যাক্স ক্যালকুলেটর
          </a>
          <nav aria-label="Primary" className="hidden gap-8 text-sm text-ink/70 sm:flex">
            <a href="/tax-calculator" className="hover:text-ink">
              ক্যালকুলেটর
            </a>
            <a href="/tax-guides" className="hover:text-ink">
              গাইড
            </a>
            <a href="/faq" className="hover:text-ink">
              সাধারণ জিজ্ঞাসা
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-sage/30">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-ink/60">
          <p>
            এই ক্যালকুলেটর আপনার দেওয়া তথ্য এবং নির্বাচিত কর নির্ধারণী বছরের
            জন্য নির্ধারিত কর-নিয়ম অনুযায়ী একটি আনুমানিক হিসাব দেয়। রিটার্ন
            দাখিল বা compliance সংক্রান্ত সিদ্ধান্তের আগে ফলাফলটি প্রযোজ্য
            বাংলাদেশ আয়কর আইন এবং NBR-এর সরকারি নির্দেশনার সাথে যাচাই করে
            নিন।
          </p>
        </div>
      </footer>
    </div>
  );
}
