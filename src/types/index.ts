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

const ThumbnailUrlsSchema = z.object({
  small: z
    .string()
    .nullable()
    .transform((url) => url ?? undefined),
  medium: z
    .string()
    .nullable()
    .transform((url) => url ?? undefined),
  large: z
    .string()
    .nullable()
    .transform((url) => url ?? undefined),
})

export const VideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.object({
    trending: ThumbnailUrlsSchema.nullable(),
    regular: ThumbnailUrlsSchema.nullable(),
  }),
  year: z.number(),
  category: z.string(),
  rating: z.string(),
  isBookmarked: z.boolean(),
  isTrending: z.boolean(),
})

export const VideoListSchema = z.array(VideoSchema)

export type VideoCardProps = z.infer<typeof VideoSchema>

export type TrendingRowProps = {
  shows: VideoCardProps[]
}
