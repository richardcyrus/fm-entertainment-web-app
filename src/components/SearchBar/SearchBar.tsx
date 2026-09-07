'use client'

import { ChangeEvent, useEffect, useState } from 'react'

import { useNavigate } from '@tanstack/react-router'

import SearchIcon from '@/assets/icon-search.svg'
import useDebounce from '@/hooks/useDebounce'
import type { SearchBarProps } from '@/types'

import styles from './searchbar.module.css'

export function SearchBar({ label, category }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const navigate = useNavigate()

  const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const debouncedSearchTerm = useDebounce(searchTerm)

  useEffect(() => {
    if (!debouncedSearchTerm) {
      return
    }

    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        category,
        title: debouncedSearchTerm,
      }),
    })
  }, [debouncedSearchTerm, category, navigate])

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
          onChange={onInputChanged}
        />
      </form>
    </div>
  )
}
