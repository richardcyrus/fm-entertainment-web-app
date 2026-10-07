import { VideoGrid } from '@/components/VideoGrid'
import type { VideoCardProps } from '@/types'

export function SearchResultsGrid({
  searchResult,
  searchTitle,
}: {
  searchResult: VideoCardProps[]
  searchTitle: string
}) {
  return (
    <VideoGrid
      title={`Found ${searchResult.length} result${
        searchResult.length === 1 ? '' : 's'
      } for ‘${searchTitle}’`}
      shows={searchResult}
    />
  )
}
