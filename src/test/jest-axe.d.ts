import 'vitest'

interface AxeMatchers<R = unknown> {
  toHaveNoViolations(): R
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging, not a real empty interface
  interface Assertion<T = unknown> extends AxeMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging, not a real empty interface
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
