import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Navigation } from '@/components/Navigation'

jest.mock('next/navigation', () => ({
  usePathname: () => {
    return ''
  },
}))

describe('Navigation', () => {
  it('renders a navigation landmark', async () => {
    const { container } = render(<Navigation />)

    const nav = screen.getByRole('navigation')

    expect(nav).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('contains a Home link', () => {
    render(<Navigation />)

    const link = screen.getByRole('link', {
      name: /go to home/i,
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('contains a Movies link', () => {
    render(<Navigation />)

    const link = screen.getByRole('link', {
      name: /go to movies/i,
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/movies')
  })

  it('contains a TV series link', () => {
    render(<Navigation />)

    const link = screen.getByRole('link', {
      name: /go to tv series/i,
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/tv-series')
  })

  it('contains a Bookmarked link', () => {
    render(<Navigation />)

    const link = screen.getByRole('link', {
      name: /go to bookmarked videos/i,
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/bookmarked')
  })
})
