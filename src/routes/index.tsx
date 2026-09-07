import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { SearchBar } from '@/components/SearchBar'
import { TrendingRow } from '@/components/TrendingRow'
import { VideoGrid } from '@/components/VideoGrid'
import { searchShowsServerFn } from '@/lib/show-search-server-fn'
import { getRecommendedShows, getTrendingShows } from '@/models/videos'
import type { VideoCardProps } from '@/types'

const homeSearchSchema = z.object({
  category: z.string().optional(),
  title: z.string().optional(),
})

const getHomeShows = createServerFn({ method: 'GET' }).handler(async () => {
  const [trendingShows, recommendedShows] = await Promise.all([
    getTrendingShows(),
    getRecommendedShows(),
  ])

  return { trendingShows, recommendedShows }
})

export const Route = createFileRoute('/')({
  validateSearch: homeSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (deps.title) {
      const searchResult = (await searchShowsServerFn({
        data: { category: deps.category ?? 'All', title: deps.title },
      })) as unknown as VideoCardProps[]

      return {
        kind: 'search' as const,
        searchResult,
        searchTitle: deps.title,
      }
    }

    const { trendingShows, recommendedShows } = await getHomeShows()

    return {
      kind: 'browse' as const,
      trendingShows: trendingShows as unknown as VideoCardProps[],
      recommendedShows: recommendedShows as unknown as VideoCardProps[],
    }
  },
  component: Home,
})

function Home() {
  const data = Route.useLoaderData()

  return (
    <>
      <SearchBar label="Search for movies or TV series" category="All" />
      {data.kind === 'search' ? (
        <VideoGrid
          title={`Found ${data.searchResult.length} result${
            data.searchResult.length > 1 ? 's' : ''
          } for ‘${data.searchTitle}’`}
          shows={data.searchResult}
        />
      ) : (
        <>
          <TrendingRow shows={data.trendingShows} />
          <VideoGrid
            title="Recommended for you"
            shows={data.recommendedShows}
          />
        </>
      )}
    </>
  )
}
