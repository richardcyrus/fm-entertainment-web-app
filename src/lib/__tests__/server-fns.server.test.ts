import { beforeEach, describe, expect, it, vi } from 'vitest'

import { changeBookmark, showSearch } from '@/lib/server-fns.server'
import { searchShows, setBookmarkedState } from '@/models/videos'

vi.mock('@/models/videos', () => ({
  searchShows: vi.fn(),
  setBookmarkedState: vi.fn(),
}))

describe('server-fns.server', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('showSearch', () => {
    it('delegates to searchShows and returns its result', async () => {
      const shows = [{ id: '1' }]
      vi.mocked(searchShows).mockResolvedValue(shows as never)

      await expect(showSearch('Movie', 'earth')).resolves.toBe(shows)
      expect(searchShows).toHaveBeenCalledWith('Movie', 'earth')
    })
  })

  describe('changeBookmark', () => {
    it('reports a newly set bookmark', async () => {
      const result = await changeBookmark('Beyond Earth', 'set-bookmark')

      expect(setBookmarkedState).toHaveBeenCalledWith(
        'Beyond Earth',
        'set-bookmark'
      )
      expect(result).toEqual({ message: 'Bookmarked the show Beyond Earth' })
    })

    it('reports a removed bookmark', async () => {
      const result = await changeBookmark('Beyond Earth', 'remove-bookmark')

      expect(setBookmarkedState).toHaveBeenCalledWith(
        'Beyond Earth',
        'remove-bookmark'
      )
      expect(result).toEqual({
        message: 'Removed bookmark for the show Beyond Earth',
      })
    })

    it('returns a failure message instead of throwing', async () => {
      vi.mocked(setBookmarkedState).mockRejectedValue(new Error('not found'))

      await expect(changeBookmark('Nope', 'set-bookmark')).resolves.toEqual({
        message: 'Failed to change the bookmark status for the show Nope',
      })
    })
  })
})
