'use client'

import { FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { TrendingCard } from '@/components/TrendingCard'
import { TrendingRowProps } from '@/types'

import styles from './TrendingRow.module.css'

// Import Swiper styles
import 'swiper/css/bundle'

export function TrendingRow(props: TrendingRowProps) {
  return (
    <div className={styles['trending-row']}>
      <h2 className={styles['row-title']}>Trending</h2>
      <div className={styles['card-container']}>
        <Swiper
          modules={[FreeMode]}
          freeMode
          slidesPerView="auto"
          spaceBetween={16}
          breakpoints={{
            320: {
              spaceBetween: 16,
            },
            576: {
              spaceBetween: 16,
            },
            768: {
              spaceBetween: 40,
            },
            1200: {
              spaceBetween: 40,
            },
          }}
        >
          {props.shows.map((show) => (
            <SwiperSlide key={show.id} className={styles['swiper-slide']}>
              <TrendingCard
                title={show.title}
                thumbnail={show.thumbnail}
                year={show.year}
                category={show.category}
                rating={show.rating}
                isBookmarked={show.isBookmarked}
                isTrending={show.isTrending}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
