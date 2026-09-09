import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDebouncedCallback } from '@tanstack/react-pacer'

import SearchIcon from '@/assets/icon-search.svg?react'
import type { SearchBarProps } from '@/types'

import styles from './searchbar.module.css'

export function SearchBar({ label, category }: SearchBarProps) {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })

  const [searchTerm, setSearchTerm] = useState(() => search.title ?? '')

  useEffect(() => {
    setSearchTerm(search.title ?? '')
  }, [search.title])

  const debouncedSearch = useDebouncedCallback(
    (title: string, searchCategory: string) => {
      navigate({
        to: '.',
        search: (prev) => ({
          ...prev,
          category: searchCategory,
          title: title || undefined,
        }),
      })
    },
    { wait: 500 }
  )

  const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    debouncedSearch(event.target.value, category)
  }

  return (
    <div className="search-container">
      <form
        role="search"
        className={styles['search-form']}
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="search" aria-label={label}>
          <SearchIcon className={styles['search-icon']} />
        </label>
        <input
          className={styles['search-input']}
          type="search"
          id="search"
          name="title"
          placeholder={label}
          value={searchTerm}
          onChange={onInputChanged}
        />
      </form>
    </div>
  )
}
