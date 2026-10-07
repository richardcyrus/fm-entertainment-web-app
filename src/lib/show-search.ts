import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { searchShows } from '@/models/videos'
import { ShowCategorySchema } from '@/types'
import type { VideoCardProps } from '@/types'

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

export const searchShowsServerFn = createServerFn({ method: 'GET' })
  .validator((data: { category: string; title: string }) => data)
  .handler(({ data }) => showSearch(data.category, data.title))

export async function resolveSearchLoaderData(category: string, title: string) {
  const searchResult = (await searchShowsServerFn({
    data: { category, title },
  })) as unknown as VideoCardProps[]

  return {
    kind: 'search' as const,
    searchResult,
    searchTitle: title,
  }
}
