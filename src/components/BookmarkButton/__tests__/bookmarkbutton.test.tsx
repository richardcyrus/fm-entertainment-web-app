import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

import { BookmarkButton } from '@/components/BookmarkButton'
import { toggleBookmark } from '@/lib/server-fns'
import { renderWithRouter } from '@/test/render-with-router'

vi.mock('@/lib/server-fns', () => ({
  toggleBookmark: vi.fn(),
}))

describe('BookmarkButton', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(toggleBookmark).mockResolvedValue({
      message: 'Bookmarked the show Beyond Earth',
    })
  })

  it('offers to bookmark an unbookmarked show', async () => {
    renderWithRouter(
      <BookmarkButton title="Beyond Earth" isBookmarked={false} />
    )

    const button = await screen.findByRole('button', {
      name: 'Bookmark Beyond Earth',
    })

    expect(button).toHaveAttribute('value', 'set-bookmark')
  })

  it('offers to remove the bookmark from a bookmarked show', async () => {
    renderWithRouter(<BookmarkButton title="Beyond Earth" isBookmarked />)

    const button = await screen.findByRole('button', {
      name: 'Remove bookmark from Beyond Earth',
    })

    expect(button).toHaveAttribute('value', 'remove-bookmark')
  })

  it('submits the title and action, then announces the result', async () => {
    const user = userEvent.setup()
    const { router } = renderWithRouter(
      <BookmarkButton title="Beyond Earth" isBookmarked={false} />
    )
    const invalidate = vi.spyOn(router, 'invalidate')

    await user.click(
      await screen.findByRole('button', { name: 'Bookmark Beyond Earth' })
    )

    await waitFor(() => expect(toggleBookmark).toHaveBeenCalledTimes(1))
    const formData = vi.mocked(toggleBookmark).mock.calls[0][0].data
    expect(formData.get('videoTitle')).toBe('Beyond Earth')
    expect(formData.get('action')).toBe('set-bookmark')

    await waitFor(() => expect(invalidate).toHaveBeenCalled())
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Bookmarked the show Beyond Earth'
    )
  })

  it('has no accessibility violations', async () => {
    const { container } = renderWithRouter(
      <BookmarkButton title="Beyond Earth" isBookmarked={false} />
    )

    await screen.findByRole('button')

    expect(await axe(container)).toHaveNoViolations()
  })
})
