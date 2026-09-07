# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Dev server: `npm run dev` (Vite dev server)
- Build: `npm run build` (Vite + Nitro build to `.output/`)
- Start production build: `npm run start` (`node .output/server/index.mjs`)
- Lint (ESLint + Stylelint): `npm run lint`
  - JS/TS only: `npm run lint:code`
  - CSS only: `npm run lint:css`
- Format: `npm run format` (Prettier)
- Type check: no dedicated script exists; run `npx tsc --noEmit`
- Test (Vitest): `npm test`
  - Single file: `npx vitest run path/to/file.test.tsx`
- `postinstall` runs `prisma generate` automatically after `npm install`.
- Package manager is npm (only `package-lock.json` is committed).
- Git hooks are managed by Husky (`.husky/pre-commit` runs `lint-staged`); commits will auto-lint/format staged files.
- CI (`.github/workflows/tests.yml`) runs lint, test, and build on push/PR to main/master, on Node 24.12.0 (matching the Volta pin).

## Environment

- Requires a `DATABASE_URL` env var (MongoDB connection string) in `.env.local` (gitignored). There is no `.env.example` — check with the project owner for a connection string when setting up locally.
- Node version is pinned via Volta (`volta.node` in package.json), currently 24.12.0.
- `package.json` sets `"type": "module"` — plain `.js` config files are ES modules by default; anything genuinely CommonJS must use a `.cjs` extension.

## Architecture

TanStack Start (Vite + Nitro) + React 19 + TypeScript, with Prisma/MongoDB as the only data source — **not** an external movie API despite the "entertainment" name. Prisma is pinned to 6.19 rather than the newer rust-free `prisma-client` generator, since full MongoDB support for that generator isn't stable yet.

- `src/routes/` — file-based routes. `index.tsx` (home: trending + recommended, or search results), `$slug.tsx` (single dynamic route handling both `/movies` and `/tv-series`, `notFound()` for anything else), `bookmarked.tsx`, `__root.tsx` (head/meta, renders `Navigation`, `notFoundComponent`).
- `src/router.tsx` — router instance factory (`getRouter`), registers the route tree for typed navigation.
- `src/lib/actions.ts` — `toggleBookmark`, a `createServerFn` (POST) bound to the bookmark buttons in `VideoCard`/`TrendingCard` via React's `useActionState`.
- `src/models/videos.ts` — the Prisma data-access layer: plain async functions (trending, recommended, movies, TV series, bookmarks, search, `setBookmarkedState`). Add new queries here, not inline in routes.
- `src/lib/prisma.ts` — singleton `PrismaClient` (dev hot-reload caching pattern). Always import from here.
- `src/lib/show-search.ts` — plain function; Zod-validates search input before delegating to `models/videos.ts`.
- `src/lib/show-search-server-fn.ts` — `createServerFn` wrapper around `show-search.ts`, used by route loaders so Prisma never reaches the client bundle.
- `src/types/index.ts` — shared Zod schemas and TS types (`ShowCategorySchema`, `VideoCardProps`, etc.).
- `prisma/schema.prisma` — the `Video` model (MongoDB datasource).

**Data flow pattern**: each route defines `validateSearch` (a Zod-shaped `{ category, title }`) and a `loader` that branches into a `kind: 'search' | 'browse'` result — `'search'` calls a `createServerFn`-wrapped search function, `'browse'` calls a route-local `createServerFn` wrapping the relevant `models/videos.ts` getters. Components read the result via `Route.useLoaderData()` and switch on `kind`. Follow this pattern for new routes — never call Prisma functions directly from a component.

**`createServerFn` is not portable outside Start's runtime**: it relies on request context (AsyncLocalStorage) set up by the Vite/Nitro plugin. Don't assume a `createServerFn`-wrapped function can be called from arbitrary Node code, tests, or scripts without going through the Start/Nitro server.

**Validation boundary**: Zod schemas validate inputs at the edges (`lib/show-search.ts`, `lib/actions.ts`) before they reach the Prisma layer. Follow this pattern for new server functions rather than trusting raw input.

**Component structure**: each component lives in `src/components/<Name>/` with `<Name>.tsx`, a colocated `.module.css`, an `index.tsx` barrel (`export * from './<Name>'`), and optionally `__tests__/`. Import via the barrel (`@/components/SearchBar`). Path aliases `@/*` → `src/*` and `@/public/*` → `public/*` are resolved by Vite's built-in `resolve.tsconfigPaths` (no separate plugin needed).

**Known pattern**: Prisma query results are cast `as unknown as <Props>[]` when passed into component props rather than deriving prop types from Prisma's generated types. Follow existing casts rather than introducing a new typing approach unless asked to fix this.

**Navigation**: `Navigation.tsx` uses `@tanstack/react-router`'s `Link` with `activeProps`/`activeOptions` for active-state styling — not manual `pathname` string matching. `to="/"` needs `activeOptions={{ exact: true }}`, since without it every path is a prefix-match of `/`.

**Search**: `SearchBar` debounces input, then calls `useNavigate()({ to: '.', search: (prev) => ({ ...prev, category, title }) })` — a client-side search-param update, not a full page reload.

**Styling**: CSS Modules per component plus `src/styles/global.css` / `reset.css` for globals, imported in `__root.tsx` via `?url`. Stylelint enforces alphabetical property order (`stylelint-config-standard` + `stylelint-order`).

**SVGs**: `vite-plugin-svgr` is configured with `include: '**/*.svg'` so bare imports (no `?react` suffix) resolve to React components, matching this project's import style throughout; append `?url` for the raw asset URL instead. The ambient type override lives in `src/svg.d.ts`, referenced _before_ `vite/client` in `src/vite-env.d.ts` — both declare `*.svg` and whichever is referenced first wins, so don't reorder those two lines.

## Testing

- Vitest (`vitest.config.mts`) + React Testing Library + jest-axe, set up in `vitest.setup.ts`.
- Components using `Link`/`useNavigate` need a real router context in tests — use `renderWithRouter` from `src/test/render-with-router.tsx` (wraps `render` in a minimal in-memory `RouterProvider`) instead of calling `render()` directly.
- `jest-axe`'s bundled types only augment Jest's matcher interface; `src/test/jest-axe.d.ts` augments Vitest's `Assertion` type so `toHaveNoViolations` type-checks under Vitest.
- Test files are colocated in a `__tests__/` folder next to the component they cover (e.g. `src/components/Navigation/__tests__/navigation.test.tsx`). Only `Navigation` and `SearchBar` currently have tests — most components, hooks, and the entire data/model layer are untested.

## Code style (enforced by lint-staged + ESLint + Prettier, not just convention)

- No semicolons, single quotes, 2-space indent, trailing commas (ES5 style) — Prettier-enforced, don't hand-format against it.
- Named function components must use `function` declarations (`export function Foo() {}`), not arrow-function consts (`react/function-component-definition` ESLint rule).
- No prop spreading (`react/jsx-props-no-spreading`) except on `svg` elements.
- Import order is enforced (builtin → external → internal `@/*` → relative parent/sibling/index, `react` first among externals, alphabetized within groups, blank line between groups) — let `eslint --fix` handle it rather than guessing.
