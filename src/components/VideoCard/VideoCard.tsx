import BookmarkEmptyIcon from '@/assets/icon-bookmark-empty.svg'
import BookmarkFullIcon from '@/assets/icon-bookmark-full.svg'
import MovieCategoryIcon from '@/assets/icon-category-movie.svg'
import TVCategoryIcon from '@/assets/icon-category-tv.svg'
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
          <div className={styles.bookmark}>
            <div className={styles['bookmark-icon-container']}>
              {isBookmarked ? (
                <BookmarkFullIcon className={styles['bookmark-icon']} />
              ) : (
                <BookmarkEmptyIcon className={styles['bookmark-icon']} />
              )}
            </div>
          </div>
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
