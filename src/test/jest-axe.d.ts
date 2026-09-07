import 'vitest'

/* eslint-disable-next-line @typescript-eslint/naming-convention */
interface AxeMatchers<R = unknown> {
  toHaveNoViolations: () => R
}

declare module 'vitest' {
  interface Assertion<T = unknown> extends AxeMatchers<T> {}

  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
