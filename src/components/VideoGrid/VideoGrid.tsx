import { VideoCard } from '@/components/VideoCard'
import { VideoCardProps } from '@/types'

import styles from './VideoGrid.module.css'

export function VideoGrid({
  title,
  shows,
}: {
  title: string
  shows: VideoCardProps[]
}) {
  return (
    <div className={`videos-section ${styles['videos-section']}`}>
      <h2 className={styles['section-title']}>{title}</h2>
      <div className={styles['video-grid']}>
        {shows.map((show: VideoCardProps) => (
          <VideoCard
            key={show.id}
            title={show.title}
            thumbnail={show.thumbnail}
            year={show.year}
            category={show.category}
            rating={show.rating}
            isBookmarked={show.isBookmarked}
            isTrending={show.isTrending}
          />
        ))}
      </div>
    </div>
  )
}
