import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { changeBookmark, showSearch } from '@/lib/server-fns.server'
import { ShowCategorySchema } from '@/types'

const searchSchema = z.object({
  category: ShowCategorySchema,
  title: z.string().min(1),
})

const bookmarkSchema = z.object({
  videoTitle: z.string().min(1),
  action: z.enum(['remove-bookmark', 'set-bookmark']),
})

export const searchShowsServerFn = createServerFn({ method: 'GET' })
  .validator((data: { category: string; title: string }) =>
    searchSchema.parse(data)
  )
  .handler(({ data }) => showSearch(data.category, data.title))

export async function resolveSearchLoaderData(category: string, title: string) {
  const searchResult = await searchShowsServerFn({
    data: { category, title },
  })

  return {
    kind: 'search' as const,
    searchResult,
    searchTitle: title,
  }
}

export const toggleBookmark = createServerFn({ method: 'POST' })
  .validator((formData: FormData) =>
    bookmarkSchema.parse({
      videoTitle: formData.get('videoTitle'),
      action: formData.get('action'),
    })
  )
  .handler(({ data }) => changeBookmark(data.videoTitle, data.action))
