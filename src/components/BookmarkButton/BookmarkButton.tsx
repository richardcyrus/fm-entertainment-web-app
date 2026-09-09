import { useActionState } from 'react'
import { useRouter } from '@tanstack/react-router'

import BookmarkEmptyIcon from '@/assets/icon-bookmark-empty.svg?react'
import BookmarkFullIcon from '@/assets/icon-bookmark-full.svg?react'
import { toggleBookmark } from '@/lib/actions'
import type { BookmarkButtonProps } from '@/types'

import styles from './BookmarkButton.module.css'

const initialState = {
  message: '',
}

export function BookmarkButton({
  title,
  isBookmarked,
  className,
}: BookmarkButtonProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(
    async (_prevState: typeof initialState, formData: FormData) => {
      const result = await toggleBookmark({ data: formData })
      await router.invalidate()
      return result
    },
    initialState
  )

  return (
    <form action={formAction}>
      <input type="hidden" name="videoTitle" value={title} />
      <button
        className={['bookmark-button', styles.bookmark, className]
          .filter(Boolean)
          .join(' ')}
        type="submit"
        name="action"
        value={isBookmarked ? 'remove-bookmark' : 'set-bookmark'}
      >
        {isBookmarked ? (
          <>
            <BookmarkFullIcon
              className={`${styles['bookmark-icon']} ${styles['bookmark-full-icon']}`}
            />
            <span className="screen-reader">Remove bookmark from {title}</span>
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
        {state.message}
      </p>
    </form>
  )
}
