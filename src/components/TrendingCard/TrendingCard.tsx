'use client'

import { experimental_useFormState as useFormState } from 'react-dom'

import { toggleBookmark } from '@/app/actions'
import BookmarkEmptyIcon from '@/assets/icon-bookmark-empty.svg'
import BookmarkFullIcon from '@/assets/icon-bookmark-full.svg'
import MovieCategoryIcon from '@/assets/icon-category-movie.svg'
import TVCategoryIcon from '@/assets/icon-category-tv.svg'
import PlayIcon from '@/assets/icon-play.svg'
import { VideoCardProps } from '@/types'

import styles from './TrendingCard.module.css'

const initialState = {
  message: null,
}

export function TrendingCard({
  title,
  year,
  category,
  rating,
  isBookmarked,
  thumbnail,
}: VideoCardProps) {
  const [state, formAction] = useFormState(toggleBookmark, initialState)

  return (
    <>
      <div className={styles.card}>
        <div className={styles['card-image']}>
          <form action={formAction}>
            <input type="hidden" name="videoTitle" value={title} />
            <button
              className={`bookmark-button ${styles.bookmark}`}
              type="submit"
              name="action"
              value={isBookmarked ? 'remove-bookmark' : 'set-bookmark'}
            >
              {isBookmarked ? (
                <>
                  <BookmarkFullIcon
                    className={`${styles['bookmark-icon']} ${styles['bookmark-full-icon']}`}
                  />
                  <span className="screen-reader">
                    Remove bookmark from {title}
                  </span>
                </>
              ) : (
                <>
                  <BookmarkEmptyIcon
                    className={`${styles['bookmark-icon']} ${styles['bookmark-empty-icon']}`}
                  />
                  <span className="screen-reader">Bookmark {title}</span>
                </>
              )}
            </button>
            <p className="screen-reader" aria-live="polite" role="status">
              {state?.message}
            </p>
          </form>
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={thumbnail.trending?.small}
            />
            <source
              media="(min-width: 768px)"
              srcSet={thumbnail.trending?.large}
            />
            <img
              src={thumbnail.trending?.large}
              alt={`Backdrop for ${title}`}
            />
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
        <div className={styles['card-body']}>
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
