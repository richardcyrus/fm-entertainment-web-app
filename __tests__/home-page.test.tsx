import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import Home from '@/app/page'

describe('Home', () => {
  it('renders a paragraph', () => {
    render(<Home />)

    const paragraph = screen.getByText(/home page/i)

    expect(paragraph).toBeInTheDocument()
  })
})
