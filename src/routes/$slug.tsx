import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { SearchBar } from '@/components/SearchBar'
import { VideoGrid } from '@/components/VideoGrid'
import { searchShowsServerFn } from '@/lib/show-search-server-fn'
import { getMovies, getTVSeries } from '@/models/videos'
import type { ShowCategory, VideoCardProps } from '@/types'

const slugSearchSchema = z.object({
  category: z.string().optional(),
  title: z.string().optional(),
})

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
  validateSearch: slugSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const config = slugConfig[params.slug]

    if (!config) {
      throw notFound()
    }

    if (deps.title) {
      const searchResult = (await searchShowsServerFn({
        data: {
          category: deps.category ?? config.category,
          title: deps.title,
        },
      })) as unknown as VideoCardProps[]

      return {
        kind: 'search' as const,
        config,
        searchResult,
        searchTitle: deps.title,
      }
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
        label={data.config.searchLabel}
        category={data.config.category}
      />
      {data.kind === 'search' ? (
        <VideoGrid
          title={`Found ${data.searchResult.length} result${
            data.searchResult.length > 1 ? 's' : ''
          } for ‘${data.searchTitle}’`}
          shows={data.searchResult}
        />
      ) : (
        <VideoGrid title={data.config.gridTitle} shows={data.shows} />
      )}
    </>
  )
}
