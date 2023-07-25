export type SearchBarProps = {
  label: string
  category: 'All' | 'Movies' | 'TV Series' | 'Bookmarked'
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
