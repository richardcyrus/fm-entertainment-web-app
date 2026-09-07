import { screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { beforeEach, describe, expect, it } from 'vitest'

import { SearchBar } from '@/components/SearchBar'
import { renderWithRouter } from '@/test/render-with-router'
import type { ShowCategory } from '@/types'

describe('Search Bar', () => {
  let expectedLabel: string
  let expectedCategory: ShowCategory

  beforeEach(() => {
    expectedLabel = 'Search for movies or TV series'
    expectedCategory = 'All'
  })

  it('renders a search landmark', async () => {
    const { container } = renderWithRouter(
      <SearchBar label={expectedLabel} category={expectedCategory} />
    )

    const searchBar = await screen.findByRole('search')

    expect(searchBar).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
