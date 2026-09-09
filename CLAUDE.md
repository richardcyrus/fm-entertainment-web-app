# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Dev server: `pnpm dev` (Vite dev server)
- Build: `pnpm build` (Vite + Nitro build to `.output/`)
- Preview production build: `pnpm preview`
- Lint (ESLint + Stylelint): `pnpm lint`
  - JS/TS only: `pnpm lint:code`
  - CSS only: `pnpm lint:css`
- Format: `pnpm format` (Prettier)
- Type check: no dedicated script exists; run `npx tsc --noEmit`
- Test (Vitest): `pnpm test`
  - Single file: `npx vitest run path/to/file.test.tsx`
- `postinstall` runs `prisma generate` automatically after `pnpm install`.
- Package manager is pnpm (only `pnpm-lock.yaml` is committed; there is no `package-lock.json`).
- Git hooks are managed by Husky (`.husky/pre-commit` runs `lint-staged`); commits will auto-lint/format staged files.
- CI (`.github/workflows/tests.yml`) runs `npm ci` / `npm run lint` / `npm run test` / `npm run build` on push/PR to main/master, pinned to Node 24.12.0 via `actions/setup-node`. **Known inconsistency**: the workflow still uses `npm ci`, which requires `package-lock.json` — that file doesn't exist in this repo (only `pnpm-lock.yaml` is committed), so this job is likely broken as written. The Node version also no longer matches the Volta pin (see Environment below).

## Environment

- Requires a `DATABASE_URL` env var (MongoDB connection string) in `.env.local` (gitignored). There is no `.env.example` — check with the project owner for a connection string when setting up locally.
- Node version is pinned via Volta (`volta.node` in package.json), currently 24.20.0 — newer than the 24.12.0 pinned in CI (see Commands above).
- `package.json` sets `"type": "module"` — plain `.js` config files are ES modules by default; anything genuinely CommonJS must use a `.cjs` extension.
- `prisma.config.ts` loads `.env.local`/`.env` via `dotenv` and configures the schema/migrations paths and `engine: 'classic'` — this is Prisma's config-file approach, replacing env-var-only configuration.

## Architecture

TanStack Start (Vite + Nitro) + React 19 + TypeScript, with Prisma/MongoDB as the only data source — **not** an external movie API despite the "entertainment" name. `prisma/schema.prisma` uses the newer rust-free `prisma-client` generator (output to `src/generated/prisma`), not the older `prisma-client-js` generator.

- `src/routes/` — file-based routes. `index.tsx` (home: trending + recommended, or search results), `$slug.tsx` (single dynamic route handling both `/movies` and `/tv-series`, `notFound()` for anything else), `bookmarked.tsx`, `__root.tsx` (head/meta, renders `Navigation`, `notFoundComponent`).
- `src/router.tsx` — router instance factory (`getRouter`), registers the route tree for typed navigation.
- `src/lib/actions.ts` — `toggleBookmark`, a `createServerFn` (POST) bound to the bookmark buttons in `VideoCard`/`TrendingCard` via React's `useActionState`.
- `src/models/videos.ts` — the Prisma data-access layer: plain async functions (trending, recommended, movies, TV series, bookmarks, search, `setBookmarkedState`). Add new queries here, not inline in routes.
- `src/lib/prisma.ts` — singleton `PrismaClient` (dev hot-reload caching pattern). Always import from here.
- `src/lib/show-search.ts` — plain function; Zod-validates search input before delegating to `models/videos.ts`.
- `src/lib/show-search-server-fn.ts` — `createServerFn` wrapper around `show-search.ts`, used by route loaders so Prisma never reaches the client bundle.
- `src/types/index.ts` — shared Zod schemas and TS types (`ShowCategorySchema`, `VideoCardProps`, etc.).
- `src/hooks/useDebounce.ts` — the only hook in the project; debounces a value over a delay (default 500ms), used by `SearchBar`.
- `prisma/schema.prisma` — the `Video` model (MongoDB datasource).

