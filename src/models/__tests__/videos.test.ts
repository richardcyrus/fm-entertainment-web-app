import { beforeEach, describe, expect, it, vi } from 'vitest'

import { connectDb } from '@/lib/mongoose'
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
import { VideoModel } from '@/models/video-model'

vi.mock('@/lib/mongoose', () => ({
  connectDb: vi.fn(),
}))

vi.mock('@/models/video-model', () => ({
  VideoModel: {
    find: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}))

const lean = (rows: unknown[]) => ({ lean: () => Promise.resolve(rows) })

const dbRow = {
  _id: { toString: () => '1' },
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
    vi.mocked(VideoModel.find).mockReturnValue(lean([dbRow]) as never)
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

        expect(connectDb).toHaveBeenCalled()
        expect(VideoModel.find).toHaveBeenCalledWith(where)
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

    it('maps _id to a string id and drops it from the row', async () => {
      const [show] = await getTrendingShows()

      expect(show.id).toBe('1')
      expect(show).not.toHaveProperty('_id')
    })

    it('treats missing thumbnail fields as absent, as lean() omits them', async () => {
      vi.mocked(VideoModel.find).mockReturnValue(
        lean([{ ...dbRow, thumbnail: { trending: { small: 's' } } }]) as never
      )

      const [show] = await getTrendingShows()

      expect(show.thumbnail.trending).toEqual({
        small: 's',
        medium: undefined,
        large: undefined,
      })
      expect(show.thumbnail.regular).toBeNull()
    })

    it('rejects rows that do not match the schema', async () => {
      vi.mocked(VideoModel.find).mockReturnValue(
        lean([{ ...dbRow, year: 'nineteen' }]) as never
      )

      await expect(getMovies()).rejects.toThrow()
    })
  })

  describe('searchShows', () => {
    const filter = () =>
      vi.mocked(VideoModel.find).mock.calls[0][0] as never as Record<
        string,
        unknown
      >

    it.each(['All', 'Bookmarked'])(
      'does not filter by category for %s',
      async (category) => {
        await searchShows(category, 'earth')

        expect(filter()).not.toHaveProperty('category')
      }
    )

    it.each(['Movie', 'TV Series'])(
      'filters by category for %s',
      async (category) => {
        await searchShows(category, 'earth')

        expect(filter().category).toBe(category)
        expect(filter()).not.toHaveProperty('isBookmarked')
      }
    )

    it('restricts to bookmarked shows for the Bookmarked category', async () => {
      await searchShows('Bookmarked', 'earth')

      expect(filter().isBookmarked).toBe(true)
    })

    it('matches the title case-insensitively', async () => {
      await searchShows('All', 'EaRtH')

      expect(filter().title).toEqual({ $regex: 'EaRtH', $options: 'i' })
    })

    it('escapes regex metacharacters in the title', async () => {
      await searchShows('All', 'a.b(c)*')

      expect(filter().title).toEqual({
        $regex: 'a\\.b\\(c\\)\\*',
        $options: 'i',
      })
    })
  })

  describe('setBookmarkedState', () => {
    const orFail = vi.fn()

    beforeEach(() => {
      orFail.mockResolvedValue({ title: 'Beyond Earth' })
      vi.mocked(VideoModel.findOneAndUpdate).mockReturnValue({
        orFail,
      } as never)
    })

    it.each([
      ['set-bookmark', true],
      ['remove-bookmark', false],
    ])('%s sets isBookmarked to %s', async (action, expected) => {
      await setBookmarkedState('Beyond Earth', action)

      expect(connectDb).toHaveBeenCalled()
      expect(VideoModel.findOneAndUpdate).toHaveBeenCalledWith(
        { title: 'Beyond Earth' },
        { isBookmarked: expected },
        { returnDocument: 'after' }
      )
    })

    it('throws when the show is not found', async () => {
      orFail.mockRejectedValue(new Error('No document found'))

      await expect(setBookmarkedState('Nope', 'set-bookmark')).rejects.toThrow(
        'No document found'
      )
    })
  })
})
