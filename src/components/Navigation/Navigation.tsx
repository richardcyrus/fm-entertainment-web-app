import { Link } from '@tanstack/react-router'

import NavBookmarkIcon from '@/assets/icon-nav-bookmark.svg?react'
import NavHomeIcon from '@/assets/icon-nav-home.svg?react'
import NavMoviesIcon from '@/assets/icon-nav-movies.svg?react'
import NavTVSeriesIcon from '@/assets/icon-nav-tv-series.svg?react'
import Logo from '@/assets/logo.svg?react'

import styles from './navigation.module.css'

export function Navigation() {
  return (
    <nav className={styles.navigation}>
      <div className={styles['nav-wrapper']}>
        <Link to="/" aria-label="Entertainment Web App Home">
          <Logo className={styles.logo} />
        </Link>
        <ul className={styles['nav-items']}>
          <li className={styles['nav-item']}>
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: styles.active }}
              aria-label="Go to home"
            >
              <NavHomeIcon className={styles['nav-icon']} />
            </Link>
          </li>
          <li className={styles['nav-item']}>
            <Link
              to="/$slug"
              params={{ slug: 'movies' }}
              activeProps={{ className: styles.active }}
              aria-label="Go to movies"
            >
              <NavMoviesIcon className={styles['nav-icon']} />
            </Link>
          </li>
          <li className={styles['nav-item']}>
            <Link
              to="/$slug"
              params={{ slug: 'tv-series' }}
              activeProps={{ className: styles.active }}
              aria-label="Go to TV series"
            >
              <NavTVSeriesIcon className={styles['nav-icon']} />
            </Link>
          </li>
          <li className={styles['nav-item']}>
            <Link
              to="/bookmarked"
              activeProps={{ className: styles.active }}
              aria-label="Go to bookmarked videos"
            >
              <NavBookmarkIcon className={styles['nav-icon']} />
            </Link>
          </li>
        </ul>
        <div className={styles.avatar}>
          <img src="/assets/images/image-avatar.png" alt="avatar" />
        </div>
      </div>
    </nav>
  )
}