**Data flow pattern**: each route defines `validateSearch` (a Zod-shaped `{ category, title }`) and a `loader` that branches into a `kind: 'search' | 'browse'` result — `'search'` calls a `createServerFn`-wrapped search function, `'browse'` calls a route-local `createServerFn` wrapping the relevant `models/videos.ts` getters. Components read the result via `Route.useLoaderData()` and switch on `kind`. Follow this pattern for new routes — never call Prisma functions directly from a component.

**`createServerFn` is not portable outside Start's runtime**: it relies on request context (AsyncLocalStorage) set up by the Vite/Nitro plugin. Don't assume a `createServerFn`-wrapped function can be called from arbitrary Node code, tests, or scripts without going through the Start/Nitro server.

**Validation boundary**: Zod schemas validate inputs at the edges (`lib/show-search.ts`, `lib/actions.ts`) before they reach the Prisma layer. Follow this pattern for new server functions rather than trusting raw input.

**Component structure**: each component lives in `src/components/<Name>/` with `<Name>.tsx`, a colocated `.module.css`, an `index.tsx` barrel (`export * from './<Name>'`), and optionally `__tests__/`. Import via the barrel (`@/components/SearchBar`). Path aliases `@/*` → `src/*` and `@/public/*` → `public/*` are resolved by Vite's built-in `resolve.tsconfigPaths` (no separate plugin needed).

**Known pattern**: Prisma query results are cast `as unknown as <Props>[]` when passed into component props rather than deriving prop types from Prisma's generated types. Follow existing casts rather than introducing a new typing approach unless asked to fix this.

**Navigation**: `Navigation.tsx` uses `@tanstack/react-router`'s `Link` with `activeProps`/`activeOptions` for active-state styling — not manual `pathname` string matching. `to="/"` needs `activeOptions={{ exact: true }}`, since without it every path is a prefix-match of `/`.

**Search**: `SearchBar` debounces input via `useDebounce`, then an effect calls `useNavigate()({ to: '.', search: (prev) => ({ ...prev, category, title }) })` — a client-side search-param update, not a full page reload.

**Styling**: CSS Modules per component plus `src/styles/global.css` / `reset.css` for globals, imported in `__root.tsx` via `?url`. Stylelint enforces alphabetical property order (`stylelint-config-standard` + `stylelint-order`).

**SVGs**: `vite-plugin-svgr` uses its default config (no `include` override) — components import icons with an explicit `?react` suffix (e.g. `import SearchIcon from '@/assets/icon-search.svg?react'`), consistently across the codebase; omit the suffix for the raw asset URL instead. `src/vite-env.d.ts` just references `vite/client` and `vite-plugin-svgr/client` — there is no custom `src/svg.d.ts` ambient override.

## Testing

- Vitest (`vitest.config.ts`) + React Testing Library + `vitest-axe`, set up in `vitest.setup.ts`.
- Components using `Link`/`useNavigate` need a real router context in tests — use `renderWithRouter` from `src/test/render-with-router.tsx` (wraps `render` in a minimal in-memory `RouterProvider`) instead of calling `render()` directly.
- `vitest-axe/extend-expect` (imported in `vitest.setup.ts`) augments Vitest's own `Assertion`/`AsymmetricMatchersContaining` interfaces directly, so `toHaveNoViolations` type-checks with no extra ambient `.d.ts` needed. The project is pinned to the `1.0.0-pre.5` pre-release because the current stable release (`0.1.0`) only supports the older global `Vi` namespace augmentation style, which doesn't match Vitest 5.
- Test files are colocated in a `__tests__/` folder next to the component they cover (e.g. `src/components/Navigation/__tests__/navigation.test.tsx`). Only `Navigation` and `SearchBar` currently have tests — most components, hooks, and the entire data/model layer are untested.

## Code style (enforced by lint-staged + ESLint + Prettier, not just convention)

- No semicolons, single quotes, 2-space indent, trailing commas (ES5 style) — Prettier-enforced, don't hand-format against it.
- Named function components must use `function` declarations (`export function Foo() {}`), not arrow-function consts (`react/function-component-definition` ESLint rule).
- No prop spreading (`react/jsx-props-no-spreading`) except on `svg` elements.
- Import order is enforced (builtin → external → internal `@/*` → relative parent/sibling/index, `react` first among externals, alphabetized within groups, blank line between groups) — let `eslint --fix` handle it rather than guessing.
