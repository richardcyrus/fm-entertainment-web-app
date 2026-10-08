import { describe, expect, it } from 'vitest'

import { VideoModel } from '@/models/video-model'

const valid = {
  title: 'Beyond Earth',
  thumbnail: { regular: { small: 's', medium: 'm', large: 'l' } },
  year: 2019,
  category: 'Movie',
  rating: 'PG',
  isBookmarked: false,
  isTrending: false,
}

describe('VideoModel', () => {
  it('uses the existing "Video" collection', () => {
    expect(VideoModel.collection.name).toBe('Video')
  })

  it('accepts a valid document', () => {
    expect(new VideoModel(valid).validateSync()).toBeUndefined()
  })

  it.each([
    'title',
    'year',
    'category',
    'rating',
    'isBookmarked',
    'isTrending',
  ])('requires %s', (field) => {
    const doc = new VideoModel({ ...valid, [field]: undefined })

    expect(doc.validateSync()?.errors[field]).toBeDefined()
  })
})
