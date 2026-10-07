import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { SearchBar } from '@/components/SearchBar'
import { SearchResultsGrid } from '@/components/SearchResultsGrid'
import { TrendingRow } from '@/components/TrendingRow'
import { VideoGrid } from '@/components/VideoGrid'
import { resolveSearchLoaderData } from '@/lib/server-fns'
import { getRecommendedShows, getTrendingShows } from '@/models/videos'
import { RouteSearchSchema } from '@/types'

const getHomeShows = createServerFn({ method: 'GET' }).handler(async () => {
  const [trendingShows, recommendedShows] = await Promise.all([
    getTrendingShows(),
    getRecommendedShows(),
  ])

  return { trendingShows, recommendedShows }
})

export const Route = createFileRoute('/')({
  validateSearch: RouteSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (deps.title) {
      return resolveSearchLoaderData(deps.category ?? 'All', deps.title)
    }

    const { trendingShows, recommendedShows } = await getHomeShows()

    return {
      kind: 'browse' as const,
      trendingShows: trendingShows,
      recommendedShows: recommendedShows,
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
        <SearchResultsGrid
          searchResult={data.searchResult}
          searchTitle={data.searchTitle}
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
