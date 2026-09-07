import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { SearchBar } from '@/components/SearchBar'
import { VideoGrid } from '@/components/VideoGrid'
import { searchShowsServerFn } from '@/lib/show-search-server-fn'
import { getBookmarkedMovies, getBookmarkedTVSeries } from '@/models/videos'
import type { VideoCardProps } from '@/types'

const bookmarkedSearchSchema = z.object({
  category: z.string().optional(),
  title: z.string().optional(),
})

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
  validateSearch: bookmarkedSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (deps.title) {
      const searchResult = (await searchShowsServerFn({
        data: { category: deps.category ?? 'Bookmarked', title: deps.title },
      })) as unknown as VideoCardProps[]

      return {
        kind: 'search' as const,
        searchResult,
        searchTitle: deps.title,
      }
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
        <VideoGrid
          title={`Found ${data.searchResult.length} result${
            data.searchResult.length > 1 ? 's' : ''
          } for ‘${data.searchTitle}’`}
          shows={data.searchResult}
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
