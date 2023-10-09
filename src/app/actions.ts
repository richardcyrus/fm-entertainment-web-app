'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { setBookmarkedState } from '@/models/videos'

export async function toggleBookmark(prevState: any, formData: FormData) {
  const schema = z.object({
    videoTitle: z.string().min(1),
    action: z.enum(['remove-bookmark', 'set-bookmark']),
  })

  const data = schema.parse({
    videoTitle: formData.get('videoTitle'),
    action: formData.get('action'),
  })

  try {
    await setBookmarkedState(data.videoTitle, data.action)

    revalidatePath('/')

    let notice = `Removed bookmark for the show ${data.videoTitle}`
    if (data.action === 'set-bookmark') {
      notice = `Bookmarked the show ${data.videoTitle}`
    }

    return { message: notice }
  } catch (e) {
    return {
      message: `Failed to change the bookmark status for the show ${data.videoTitle}`,
    }
  }
}
