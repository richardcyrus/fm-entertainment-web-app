# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Dev server: `npm run dev`
- Build: `npm run build`
- Start production build: `npm run start`
- Lint (ESLint + Stylelint): `npm run lint`
  - JS/TS only: `npm run lint:code`
  - CSS only: `npm run lint:css`
- Format: `npm run format` (Prettier)
- Type check: no dedicated script exists; run `npx tsc --noEmit`
- Test (Jest): `npm test`
  - Single file: `npx jest path/to/file.test.tsx`
- `postinstall` runs `prisma generate` automatically after `npm install`. If Prisma types seem stale after pulling schema changes, rerun it manually: `npx prisma generate`.
- Package manager is npm (only `package-lock.json` is committed).
- Git hooks are managed by Husky (`.husky/pre-commit` runs `lint-staged`); commits will auto-lint/format staged files.
- CI (`.github/workflows/tests.yml`) only runs `npm ci` + `npm run test` on push/PR to main/master — lint, type-check, and build are not part of CI, so run them locally before pushing.

## Environment

- Requires a `DATABASE_URL` env var (MongoDB connection string) in `.env.local` (gitignored). There is no `.env.example` — check with the project owner for a connection string when setting up locally.
- Node version is pinned via Volta (`volta.node` in package.json), currently 24.12.0. Note CI runs Node 18, so don't rely on very new Node APIs.

## Architecture

Next.js 14 App Router + TypeScript, with Prisma/MongoDB as the only data source — **not** an external movie API despite the "entertainment" name. All video/show data lives in MongoDB and is queried directly from Server Components.

- `src/app/` — routes. `page.tsx` (home: trending + recommended, or search results via `searchParams`), `[slug]/page.tsx` (single dynamic route handling both `/movies` and `/tv-series`, branching on the slug param, `notFound()` otherwise), `bookmarked/page.tsx`, `actions.ts` (Server Actions, e.g. `toggleBookmark`).
- `src/models/videos.ts` — the entire Prisma data-access layer (all `prisma.video` queries live here: trending, recommended, movies, TV series, bookmarks, search). Add new queries here rather than calling `prisma` directly from components/pages.
- `src/lib/prisma.ts` — singleton `PrismaClient` (standard dev hot-reload caching pattern). Always import the client from here, never instantiate a new one.
- `src/lib/show-search.ts` — Zod-validates search input before delegating to `models/videos.ts`.
- `src/types/index.ts` — shared Zod schemas and TS types (`ShowCategorySchema`, `VideoCardProps`, etc.).
- `prisma/schema.prisma` — the `Video` model (MongoDB datasource). This is the source of truth for the data shape.

**Data flow pattern**: pages are `async` Server Components that call `models/videos.ts` functions directly (no client-side fetching, no global state library). Search state lives in the URL query string, not React state. Mutations (bookmarking) use `'use server'` Server Actions bound via `useFormState`, followed by `revalidatePath()` to refresh server data — this is the idiomatic pattern to follow for any new mutation.

**Validation boundary**: Zod schemas validate inputs at the edges (`lib/show-search.ts`, `app/actions.ts`) before they reach the Prisma layer. Follow this pattern for new server actions/queries rather than trusting raw input.

**Component structure**: each component lives in its own folder under `src/components/<Name>/` with `<Name>.tsx`, a colocated `.module.css` file, an `index.tsx` barrel (`export * from './<Name>'`), and optionally a `__tests__/` subfolder. Import components via the barrel (`@/components/SearchBar`), not the internal file directly. Path aliases: `@/*` → `src/*`, `@/public/*` → `public/*`.

**Known pattern to be aware of**: Prisma query results are often cast `as unknown as <Props>[]` when passed into component props rather than the component prop types being derived from Prisma's generated types. Follow existing casts rather than introducing a new typing approach unless asked to fix this.

**Styling**: CSS Modules per component plus `src/app/global.css` / `reset.css` for globals. Stylelint enforces alphabetical property order (`stylelint-config-standard` + `stylelint-order`); class naming is unrestricted (works with CSS Modules' generated names).

**SVGs**: imported as React components via `@svgr/webpack` (configured in `next.config.js`); append `?url` to an SVG import path to get a URL string instead.

## Testing

- Jest (via `next/jest`) + React Testing Library + jest-axe, configured in `jest.config.mjs` / `jest.setup.ts`.
- `next/navigation` is mocked with `next-router-mock` (see `__mocks__/next-navigation.ts`); `IntersectionObserver` is stubbed globally for jest-axe/next-link compatibility.
- Test files are colocated in a `__tests__/` folder next to the component they cover (e.g. `src/components/Navigation/__tests__/navigation.test.tsx`). Only `Navigation` and `SearchBar` currently have tests — most components, hooks, and the entire data/model layer are untested.

## Code style (enforced by lint-staged + ESLint + Prettier, not just convention)

- No semicolons, single quotes, 2-space indent, trailing commas (ES5 style) — Prettier-enforced, don't hand-format against it.
- Named function components must use `function` declarations (`export function Foo() {}`), not arrow-function consts (`react/function-component-definition` ESLint rule).
- No prop spreading (`react/jsx-props-no-spreading`) except on `svg` elements.
- Import order is enforced (builtin → external → internal, `react` first among externals, alphabetized within groups, blank line between groups) — let ESLint's `import/order` autofix handle this rather than guessing.
