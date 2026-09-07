import { createServerFn } from '@tanstack/react-start'

import { showSearch } from '@/lib/show-search'

export const searchShowsServerFn = createServerFn({ method: 'GET' })
  .validator((data: { category: string; title: string }) => data)
  .handler(({ data }) => showSearch(data.category, data.title))
