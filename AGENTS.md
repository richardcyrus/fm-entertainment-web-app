# AGENTS.md

TanStack Start (Vite + Nitro) + TypeScript + Prisma/MongoDB app. **`CLAUDE.md` is loaded by OpenCode
alongside this file and is the authoritative, verified reference** for setup, architecture,
styling, and testing — defer to it on anything it covers. This file is additive only.

## Context that CLAUDE.md omits

- **Playwright never landed** (removed in commit `d1d30a0` back when this was still a
  Next.js app); Vitest is the only test runner (migrated from Jest during the TanStack Start
  migration). The `e2e/`, `test-results/`, `tests-examples/`, `playwright-report/` exclusions
  now live in `vitest.config.ts`'s `test.exclude`, and the Playwright resources in README are
  vestigial.
- **Deployed app:** live at https://fm-entertainment-web-app-gamma.vercel.app (per README) —
  this predates the TanStack Start migration, so the deployed build may not yet reflect it.
