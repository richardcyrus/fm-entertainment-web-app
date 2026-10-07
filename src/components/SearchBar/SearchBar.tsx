import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDebouncer } from '@tanstack/react-pacer'

import SearchIcon from '@/assets/icon-search.svg?react'
import type { SearchBarProps } from '@/types'

import styles from './searchbar.module.css'

export function SearchBar({ label, category }: SearchBarProps) {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })

  const [searchTerm, setSearchTerm] = useState(() => search.title ?? '')

  const inputRef = useRef<HTMLInputElement>(null)

  // Sync from the URL only for external changes (back/forward); while the user
  // is typing, the input is the source of truth.
  useEffect(() => {
    if (document.activeElement === inputRef.current) return
    setSearchTerm(search.title ?? '')
  }, [search.title])

  const updateSearch = (title: string, searchCategory: string) => {
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        category: searchCategory,
        title: title || undefined,
      }),
    })
  }

  const debouncer = useDebouncer(updateSearch, { wait: 500 })

  const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)

    // Whatever was pending no longer matches the input.
    if (!value.trim()) {
      debouncer.cancel()

      // A truly empty field returns to browse right away; whitespace is ignored.
      if (!value) {
        updateSearch('', category)
      }

      return
    }

    debouncer.maybeExecute(value, category)
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
          ref={inputRef}
          value={searchTerm}
          onChange={onInputChanged}
        />
      </form>
    </div>
  )
}
