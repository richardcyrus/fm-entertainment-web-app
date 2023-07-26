import { describe, expect, it } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { SearchBar } from '@/components/SearchBar'
import { ShowCategory } from '@/types'

const useRouter = jest.spyOn(require('next/navigation'), 'useRouter')

describe('Search Bar', () => {
  let expectedLabel: string
  let expectedCategory: ShowCategory
  let expectedRouterPush: jest.Mock

  beforeEach(() => {
    expectedLabel = 'Search for movies or TV series'
    expectedCategory = 'All'
    expectedRouterPush = jest.fn()
    useRouter.mockReturnValue({ push: expectedRouterPush })
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

    await waitFor(() => {
      expect(expectedRouterPush).toHaveBeenCalledTimes(1)
    })
    expect(expectedRouterPush).toHaveBeenCalledWith(
      '/?search=All&term=Beyond+Earth'
    )
    expect(searchBox).toHaveValue('Beyond Earth')
  })
})
