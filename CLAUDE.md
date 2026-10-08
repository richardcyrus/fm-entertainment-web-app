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
- Package manager is pnpm (only `pnpm-lock.yaml` is committed; there is no `package-lock.json`).
- Git hooks are managed by Husky (`.husky/pre-commit` runs `lint-staged`); commits will auto-lint/format staged files.
- CI (`.github/workflows/tests.yml`) runs `pnpm install --frozen-lockfile` / `pnpm lint` / `pnpm test` / `pnpm build` on push/PR to main/master, using `pnpm/action-setup` (pnpm 11) and `actions/setup-node` with the latest Node 24.x (the Volta pin in `package.json` is an exact patch, CI tracks the 24 major).

## Environment

- Requires a `DATABASE_URL` env var (MongoDB connection string) in `.env.local` (gitignored). There is no `.env.example` — check with the project owner for a connection string when setting up locally.
- Node version is pinned via Volta (`volta.node` in package.json), currently 24.20.0; CI uses the latest Node 24.x (see Commands above).
- `package.json` sets `"type": "module"` — plain `.js` config files are ES modules by default; anything genuinely CommonJS must use a `.cjs` extension.

## Architecture

TanStack Start (Vite + Nitro) + React 19 + TypeScript, with Mongoose/MongoDB as the only data source — **not** an external movie API despite the "entertainment" name.

- `src/routes/` — file-based routes. `index.tsx` (home: trending + recommended, or search results), `$slug.tsx` (single dynamic route handling both `/movies` and `/tv-series`, `notFound()` for anything else), `bookmarked.tsx`, `__root.tsx` (head/meta, renders `Navigation`, `notFoundComponent`).
- `src/router.tsx` — router instance factory (`getRouter`), registers the route tree for typed navigation.
- `src/lib/server-fns.ts` — client-safe module holding the shared `createServerFn` wrappers: `toggleBookmark` (POST, bound to the bookmark buttons via `useActionState`), `searchShowsServerFn` and `resolveSearchLoaderData` (used by route loaders). Each wrapper Zod-validates its input, then calls into `lib/server-fns.server.ts`.
- `src/models/videos.ts` — the Mongoose data-access layer: plain async functions (trending, recommended, movies, TV series, bookmarks, search, `setBookmarkedState`). Add new queries here, not inline in routes.
- `src/lib/mongoose.ts` — `connectDb()`, a cached (hot-reload safe) Mongoose connection that reads `DATABASE_URL`. Await it before any query.
- `src/models/video-model.ts` — the Mongoose `Video` schema/model (pinned to the existing `Video` collection).
- `src/lib/server-fns.server.ts` — server-only logic (`showSearch`, `changeBookmark`) that imports `models/videos.ts`. Only import it from inside `createServerFn` handlers so Mongoose never reaches the client bundle; `.server.ts` files are plain functions and stay testable outside Start's runtime.
- `src/types/index.ts` — shared Zod schemas and TS types (`ShowCategorySchema`, `VideoCardProps`, etc.).

**Data flow pattern**: each route defines `validateSearch` (a Zod-shaped `{ category, title }`) and a `loader` that branches into a `kind: 'search' | 'browse'` result — `'search'` calls a `createServerFn`-wrapped search function, `'browse'` calls a route-local `createServerFn` wrapping the relevant `models/videos.ts` getters. Components read the result via `Route.useLoaderData()` and switch on `kind`. Follow this pattern for new routes — never call Mongoose models directly from a component.

**`createServerFn` is not portable outside Start's runtime**: it relies on request context (AsyncLocalStorage) set up by the Vite/Nitro plugin. Don't assume a `createServerFn`-wrapped function can be called from arbitrary Node code, tests, or scripts without going through the Start/Nitro server.

**Validation boundary**: Zod schemas validate inputs at the edges (the wrappers in `lib/server-fns.ts`) before they reach the data layer. Follow this pattern for new server functions rather than trusting raw input.

**Component structure**: each component lives in `src/components/<Name>/` with `<Name>.tsx`, a colocated `.module.css`, an `index.tsx` barrel (`export * from './<Name>'`), and optionally `__tests__/`. Import via the barrel (`@/components/SearchBar`). Path aliases `@/*` → `src/*` and `@/public/*` → `public/*` are resolved by Vite's built-in `resolve.tsconfigPaths` (no separate plugin needed).

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
