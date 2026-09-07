import { screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Navigation } from '@/components/Navigation'
import { renderWithRouter } from '@/test/render-with-router'

describe('Navigation', () => {
  const links = [
    {
      title: 'Home',
      options: { name: /go to home/i },
      attr: 'href',
      value: '/',
    },
    {
      title: 'Movies',
      options: { name: /go to movies/i },
      attr: 'href',
      value: '/movies',
    },
    {
      title: 'TV Series',
      options: { name: /go to tv series/i },
      attr: 'href',
      value: '/tv-series',
    },
    {
      title: 'Bookmarked',
      options: { name: /go to bookmarked videos/i },
      attr: 'href',
      value: '/bookmarked',
    },
  ]

  it('renders a navigation landmark', async () => {
    const { container } = renderWithRouter(<Navigation />)

    const nav = await screen.findByRole('navigation')

    expect(nav).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  links.forEach((link) => {
    it(`contains a ${link.title} link`, async () => {
      renderWithRouter(<Navigation />)

      const linkEl = await screen.findByRole('link', link.options)

      expect(linkEl).toBeInTheDocument()
      expect(linkEl).toHaveAttribute(link.attr, link.value)
    })
  })
})
