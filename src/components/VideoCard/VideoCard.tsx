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
        <div className={styles.bookmark}>
          <div className={styles.bookmarkIconContainer}>
            {isBookmarked ? (
              <BookmarkFullIcon className={styles.bookmarkIcon} />
            ) : (
              <BookmarkEmptyIcon className={styles.bookmarkIcon} />
            )}
          </div>
        </div>
        <div className={styles.cardImage}>
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
        <div className={`card-body ${styles.cardBody}`}>
          <div className={styles.videoInfo}>
            <div className={styles.videoMeta}>
              <span>{year}</span>
              <span className={styles.bullet}>&bull;</span>
              <span className={styles.categoryIconContainer}>
                {category === 'Movie' ? (
                  <MovieCategoryIcon className={styles.categoryIcon} />
                ) : null}
                {category === 'TV Series' ? (
                  <TVCategoryIcon className={styles.categoryIcon} />
                ) : null}
              </span>
              <span className={styles.categoryName}>{category}</span>
              <span className={styles.bullet}>&bull;</span>
              <span>{rating}</span>
            </div>
            <h3 className={styles.videoTitle}>{title}</h3>
          </div>
        </div>
      </div>
    </>
  )
}
