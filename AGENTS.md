# AGENTS.md

TanStack Start (Vite + Nitro) + TypeScript + Prisma/MongoDB app. **`CLAUDE.md` is loaded by OpenCode
alongside this file and is the authoritative, verified reference** for setup, architecture,
styling, and testing — defer to it on anything it covers. This file is additive only.

## Context that CLAUDE.md omits

- **Only hook:** `src/hooks/useDebounce.ts` (debounces `SearchBar` input, then triggers a
  client-side `navigate({ to: '.', search: ... })` so search still lives in the URL query
  string, without a full page reload). CLAUDE.md's structure section never mentions
  `src/hooks/`.
- **Playwright never landed** (removed in commit `d1d30a0` back when this was still a
  Next.js app); Vitest is the only test runner (migrated from Jest during the TanStack Start
  migration). The `e2e/`, `test-results/`, `playwright-report/` exclusions now live in
  `vitest.config.mts`'s `test.exclude`, and the Playwright resources in README are vestigial.
- **Run CI locally:** `.actrc` is configured for `act` (needs Docker). The single job in
  `.github/workflows/tests.yml` runs `npm ci`, `npm run lint`, `npm run test`, and
  `npm run build` on Node 24.12.0 (matching the Volta pin) on push/PR to main/master.
- **Deployed app:** live at https://fm-entertainment-web-app-gamma.vercel.app (per README) —
  this predates the TanStack Start migration, so the deployed build may not yet reflect it.
