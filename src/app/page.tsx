import { SearchBar } from '@/components/SearchBar'
import { getTrendingShows } from '@/models/videos'

export default async function Home() {
  const trendingShows = await getTrendingShows()
  return (
    <>
      <SearchBar label="Search for movies or TV series" category="All" />
      <p>Home page</p>
    </>
  )
}
