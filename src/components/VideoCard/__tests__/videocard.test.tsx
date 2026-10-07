import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

import { VideoCard } from '@/components/VideoCard'
import { makeShow } from '@/test/fixtures'
import { renderWithRouter } from '@/test/render-with-router'

vi.mock('@/assets/icon-category-movie.svg?react', () => ({
  default: () => <svg data-testid="movie-icon" />,
}))
vi.mock('@/assets/icon-category-tv.svg?react', () => ({
  default: () => <svg data-testid="tv-icon" />,
}))

describe('VideoCard', () => {
  it('renders the show details', async () => {
    renderWithRouter(<VideoCard {...makeShow()} />)

    expect(
      await screen.findByRole('heading', { level: 3, name: 'Beyond Earth' })
    ).toBeInTheDocument()
    expect(screen.getByText('2019')).toBeInTheDocument()
    expect(screen.getByText('Movie')).toBeInTheDocument()
    expect(screen.getByText('PG')).toBeInTheDocument()
  })

  it('uses the thumbnail as the backdrop image', async () => {
    renderWithRouter(<VideoCard {...makeShow()} />)

    const img = await screen.findByRole('img', {
      name: 'Backdrop for Beyond Earth',
    })

    expect(img).toHaveAttribute('src', '/regular-large.jpg')
  })

  it('shows the category label for TV series', async () => {
    renderWithRouter(<VideoCard {...makeShow({ category: 'TV Series' })} />)

    expect(await screen.findByText('TV Series')).toBeInTheDocument()
    expect(screen.queryByText('Movie')).not.toBeInTheDocument()
  })

  it('reflects the bookmarked state in the bookmark button', async () => {
    renderWithRouter(<VideoCard {...makeShow({ isBookmarked: true })} />)

    expect(
      await screen.findByRole('button', {
        name: 'Remove bookmark from Beyond Earth',
      })
    ).toBeInTheDocument()
  })

  it.each([
    ['Movie', 'movie-icon', 'tv-icon'],
    ['TV Series', 'tv-icon', 'movie-icon'],
  ])(
    'shows only the matching category icon for %s',
    async (category, shown, hidden) => {
      renderWithRouter(<VideoCard {...makeShow({ category })} />)

      expect(await screen.findByTestId(shown)).toBeInTheDocument()
      expect(screen.queryByTestId(hidden)).not.toBeInTheDocument()
    }
  )

  it('shows no category icon for other categories', async () => {
    renderWithRouter(<VideoCard {...makeShow({ category: 'Documentary' })} />)

    await screen.findByText('Documentary')
    expect(screen.queryByTestId('movie-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('tv-icon')).not.toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderWithRouter(<VideoCard {...makeShow()} />)

    await screen.findByRole('heading', { level: 3 })

    expect(await axe(container)).toHaveNoViolations()
  })
})
