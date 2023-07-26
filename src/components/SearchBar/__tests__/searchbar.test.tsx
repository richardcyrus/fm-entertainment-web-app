import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
// import mockRouter from 'next-router-mock/async'

import { SearchBar } from '@/components/SearchBar'
import { ShowCategory } from '@/types'

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

  it('can enter a search term', async () => {
    const { container } = render(
      <SearchBar label={expectedLabel} category={expectedCategory} />
    )
    const user = userEvent.setup()

    const searchBox = screen.getByRole('searchbox')
    await user.type(searchBox, 'Beyond Earth')

    expect(searchBox).toHaveValue('Beyond Earth')
    // await waitFor(() => {
    //   expect(mockRouter).toMatchObject({
    //     pathname: '/',
    //     asPath: '/?search=All&term=Beyond+Earth',
    //     query: { search: 'All', term: 'Beyond Earth' },
    //   })
    // })
  })
})
