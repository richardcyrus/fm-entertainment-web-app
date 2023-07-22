// jest.setup.js

import '@testing-library/jest-dom/extend-expect'
import 'jest-axe/extend-expect'
import mockRouter from 'next-router-mock'

// @see: https://www.benmvp.com/blog/avoiding-react-act-warning-when-accessibility-testing-next-link-jest-axe/
// In order to run `jest-axe` assertions for components containing
// `next/link`, we need `IntersectionObserver` to always exist,
// but to be mocked so that we can set it to *never* intersect
import 'react-intersection-observer/test-utils'

import { defaultFallbackInView } from 'react-intersection-observer'

import { MockNextNavigation } from './__mocks__/next-navigation'

// `react-intersection-observer/test-utils` will add a mock
// `IntersectionObserver` automatically in every `beforeEach()`.
// But `next/link` checks to see if `IntersectionObserver` exists at module
// scope. So we add the bare minimum to get that check to pass.
global.IntersectionObserver = jest.fn()

// Then, when the tests actually run, we default intersection to
// `false` so that `jest-axe` assertions will pass without needing
// `act()`.
defaultFallbackInView(false)

jest.mock('next/navigation', () => MockNextNavigation)

beforeAll(() => {
  mockRouter.setCurrentUrl('/')
})
