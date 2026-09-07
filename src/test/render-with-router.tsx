import type { ReactElement } from 'react'

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'

export function renderWithRouter(ui: ReactElement, initialLocation = '/') {
  const rootRoute = createRootRoute({
    component: () => ui,
  })

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  })

  const slugRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/$slug',
  })

  const bookmarkedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/bookmarked',
  })

  const routeTree = rootRoute.addChildren([
    indexRoute,
    slugRoute,
    bookmarkedRoute,
  ])

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialLocation] }),
  })

  return { ...render(<RouterProvider router={router} />), router }
}
