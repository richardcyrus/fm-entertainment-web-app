import { beforeEach, describe, expect, it, vi } from 'vitest'

import { prisma } from '@/lib/prisma'
import {
  getBookmarkedMovies,
  getBookmarkedTVSeries,
  getMovies,
  getRecommendedShows,
  getTrendingShows,
  getTVSeries,
  searchShows,
  setBookmarkedState,
} from '@/models/videos'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    video: {
      findMany: vi.fn(),
      findFirstOrThrow: vi.fn(),
      update: vi.fn(),
    },
  },
}))

const dbRow = {
  id: '1',
  title: 'Beyond Earth',
  thumbnail: {
    trending: { small: 's', medium: null, large: 'l' },
    regular: null,
  },
  year: 2019,
  category: 'Movie',
  rating: 'PG',
  isBookmarked: false,
  isTrending: true,
}

describe('videos model', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(prisma.video.findMany).mockResolvedValue([dbRow] as never)
  })

  describe('getters', () => {
    const cases = [
      ['getTrendingShows', getTrendingShows, { isTrending: true }],
      ['getRecommendedShows', getRecommendedShows, { isTrending: false }],
      ['getMovies', getMovies, { category: 'Movie' }],
      ['getTVSeries', getTVSeries, { category: 'TV Series' }],
      [
        'getBookmarkedMovies',
        getBookmarkedMovies,
        { isBookmarked: true, category: 'Movie' },
      ],
      [
        'getBookmarkedTVSeries',
        getBookmarkedTVSeries,
        { isBookmarked: true, category: 'TV Series' },
      ],
    ] as const

    it.each(cases)(
      '%s queries with the expected filter',
      async (_n, fn, where) => {
        await fn()

        expect(prisma.video.findMany).toHaveBeenCalledWith({ where })
      }
    )

    it('normalises null thumbnail urls to undefined', async () => {
      const [show] = await getTrendingShows()

      expect(show.thumbnail.trending).toEqual({
        small: 's',
        medium: undefined,
        large: 'l',
      })
      expect(show.thumbnail.regular).toBeNull()
    })

    it('rejects rows that do not match the schema', async () => {
      vi.mocked(prisma.video.findMany).mockResolvedValue([
        { ...dbRow, year: 'nineteen' },
      ] as never)

      await expect(getMovies()).rejects.toThrow()
    })
  })

  describe('searchShows', () => {
    const where = () => vi.mocked(prisma.video.findMany).mock.calls[0][0]?.where

    it.each(['All', 'Bookmarked'])(
      'does not filter by category for %s',
      async (category) => {
        await searchShows(category, 'earth')

        expect(where()?.category).toEqual({ contains: undefined })
      }
    )

    it.each(['Movie', 'TV Series'])(
      'filters by category for %s',
      async (category) => {
        await searchShows(category, 'earth')

        expect(where()?.category).toEqual({ contains: category })
        expect(where()?.isBookmarked).toBeUndefined()
      }
    )

    it('restricts to bookmarked shows for the Bookmarked category', async () => {
      await searchShows('Bookmarked', 'earth')

      expect(where()?.isBookmarked).toBe(true)
    })

    it('matches the title case-insensitively', async () => {
      await searchShows('All', 'EaRtH')

      expect(where()?.title).toEqual({ contains: 'EaRtH', mode: 'insensitive' })
    })
  })

  describe('setBookmarkedState', () => {
    beforeEach(() => {
      vi.mocked(prisma.video.findFirstOrThrow).mockResolvedValue({
        id: 'abc',
      } as never)
    })

    it.each([
      ['set-bookmark', true],
      ['remove-bookmark', false],
    ])('%s sets isBookmarked to %s', async (action, expected) => {
      await setBookmarkedState('Beyond Earth', action)

      expect(prisma.video.findFirstOrThrow).toHaveBeenCalledWith({
        where: { title: 'Beyond Earth' },
      })
      expect(prisma.video.update).toHaveBeenCalledWith({
        where: { id: 'abc' },
        data: { isBookmarked: expected },
      })
    })

    it('throws and does not update when the show is not found', async () => {
      vi.mocked(prisma.video.findFirstOrThrow).mockRejectedValue(
        new Error('No Video found')
      )

      await expect(setBookmarkedState('Nope', 'set-bookmark')).rejects.toThrow(
        'No Video found'
      )
      expect(prisma.video.update).not.toHaveBeenCalled()
    })
  })
})
