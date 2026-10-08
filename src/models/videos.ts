import type { QueryFilter } from 'mongoose'

import { connectDb } from '@/lib/mongoose'
import { VideoModel } from '@/models/video-model'
import { VideoListSchema } from '@/types'

async function findVideos(filter: QueryFilter<unknown>) {
  await connectDb()

  const rows = await VideoModel.find(filter).lean()

  return VideoListSchema.parse(
    rows.map(({ _id, ...row }) => ({ ...row, id: String(_id) }))
  )
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function getTrendingShows() {
  return findVideos({ isTrending: true })
}

export async function getRecommendedShows() {
  return findVideos({ isTrending: false })
}

export async function getMovies() {
  return findVideos({ category: 'Movie' })
}

export async function getTVSeries() {
  return findVideos({ category: 'TV Series' })
}

export async function getBookmarkedMovies() {
  return findVideos({ isBookmarked: true, category: 'Movie' })
}

export async function getBookmarkedTVSeries() {
  return findVideos({ isBookmarked: true, category: 'TV Series' })
}

export async function setBookmarkedState(showTitle: string, action: string) {
  await connectDb()

  return VideoModel.findOneAndUpdate(
    { title: showTitle },
    { isBookmarked: action === 'set-bookmark' },
    { returnDocument: 'after' }
  ).orFail()
}

export async function searchShows(category: string, showTitle: string) {
  const filter: QueryFilter<unknown> = {
    title: { $regex: escapeRegExp(showTitle), $options: 'i' },
  }

  if (category !== 'All' && category !== 'Bookmarked') {
    filter.category = category
  }

  if (category === 'Bookmarked') {
    filter.isBookmarked = true
  }

  return findVideos(filter)
}
