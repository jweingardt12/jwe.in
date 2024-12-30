'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

export function Photos() {
  const rotations = [
    'rotate-3',
    '-rotate-4',
    'rotate-2',
    'rotate-2',
    '-rotate-2',
  ]
  const photos = [
    {
      image: require('@/images/photos/image-1.jpg'),
      hoverText: 'Kauai, HI',
      link: 'https://unsplash.com/photos/high-angle-photo-of-mountain-bjIi891Jfiw',
    },
    {
      image: require('@/images/photos/image-2.jpg'),
      hoverText: 'Mountain vista',
      link: 'https://example.com/mountain',
    },
    {
      image: require('@/images/photos/image-3.jpg'),
      hoverText: 'City lights',
      link: 'https://example.com/city',
    },
    {
      image: require('@/images/photos/image-4.jpg'),
      hoverText: 'Forest trail',
      link: 'https://example.com/forest',
    },
    {
      image: require('@/images/photos/image-5.jpg'),
      hoverText: 'Ocean waves',
      link: 'https://example.com/ocean',
    },
  ]

  const scrollRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scroll = () => {
      const currentScroll = scrollContainer.scrollLeft
      const maxScroll =
        scrollContainer.scrollWidth - scrollContainer.clientWidth

      if (currentScroll >= maxScroll) {
        scrollContainer.scrollLeft = 0
      } else {
        scrollContainer.scrollLeft += 1
      }
    }

    let intervalId = null
    if (hoveredIndex === null) {
      intervalId = setInterval(scroll, 50)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [hoveredIndex])

  return (
    <div className="mt-16 sm:mt-20">
      <div
        ref={scrollRef}
        className="scrollbar-hide relative -my-4 flex gap-5 overflow-x-auto scroll-smooth py-4 sm:gap-8"
      >
        {[...photos, ...photos.slice(0, 3)].map(
          ({ image, hoverText, link }, index) => (
            <div
              key={`photo-${index}-${hoverText}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={clsx(
                'group relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-[10px] bg-zinc-100 sm:w-72 dark:bg-zinc-800',
                rotations[index % rotations.length],
              )}
              style={{ 
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={image}
                  alt={hoverText}
                  sizes="(min-width: 640px) 18rem, 11rem"
                  className={clsx(
                    'absolute inset-0 h-full w-full object-cover transition-all duration-300',
                    hoveredIndex === index && 'blur-sm',
                  )}
                  loading="lazy"
                  quality={75}
                  placeholder="blur"
                />
                <div
                  className={clsx(
                    'absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity duration-300',
                    hoveredIndex === index && 'opacity-100',
                  )}
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex cursor-pointer items-center text-lg font-semibold hover:underline"
                  >
                    {hoverText}
                    <svg
                      viewBox="0 0 24 24"
                      className="ml-1 inline-block h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M5 5v14h14v-7h2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7v2H5zm9 0V3h7v7h-2V6.41l-7.29 7.3-1.42-1.42L17.59 5H14z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
