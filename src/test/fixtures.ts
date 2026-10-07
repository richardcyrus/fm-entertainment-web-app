import type { VideoCardProps } from '@/types'

export function makeShow(overrides: Partial<VideoCardProps> = {}) {
  return {
    id: '1',
    title: 'Beyond Earth',
    thumbnail: {
      trending: {
        small: '/trending-small.jpg',
        medium: undefined,
        large: '/trending-large.jpg',
      },
      regular: {
        small: '/regular-small.jpg',
        medium: '/regular-medium.jpg',
        large: '/regular-large.jpg',
      },
    },
    year: 2019,
    category: 'Movie',
    rating: 'PG',
    isBookmarked: false,
    isTrending: false,
    ...overrides,
  } satisfies VideoCardProps
}
