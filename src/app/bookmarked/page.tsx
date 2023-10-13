import { SearchBar } from '@/components/SearchBar'
import { VideoGrid } from '@/components/VideoGrid'
import { showSearch } from '@/lib/show-search'
import { getBookmarkedMovies, getBookmarkedTVSeries } from '@/models/videos'
import type { VideoCardProps } from '@/types'

export default async function Bookmarked({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const movies = (await getBookmarkedMovies()) as unknown as VideoCardProps[]
  const tvSeries =
    (await getBookmarkedTVSeries()) as unknown as VideoCardProps[]

  let searchResult: VideoCardProps[] = []

  if (Object.keys(searchParams).length !== 0) {
    searchResult = (await showSearch(
      searchParams.category as string,
      searchParams.title as string
    )) as unknown as VideoCardProps[]
  }

  return (
    <>
      <SearchBar label="Search for bookmarked shows" category="Bookmarked" />
      {Object.keys(searchParams).length == 0 ? (
        <>
          <VideoGrid title="Bookmarked Movies" shows={movies} />
          <VideoGrid title="Bookmarked TV Series" shows={tvSeries} />
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
