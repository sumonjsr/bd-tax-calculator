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
        Skip to content
      </a>

      <header className="border-b border-sage/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="font-display text-lg tracking-tight text-ink">
            Bangladesh Tax Calculator
          </a>
          <nav aria-label="Primary" className="hidden gap-8 text-sm text-ink/70 sm:flex">
            <a href="/tax-calculator" className="hover:text-ink">
              Calculator
            </a>
            <a href="/tax-guides" className="hover:text-ink">
              Guides
            </a>
            <a href="/faq" className="hover:text-ink">
              FAQ
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
            This calculator provides an estimated tax calculation based on the
            information you enter and the tax rules configured for the
            selected assessment year. For filing or compliance decisions,
            verify the result against applicable Bangladesh tax law and
            official NBR guidance.
          </p>
        </div>
      </footer>
    </div>
  );
}
