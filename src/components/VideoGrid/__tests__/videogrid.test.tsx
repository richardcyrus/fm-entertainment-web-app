import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VideoGrid } from '@/components/VideoGrid'
import { makeShow } from '@/test/fixtures'
import { renderWithRouter } from '@/test/render-with-router'

describe('VideoGrid', () => {
  it('renders the title and one card per show', async () => {
    renderWithRouter(
      <VideoGrid
        title="Recommended for you"
        shows={[
          makeShow({ id: '1', title: 'First' }),
          makeShow({ id: '2', title: 'Second' }),
        ]}
      />
    )

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Recommended for you',
      })
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    ).toEqual(['First', 'Second'])
  })

  it("passes each show's bookmarked state to its card", async () => {
    renderWithRouter(
      <VideoGrid
        title="Bookmarks"
        shows={[
          makeShow({ id: '1', title: 'Saved', isBookmarked: true }),
          makeShow({ id: '2', title: 'Unsaved', isBookmarked: false }),
        ]}
      />
    )

    expect(
      await screen.findByRole('button', { name: 'Remove bookmark from Saved' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Bookmark Unsaved' })
    ).toBeInTheDocument()
  })

  it('renders no cards for an empty list', async () => {
    renderWithRouter(<VideoGrid title="Empty" shows={[]} />)

    await screen.findByRole('heading', { level: 2, name: 'Empty' })
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })
})
