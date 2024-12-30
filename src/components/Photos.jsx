'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import image1 from '@/images/photos/image-1.jpg'
import image2 from '@/images/photos/image-2.jpg'
import image3 from '@/images/photos/image-3.jpg'
import image4 from '@/images/photos/image-4.jpg'
import image5 from '@/images/photos/image-5.jpg'

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
      image: image1,
      hoverText: 'Kauai, HI',
      link: 'https://unsplash.com/photos/high-angle-photo-of-mountain-bjIi891Jfiw',
    },
    {
      image: image2,
      hoverText: 'Mountain vista',
      link: 'https://example.com/mountain',
    },
    {
      image: image3,
      hoverText: 'City lights',
      link: 'https://example.com/city',
    },
    {
      image: image4,
      hoverText: 'Forest trail',
      link: 'https://example.com/forest',
    },
    {
      image: image5,
      hoverText: 'Ocean waves',
      link: 'https://example.com/ocean',
    },
  ]

  const scrollRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    // Wait for all animations to complete (4.8s for last animation + 1.2s duration + 1s buffer)
    const animationTimer = setTimeout(() => {
      setIsAnimating(false)
    }, 7000)

    return () => clearTimeout(animationTimer)
  }, [])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || isAnimating) return

    const scroll = () => {
      const currentScroll = scrollContainer.scrollLeft
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth

      if (currentScroll >= maxScroll - 2) {
        // When near the end, quickly reset to start
        scrollContainer.scrollLeft = 0
      } else {
        scrollContainer.scrollLeft += 1
      }
    }

    // Always keep scrolling, regardless of hover state
    const intervalId = setInterval(scroll, 50)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isAnimating])

  const getPhotoAnimation = (index) => {
    if (index < 5) {
      return `animate-slide-up-${index + 1}`
    }
    return 'animate-fade-in-delayed'
  }

  return (
    <div className="mt-16 sm:mt-20">
      <div
        ref={scrollRef}
        className="scrollbar-hide relative -my-4 flex gap-5 overflow-x-auto scroll-smooth py-4 sm:gap-8"
      >
        {[...photos, ...photos, ...photos.slice(0, 3)].map(
          ({ image, hoverText, link }, index) => (
            <div
              key={`${index}-${hoverText}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={clsx(
                'group relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-[10px] bg-zinc-100 sm:w-72 dark:bg-zinc-800',
                rotations[index % rotations.length],
                'opacity-0',
                getPhotoAnimation(index % photos.length)
              )}
            >
              <Image
                src={image}
                alt={hoverText}
                width={288}
                height={320}
                className={clsx(
                  'h-full w-full object-cover',
                  hoveredIndex === index && 'blur-sm',
                )}
                priority={index < 5}
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
