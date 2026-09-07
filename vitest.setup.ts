import '@testing-library/jest-dom/vitest'
import 'jest-axe/extend-expect'
import { vi } from 'vitest'

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
