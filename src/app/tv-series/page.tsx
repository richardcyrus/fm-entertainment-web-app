import { SearchBar } from '@/components/SearchBar'
import { VideoGrid } from '@/components/VideoGrid'
import { getTVSeries } from '@/models/videos'

export default async function TVSeries() {
  const tvSeries = await getTVSeries()

  return (
    <>
      <SearchBar label="Search for TV series" category="TV Series" />
      <VideoGrid title="TV Series" shows={tvSeries} />
    </>
  )
}
