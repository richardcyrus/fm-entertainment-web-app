import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'

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

  describe('debounced search', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    function setup(initialLocation = '/') {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const utils = renderWithRouter(
        <SearchBar label={expectedLabel} category={expectedCategory} />,
        initialLocation
      )

      return { user, ...utils }
    }

    const currentSearch = (router: ReturnType<typeof setup>['router']) =>
      router.state.location.search as { category?: string; title?: string }

    it('updates the search params after the debounce wait', async () => {
      const { user, router } = setup()
      const input = await screen.findByRole('searchbox')

      await user.type(input, 'matrix')
      expect(currentSearch(router).title).toBeUndefined()

      await act(() => vi.advanceTimersByTimeAsync(500))

      await waitFor(() =>
        expect(currentSearch(router)).toMatchObject({
          category: expectedCategory,
          title: 'matrix',
        })
      )
    })

    it('navigates to browse immediately when the field is cleared', async () => {
      const { user, router } = setup('/?title=matrix&category=All')
      const input = await screen.findByRole('searchbox')

      await user.clear(input)

      await waitFor(() => expect(currentSearch(router).title).toBeUndefined())
      expect(input).toHaveValue('')
    })

    it('cancels a pending search when the field is cleared', async () => {
      const { user, router } = setup()
      const input = await screen.findByRole('searchbox')
      const navigateSpy = vi.spyOn(router, 'navigate')

      await user.type(input, 'matrix')
      await user.clear(input)
      await act(() => vi.advanceTimersByTimeAsync(1000))

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(currentSearch(router).title).toBeUndefined()
    })

    it('does not navigate for whitespace-only input', async () => {
      const { user, router } = setup()
      const input = await screen.findByRole('searchbox')
      const navigateSpy = vi.spyOn(router, 'navigate')

      await user.type(input, '   ')
      await act(() => vi.advanceTimersByTimeAsync(1000))

      expect(navigateSpy).not.toHaveBeenCalled()
    })

    it('cancels a pending search when the input becomes whitespace-only', async () => {
      const { user, router } = setup()
      const input = await screen.findByRole('searchbox')
      const navigateSpy = vi.spyOn(router, 'navigate')

      await user.type(input, 'matrix')
      await user.type(input, ' ', {
        initialSelectionStart: 0,
        initialSelectionEnd: 6,
      })
      await act(() => vi.advanceTimersByTimeAsync(1000))

      expect(navigateSpy).not.toHaveBeenCalled()
      expect(currentSearch(router).title).toBeUndefined()
    })
  })

  describe('syncing the input from the URL', () => {
    it('initialises the input from the title search param', async () => {
      renderWithRouter(
        <SearchBar label={expectedLabel} category={expectedCategory} />,
        '/?title=matrix'
      )

      expect(await screen.findByRole('searchbox')).toHaveValue('matrix')
    })

    it('updates the input on external navigation when not focused', async () => {
      const { router } = renderWithRouter(
        <SearchBar label={expectedLabel} category={expectedCategory} />,
        '/?title=matrix'
      )
      const input = await screen.findByRole('searchbox')

      await act(() => router.navigate({ to: '/', search: { title: 'alien' } }))

      await waitFor(() => expect(input).toHaveValue('alien'))
    })

    it('does not overwrite the input while it is focused', async () => {
      const user = userEvent.setup()
      const { router } = renderWithRouter(
        <SearchBar label={expectedLabel} category={expectedCategory} />,
        '/?title=matrix'
      )
      const input = await screen.findByRole('searchbox')

      await user.click(input)
      await user.type(input, ' reloaded')
      await act(() => router.navigate({ to: '/', search: { title: 'alien' } }))

      expect(input).toHaveFocus()
      expect(input).toHaveValue('matrix reloaded')
    })
  })
})
