import { searchShows, setBookmarkedState } from '@/models/videos'
import type { ShowCategory } from '@/types'

export async function showSearch(category: ShowCategory, title: string) {
  return searchShows(category, title)
}

export async function changeBookmark(
  videoTitle: string,
  action: 'remove-bookmark' | 'set-bookmark'
) {
  try {
    await setBookmarkedState(videoTitle, action)

    let notice = `Removed bookmark for the show ${videoTitle}`
    if (action === 'set-bookmark') {
      notice = `Bookmarked the show ${videoTitle}`
    }

    return { message: notice }
  } catch {
    return {
      message: `Failed to change the bookmark status for the show ${videoTitle}`,
    }
  }
}
