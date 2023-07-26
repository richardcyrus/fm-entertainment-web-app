export type ShowCategory = 'All' | 'Movies' | 'TV Series' | 'Bookmarked'

export type SearchBar = {
  label: string
  category: ShowCategory
}

export type VideoCardProps = {
  title: string
  thumbnail: {
    trending?: {
      small: string
      large: string
    }
    regular: {
      small: string
      medium: string
      large: string
    }
  }
  year: number
  category: string
  rating: string
  isBookmarked: boolean
  isTrending: boolean
}
