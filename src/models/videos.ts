import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export async function getTrendingShows() {
  const whereCriteria = Prisma.validator<Prisma.VideoWhereInput>()({
    isTrending: true,
  })

  return prisma.video.findMany({
    where: whereCriteria,
  })
}

export async function getRecommendedShows() {
  const whereCriteria = Prisma.validator<Prisma.VideoWhereInput>()({
    isTrending: false,
  })

  return prisma.video.findMany({
    where: whereCriteria,
  })
}

export async function getMovies() {
  const whereCriteria = Prisma.validator<Prisma.VideoWhereInput>()({
    category: 'Movie',
  })

  return prisma.video.findMany({
    where: whereCriteria,
  })
}

export async function getTVSeries() {
  const whereCriteria = Prisma.validator<Prisma.VideoWhereInput>()({
    category: 'TV Series',
  })

  return prisma.video.findMany({
    where: whereCriteria,
  })
}

export async function getBookmarkedMovies() {
  const whereCriteria = Prisma.validator<Prisma.VideoWhereInput>()({
    isBookmarked: true,
    category: 'Movie',
  })

  return prisma.video.findMany({
    where: whereCriteria,
  })
}

export async function getBookmarkedTVSeries() {
  const whereCriteria = Prisma.validator<Prisma.VideoWhereInput>()({
    isBookmarked: true,
    category: 'TV Series',
  })

  return prisma.video.findMany({
    where: whereCriteria,
  })
}
