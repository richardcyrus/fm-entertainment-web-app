# AGENTS.md

Next.js 14 App Router + TypeScript + Prisma/MongoDB app. **`CLAUDE.md` is loaded by OpenCode
alongside this file and is the authoritative, verified reference** for setup, architecture,
styling, and testing — defer to it on anything it covers. This file is additive only.

## Context that CLAUDE.md omits

- **Only hook:** `src/hooks/useDebounce.ts` (debounces SearchBar input, then submits the
  GET form so search lives in the URL query string). CLAUDE.md's structure section never
  mentions `src/hooks/`.
- **Playwright is gone** (removed in commit `d1d30a0`); Jest is the only test runner. The
  `e2e/`, `test-results/`, `playwright-report/` ignores in `jest.config.mjs` and the Playwright
  resources in README are vestigial.
- **Run CI locally:** `.actrc` is configured for `act` (needs Docker). The single job in
  `.github/workflows/tests.yml` runs only `npm ci && npm run test` on Node 18 — lint,
  typecheck, and build are never run in CI, so run them locally before pushing.
- **Deployed app:** live at https://fm-entertainment-web-app-gamma.vercel.app (per README).
