export type ShowCategory = 'All' | 'Movies' | 'TV Series' | 'Bookmarked'

export type SearchBarProps = {
  label: string
  category: ShowCategory
}

export type VideoCardProps = {
  id?: string
  title: string
  thumbnail: {
    trending:
      | ({
          small: string | null
          medium: string | null
          large: string | null
        } & {})
      | null
    regular:
      | ({
          small: string | null
          medium: string | null
          large: string | null
        } & {})
      | null
  }
  year: number
  category: string
  rating: string
  isBookmarked: boolean
  isTrending: boolean
}

export type TrendingRowProps = {
  shows: VideoCardProps[]
}
