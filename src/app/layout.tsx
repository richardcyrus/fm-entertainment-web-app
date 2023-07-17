import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './global.css'

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
      <body>{children}</body>
    </html>
  )
}
