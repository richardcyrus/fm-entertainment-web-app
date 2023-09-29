import { SearchBar } from '@/components/SearchBar'
import { VideoGrid } from '@/components/VideoGrid'
import { getMovies } from '@/models/videos'

export default async function Movies() {
  const movies = await getMovies()
  return (
    <>
      <SearchBar label="Search for movies" category="Movies" />
      <VideoGrid title="Movies" shows={movies} />
    </>
  )
}
