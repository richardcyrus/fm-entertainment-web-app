'use client'

import styles from './navigation.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Logo from '@/assets/logo.svg'
import NavBookmarkIcon from '@/assets/icon-nav-bookmark.svg'
import NavHomeIcon from '@/assets/icon-nav-home.svg'
import NavMoviesIcon from '@/assets/icon-nav-movies.svg'
import NavTVSeriesIcon from '@/assets/icon-nav-tv-series.svg'
import avatarImage from '@/public/assets/images/image-avatar.png'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className={styles.navigation}>
      <div className={styles.navWrapper}>
        <Link href="/">
          <Logo className={styles.logo} />
        </Link>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/" className={pathname === '/' ? styles.active : ''}>
              <NavHomeIcon className={styles.navIcon} />
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/movies"
              className={pathname.startsWith('/movies') ? styles.active : ''}
            >
              <NavMoviesIcon className={styles.navIcon} />
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/tv-series"
              className={pathname.startsWith('/tv-series') ? styles.active : ''}
            >
              <NavTVSeriesIcon className={styles.navIcon} />
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              href="/bookmarked"
              className={
                pathname.startsWith('/bookmarked') ? styles.active : ''
              }
            >
              <NavBookmarkIcon className={styles.navIcon} />
            </Link>
          </li>
        </ul>
        <div className={styles.avatar}>
          <Image src={avatarImage} alt="" fill />
        </div>
      </div>
    </nav>
  )
}
