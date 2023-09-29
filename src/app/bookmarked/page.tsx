import { SearchBar } from '@/components/SearchBar'
import { VideoGrid } from '@/components/VideoGrid'
import { getBookmarkedMovies, getBookmarkedTVSeries } from '@/models/videos'

export default async function Bookmarked() {
  const movies = await getBookmarkedMovies()
  const tvSeries = await getBookmarkedTVSeries()
  return (
    <>
      <SearchBar label="Search for bookmarked shows" category="Bookmarked" />
      <VideoGrid title="Bookmarked Movies" shows={movies} />
      <VideoGrid title="Bookmarked TV Series" shows={tvSeries} />
    </>
  )
}
