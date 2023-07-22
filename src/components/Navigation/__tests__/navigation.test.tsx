import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Navigation } from '@/components/Navigation'

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
    const { container } = render(<Navigation />)

    const nav = screen.getByRole('navigation')

    expect(nav).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  links.forEach((link) => {
    it(`contains a ${link.title} link`, () => {
      render(<Navigation />)

      const linkEl = screen.getByRole('link', link.options)

      expect(linkEl).toBeInTheDocument()
      expect(linkEl).toHaveAttribute(link.attr, link.value)
    })
  })
})
