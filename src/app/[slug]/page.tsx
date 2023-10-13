import { notFound } from 'next/navigation'

import { SearchBar } from '@/components/SearchBar'
import { VideoGrid } from '@/components/VideoGrid'
import { showSearch } from '@/lib/show-search'
import { getMovies, getTVSeries } from '@/models/videos'
import type { ShowCategory, VideoCardProps } from '@/types'

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  let gridTitle: string
  let searchCategoryName: ShowCategory
  let searchLabel: string
  let searchResult: VideoCardProps[] = []
  let shows: VideoCardProps[]

  switch (params.slug) {
    case 'movies': {
      searchLabel = 'Search for movies'
      searchCategoryName = 'Movie'
      gridTitle = 'Movies'
      shows = (await getMovies()) as unknown as VideoCardProps[]
      break
    }
    case 'tv-series': {
      searchLabel = 'Search for TV series'
      searchCategoryName = 'TV Series'
      gridTitle = 'TV Series'
      shows = (await getTVSeries()) as unknown as VideoCardProps[]
      break
    }
    default: {
      notFound()
    }
  }

  if (Object.keys(searchParams).length !== 0) {
    searchResult = (await showSearch(
      searchParams.category as string,
      searchParams.title as string
    )) as unknown as VideoCardProps[]
  }

  return (
    <>
      <SearchBar label={searchLabel!} category={searchCategoryName!} />
      {Object.keys(searchParams).length === 0 ? (
        <VideoGrid title={gridTitle!} shows={shows!} />
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
