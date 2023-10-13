import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { SearchBar } from '@/components/SearchBar'
import type { ShowCategory } from '@/types'

describe('Search Bar', () => {
  let expectedLabel: string
  let expectedCategory: ShowCategory

  beforeEach(() => {
    expectedLabel = 'Search for movies or TV series'
    expectedCategory = 'All'
  })

  it('renders a search landmark', async () => {
    const { container } = render(
      <SearchBar label={expectedLabel} category={expectedCategory} />
    )

    const searchBar = screen.getByRole('search')

    expect(searchBar).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
