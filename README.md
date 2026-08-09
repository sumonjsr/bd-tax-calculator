# Bangladesh Tax Calculator

A premium Bangladesh Individual Income Tax calculator. This repo is being
built incrementally — see **Current phase** below for exactly what exists
right now.

## Stack

- TypeScript + React + Vite
- Tailwind CSS v4
- Vitest + Testing Library
- ESLint (flat config) + Prettier
- Target deployment: Cloudflare Pages (static build, no backend)

## Architecture principle

```
UI → Input Model → Tax Engine → Tax Rules → Calculation Result
```

The tax engine (`src/calculator/engine`) never contains hard-coded rates,
thresholds, or exemptions. All of that lives in versioned, per-assessment-year
config files under `src/calculator/rules/<year>/`. Adding a new tax year, or
updating an existing one, should never require touching engine or UI code.

**No Bangladesh tax figures are guessed or invented anywhere in this repo.**
Every rule config currently exports `null` until the owner supplies the
official figures for that assessment year, and the engine throws a clear
error rather than calculating against an unconfigured year.

## Folder structure

```
src/
  components/       shared UI components
  pages/            route-level pages
  layouts/          page shells (header/footer, etc.)
  calculator/
    engine/         calculation logic — no UI, no hard-coded rules
    rules/          versioned per-assessment-year rule configs
  types/            shared TypeScript types (the UI <-> engine contract)
  utils/            generic helpers
  data/             static reference data
  hooks/            React hooks
  lib/              third-party integration wrappers
  styles/           design tokens + global CSS
  config/           site-wide constants
  tests/            Vitest setup + tests
```

## Current phase

**Phase 1 — Project foundation.** Done:

- Project scaffolding (Vite + React + TS + Tailwind v4)
- Design tokens and a placeholder homepage
- Full folder structure per the architecture above
- Core TypeScript types for the tax input/output model (`src/types/tax.ts`)
- Rule config contract + a registry with two unconfigured years
  (`2025-2026`, `2026-2027`)
- Engine entry point that refuses to calculate for unconfigured years
- Vitest wired up with a first passing test suite

Not yet built: actual tax calculation logic, the multi-step calculator UI,
SEO content pages, and Cloudflare deployment config. These land in later
phases once official Bangladesh tax figures are supplied.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start local dev server
npm run build     # type-check + production build
npm run test      # run the test suite once
npm run test:watch
npm run lint      # ESLint
npm run format    # Prettier — writes formatting fixes
```
