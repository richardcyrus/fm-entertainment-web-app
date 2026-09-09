import * as z from 'zod'

export const ShowCategorySchema = z.union([
  z.literal('All'),
  z.literal('Movie'),
  z.literal('TV Series'),
  z.literal('Bookmarked'),
])

export type ShowCategory = z.infer<typeof ShowCategorySchema>

export const RouteSearchSchema = z.object({
  category: z.string().optional(),
  title: z.string().optional(),
})

export type SearchBarProps = {
  label: string
  category: ShowCategory
}

export type BookmarkButtonProps = {
  title: string
  isBookmarked: boolean
  className?: string
}

export type VideoCardProps = {
  id?: string
  title: string
  thumbnail: {
    trending:
      | ({
          small: string | undefined
          medium: string | undefined
          large: string | undefined
        } & {})
      | null
    regular:
      | ({
          small: string | undefined
          medium: string | undefined
          large: string | undefined
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
