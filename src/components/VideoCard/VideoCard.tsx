import MovieCategoryIcon from '@/assets/icon-category-movie.svg?react'
import TVCategoryIcon from '@/assets/icon-category-tv.svg?react'
import PlayIcon from '@/assets/icon-play.svg?react'
import { BookmarkButton } from '@/components/BookmarkButton'
import type { VideoCardProps } from '@/types'

import styles from './VideoCard.module.css'

export function VideoCard({
  title,
  year,
  category,
  rating,
  isBookmarked,
  thumbnail,
}: VideoCardProps) {
  return (
    <>
      <div className={styles.card}>
        <div className={styles['card-image']}>
          <BookmarkButton title={title} isBookmarked={isBookmarked} />
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={thumbnail.regular?.small}
            />
            <source
              media="(min-width: 768px)"
              srcSet={thumbnail.regular?.medium}
            />
            <source
              media="(min-width: 1200px)"
              srcSet={thumbnail.regular?.large}
            />
            <img src={thumbnail.regular?.large} alt={`Backdrop for ${title}`} />
          </picture>
          <div className={styles['play-overlay']}>
            <div className={styles['play-button']}>
              <div className={styles['icon-container']}>
                <PlayIcon className={styles['play-icon']} />
              </div>
              <div className={styles['play-text']}>Play</div>
            </div>
          </div>
        </div>
        <div className={`card-body ${styles['card-body']}`}>
          <div className={styles['video-info']}>
            <div className={styles['video-meta']}>
              <span>{year}</span>
              <span className={styles.bullet}>&bull;</span>
              <span className={styles['category-icon-container']}>
                {category === 'Movie' ? (
                  <MovieCategoryIcon className={styles['category-icon']} />
                ) : null}
                {category === 'TV Series' ? (
                  <TVCategoryIcon className={styles['category-icon']} />
                ) : null}
              </span>
              <span className={styles['category-name']}>{category}</span>
              <span className={styles.bullet}>&bull;</span>
              <span>{rating}</span>
            </div>
            <h3 className={styles['video-title']}>{title}</h3>
          </div>
        </div>
      </div>
    </>
  )
}
