import '@fontsource-variable/outfit'
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'

import { Navigation } from '@/components/Navigation'

import appCss from '../app/global.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Entertainment Web App | Frontend Mentor' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  component: RootComponent,
})

function NotFound() {
  return (
    <div className="not-found">
      <div>
        <h2>Not Found</h2>
        <p>Could not find the requested section</p>
      </div>
    </div>
  )
}

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="page-container">
          <header>
            <Navigation />
          </header>
          <main>
            <Outlet />
          </main>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
