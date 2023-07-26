'use client'

import { ChangeEvent, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import SearchIcon from '@/assets/icon-search.svg'
import useDebounce from '@/hooks/useDebounce'
import type { SearchBar } from '@/types'

import styles from './searchbar.module.css'

export function SearchBar({ label, category }: SearchBar) {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const pathname = usePathname()
  const router = useRouter()

  const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  if (debouncedSearchTerm !== '') {
    router.push(`${pathname}?search=${category}&term=${searchTerm}`)
  }

  return (
    <div className="search-container">
      <form role="search" className={styles.searchForm}>
        <label htmlFor="search" aria-label={label}>
          <SearchIcon className={styles.searchIcon} />
        </label>
        <input
          className={styles.searchInput}
          type="search"
          id="search"
          name="search"
          placeholder={label}
          onChange={onInputChanged}
        />
      </form>
    </div>
  )
}
