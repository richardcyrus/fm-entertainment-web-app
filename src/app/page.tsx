import { SearchBar } from '@/components/SearchBar'
import { TrendingRow } from '@/components/TrendingRow'
import { VideoGrid } from '@/components/VideoGrid'
import { getTrendingShows, getRecommendedShows } from '@/models/videos'

export default async function Home() {
  const trendingShows = await getTrendingShows()
  const recommendedShows = await getRecommendedShows()

  return (
    <>
      <SearchBar label="Search for movies or TV series" category="All" />
      <TrendingRow shows={trendingShows} />
      <VideoGrid title="Recommeded for you" shows={recommendedShows} />
    </>
  )
}
