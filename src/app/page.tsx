import { SearchBar } from '@/components/SearchBar'
import { TrendingRow } from '@/components/TrendingRow'
import { VideoGrid } from '@/components/VideoGrid'
import { showSearch } from '@/lib/show-search'
import { getTrendingShows, getRecommendedShows } from '@/models/videos'
import type { VideoCardProps } from '@/types'

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const recommendedShows =
    (await getRecommendedShows()) as unknown as VideoCardProps[]
  const trendingShows =
    (await getTrendingShows()) as unknown as VideoCardProps[]
  let searchResult: VideoCardProps[] = []

  if (Object.keys(searchParams).length !== 0) {
    searchResult = (await showSearch(
      searchParams.category as string,
      searchParams.title as string
    )) as unknown as VideoCardProps[]
  }

  return (
    <>
      <SearchBar label="Search for movies or TV series" category="All" />
      {Object.keys(searchParams).length === 0 ? (
        <>
          <TrendingRow shows={trendingShows} />
          <VideoGrid title="Recommended for you" shows={recommendedShows} />
        </>
      ) : (
        <VideoGrid
          title={`Found ${searchResult.length} result${
            searchResult.length > 1 ? 's' : ''
          } for ‘${searchParams.title}’`}
          shows={searchResult}
        />
      )}
    </>
  )
}
