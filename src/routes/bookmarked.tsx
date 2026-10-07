import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { SearchBar } from '@/components/SearchBar'
import { SearchResultsGrid } from '@/components/SearchResultsGrid'
import { VideoGrid } from '@/components/VideoGrid'
import { resolveSearchLoaderData } from '@/lib/show-search'
import { getBookmarkedMovies, getBookmarkedTVSeries } from '@/models/videos'
import { RouteSearchSchema } from '@/types'
import type { VideoCardProps } from '@/types'

const getBookmarkedShows = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [movies, tvSeries] = await Promise.all([
      getBookmarkedMovies(),
      getBookmarkedTVSeries(),
    ])

    return { movies, tvSeries }
  }
)

export const Route = createFileRoute('/bookmarked')({
  validateSearch: RouteSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (deps.title) {
      return resolveSearchLoaderData(deps.category ?? 'Bookmarked', deps.title)
    }

    const { movies, tvSeries } = await getBookmarkedShows()

    return {
      kind: 'browse' as const,
      movies: movies as unknown as VideoCardProps[],
      tvSeries: tvSeries as unknown as VideoCardProps[],
    }
  },
  component: BookmarkedPage,
})

function BookmarkedPage() {
  const data = Route.useLoaderData()

  return (
    <>
      <SearchBar label="Search for bookmarked shows" category="Bookmarked" />
      {data.kind === 'search' ? (
        <SearchResultsGrid
          searchResult={data.searchResult}
          searchTitle={data.searchTitle}
        />
      ) : (
        <>
          <VideoGrid title="Bookmarked Movies" shows={data.movies} />
          <VideoGrid title="Bookmarked TV Series" shows={data.tvSeries} />
        </>
      )}
    </>
  )
}
