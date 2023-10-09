'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import NavBookmarkIcon from '@/assets/icon-nav-bookmark.svg'
import NavHomeIcon from '@/assets/icon-nav-home.svg'
import NavMoviesIcon from '@/assets/icon-nav-movies.svg'
import NavTVSeriesIcon from '@/assets/icon-nav-tv-series.svg'
import Logo from '@/assets/logo.svg'

import styles from './navigation.module.css'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className={styles.navigation}>
      <div className={styles['nav-wrapper']}>
        <Link href="/" aria-label="Entertainment Web App Home">
          <Logo className={styles.logo} />
        </Link>
        <ul className={styles['nav-items']}>
          <li className={styles['nav-item']}>
            <Link
              href="/"
              className={pathname === '/' ? styles.active : ''}
              aria-label="Go to home"
            >
              <NavHomeIcon className={styles['nav-icon']} />
            </Link>
          </li>
          <li className={styles['nav-item']}>
            <Link
              href="/movies"
              className={pathname.startsWith('/movies') ? styles.active : ''}
              aria-label="Go to movies"
            >
              <NavMoviesIcon className={styles['nav-icon']} />
            </Link>
          </li>
          <li className={styles['nav-item']}>
            <Link
              href="/tv-series"
              className={pathname.startsWith('/tv-series') ? styles.active : ''}
              aria-label="Go to TV series"
            >
              <NavTVSeriesIcon className={styles['nav-icon']} />
            </Link>
          </li>
          <li className={styles['nav-item']}>
            <Link
              href="/bookmarked"
              className={
                pathname.startsWith('/bookmarked') ? styles.active : ''
              }
              aria-label="Go to bookmarked videos"
            >
              <NavBookmarkIcon className={styles['nav-icon']} />
            </Link>
          </li>
        </ul>
        <div className={styles.avatar}>
          <Image
            src="/assets/images/image-avatar.png"
            alt="avatar"
            fill
            sizes="(max-width: 576px) 24px, (min-width: 768px) 32px, (min-width: 1200px) 40px, 40px"
          />
        </div>
      </div>
    </nav>
  )
}
