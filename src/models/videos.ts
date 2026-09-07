import type { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

export async function getTrendingShows() {
  return prisma.video.findMany({
    where: { isTrending: true },
  })
}

export async function getRecommendedShows() {
  return prisma.video.findMany({
    where: { isTrending: false },
  })
}

export async function getMovies() {
  return prisma.video.findMany({
    where: { category: 'Movie' },
  })
}

export async function getTVSeries() {
  return prisma.video.findMany({
    where: { category: 'TV Series' },
  })
}

export async function getBookmarkedMovies() {
  return prisma.video.findMany({
    where: {
      isBookmarked: true,
      category: 'Movie',
    },
  })
}

export async function getBookmarkedTVSeries() {
  return prisma.video.findMany({
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
  return prisma.video.findMany({
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
