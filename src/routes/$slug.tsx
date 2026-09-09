import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { SearchBar } from '@/components/SearchBar'
import { SearchResultsGrid } from '@/components/SearchResultsGrid'
import { VideoGrid } from '@/components/VideoGrid'
import { resolveSearchLoaderData } from '@/lib/show-search-server-fn'
import { getMovies, getTVSeries } from '@/models/videos'
import { RouteSearchSchema } from '@/types'
import type { ShowCategory, VideoCardProps } from '@/types'

const slugConfig: Record<
  string,
  { searchLabel: string; category: ShowCategory; gridTitle: string }
> = {
  'movies': {
    searchLabel: 'Search for movies',
    category: 'Movie',
    gridTitle: 'Movies',
  },
  'tv-series': {
    searchLabel: 'Search for TV series',
    category: 'TV Series',
    gridTitle: 'TV Series',
  },
}

const getSlugShows = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) =>
    slug === 'movies' ? getMovies() : getTVSeries()
  )

export const Route = createFileRoute('/$slug')({
  validateSearch: RouteSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const config = slugConfig[params.slug]

    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
    if (!config) {
      throw notFound()
    }

    if (deps.title) {
      const searchData = await resolveSearchLoaderData(
        deps.category ?? config.category,
        deps.title
      )

      return { ...searchData, config }
    }

    const shows = (await getSlugShows({
      data: params.slug,
    })) as unknown as VideoCardProps[]

    return { kind: 'browse' as const, config, shows }
  },
  component: SlugPage,
})

function SlugPage() {
  const data = Route.useLoaderData()

  return (
    <>
      <SearchBar
        key={data.config.category}
        label={data.config.searchLabel}
        category={data.config.category}
      />
      {data.kind === 'search' ? (
        <SearchResultsGrid
          searchResult={data.searchResult}
          searchTitle={data.searchTitle}
        />
      ) : (
        <VideoGrid title={data.config.gridTitle} shows={data.shows} />
      )}
    </>
  )
}
