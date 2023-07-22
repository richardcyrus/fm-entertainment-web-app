import * as mockRouter from 'next-router-mock'

const useRouter = mockRouter.useRouter

export const MockNextNavigation = {
  ...mockRouter,
  usePathname: () => {
    const router = useRouter()
    return router.pathname
  },
  useSearchParams: () => {
    const router = useRouter()
    const path = router.asPath.split('?')?.[1] ?? ''
    return new URLSearchParams(path)
  },
}
