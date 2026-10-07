import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SearchResultsGrid } from '@/components/SearchResultsGrid'
import { makeShow } from '@/test/fixtures'
import { renderWithRouter } from '@/test/render-with-router'

describe('SearchResultsGrid', () => {
  it.each([
    [0, 'Found 0 results for ‘earth’'],
    [1, 'Found 1 result for ‘earth’'],
    [2, 'Found 2 results for ‘earth’'],
  ])('with %i shows renders "%s"', async (count, heading) => {
    const shows = Array.from({ length: count }, (_, i) =>
      makeShow({ id: String(i), title: `Show ${i}` })
    )

    renderWithRouter(
      <SearchResultsGrid searchResult={shows} searchTitle="earth" />
    )

    expect(
      await screen.findByRole('heading', { level: 2, name: heading })
    ).toBeInTheDocument()
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(count)
  })
})
