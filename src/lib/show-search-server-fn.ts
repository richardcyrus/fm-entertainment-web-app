import { createServerFn } from '@tanstack/react-start'

import { showSearch } from '@/lib/show-search'
import type { VideoCardProps } from '@/types'

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
