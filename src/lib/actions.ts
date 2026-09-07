import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import { setBookmarkedState } from '@/models/videos'

const schema = z.object({
  videoTitle: z.string().min(1),
  action: z.enum(['remove-bookmark', 'set-bookmark']),
})

export const toggleBookmark = createServerFn({ method: 'POST' })
  .validator((formData: FormData) =>
    schema.parse({
      videoTitle: formData.get('videoTitle'),
      action: formData.get('action'),
    })
  )
  .handler(async ({ data }) => {
    try {
      await setBookmarkedState(data.videoTitle, data.action)

      let notice = `Removed bookmark for the show ${data.videoTitle}`
      if (data.action === 'set-bookmark') {
        notice = `Bookmarked the show ${data.videoTitle}`
      }

      return { message: notice }
    } catch {
      return {
        message: `Failed to change the bookmark status for the show ${data.videoTitle}`,
      }
    }
  })
