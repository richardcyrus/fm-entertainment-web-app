'use client'

import { ChangeEvent, useState, useRef } from 'react'

import SearchIcon from '@/assets/icon-search.svg'
import useDebounce from '@/hooks/useDebounce'
import type { SearchBarProps } from '@/types'

import styles from './searchbar.module.css'

export function SearchBar({ label, category }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const formRef = useRef<HTMLFormElement>(null)

  const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const debouncedSearchTerm = useDebounce(searchTerm)

  if (debouncedSearchTerm) {
    formRef.current?.submit()
  }

  return (
    <div className="search-container">
      <form
        role="search"
        className={styles['search-form']}
        ref={formRef}
        method="GET"
      >
        <input type="hidden" name="category" value={category} />
        <label htmlFor="search" aria-label={label}>
          <SearchIcon className={styles['search-icon']} />
        </label>
        <input
          className={styles['search-input']}
          type="search"
          id="search"
          name="title"
          placeholder={label}
          onChange={onInputChanged}
        />
      </form>
    </div>
  )
}
