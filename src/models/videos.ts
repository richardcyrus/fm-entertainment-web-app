import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export async function getTrendingShows() {
  const whereCriteria = Prisma.validator<Prisma.VideoWhereInput>()({
    isTrending: true,
  })

  return prisma.video.findMany({
    where: whereCriteria,
    orderBy: [{ id: 'desc' }],
  })
}
