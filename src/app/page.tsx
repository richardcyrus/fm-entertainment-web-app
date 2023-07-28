import { SearchBar } from '@/components/SearchBar'
import { TrendingRow } from '@/components/TrendingRow'
import { getTrendingShows } from '@/models/videos'

export default async function Home() {
  const trendingShows = await getTrendingShows()
  return (
    <>
      <SearchBar label="Search for movies or TV series" category="All" />
      <TrendingRow shows={trendingShows} />
    </>
  )
}
