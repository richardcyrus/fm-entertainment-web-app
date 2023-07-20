import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './global.css'
import { Navigation } from '@/components/Navigation'

const outfit = Outfit({
  weight: ['200', '500'],
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Entertainment Web App | Frontend Mentor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
