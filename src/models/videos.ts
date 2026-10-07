import type { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { VideoListSchema } from '@/types'

async function findVideos(args: Prisma.VideoFindManyArgs) {
  return VideoListSchema.parse(await prisma.video.findMany(args))
}

export async function getTrendingShows() {
  return findVideos({
    where: { isTrending: true },
  })
}

export async function getRecommendedShows() {
  return findVideos({
    where: { isTrending: false },
  })
}

export async function getMovies() {
  return findVideos({
    where: { category: 'Movie' },
  })
}

export async function getTVSeries() {
  return findVideos({
    where: { category: 'TV Series' },
  })
}

export async function getBookmarkedMovies() {
  return findVideos({
    where: {
      isBookmarked: true,
      category: 'Movie',
    },
  })
}

export async function getBookmarkedTVSeries() {
  return findVideos({
    where: {
      isBookmarked: true,
      category: 'TV Series',
    },
  })
}

export async function setBookmarkedState(showTitle: string, action: string) {
  const show = await prisma.video.findFirstOrThrow({
    where: {
      title: showTitle,
    },
  })

  const where: Prisma.VideoWhereUniqueInput = {
    id: show.id,
  }

  const data: Prisma.VideoUpdateInput = {
    isBookmarked: action === 'set-bookmark',
  }

  return prisma.video.update({
    where,
    data,
  })
}

export async function searchShows(category: string, showTitle: string) {
  return findVideos({
    where: {
      title: { contains: showTitle, mode: 'insensitive' },
      category: {
        contains:
          category === 'All' || category === 'Bookmarked'
            ? undefined
            : category,
      },
      isBookmarked: category === 'Bookmarked' || undefined,
    },
  })
}
