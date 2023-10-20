import { z } from 'zod'

import { searchShows } from '@/models/videos'
import { ShowCategorySchema } from '@/types'

export async function showSearch(category: string, title: string) {
  const schema = z.object({
    category: ShowCategorySchema,
    title: z.string().min(1),
  })

  const inputs = schema.parse({
    category,
    title,
  })

  return searchShows(inputs.category, inputs.title)
}
