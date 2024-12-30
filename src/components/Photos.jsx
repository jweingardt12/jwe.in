'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

async function fetchPhotoStats(photoId) {
  try {
    const [statsResponse, photoResponse] = await Promise.all([
      fetch(`https://api.unsplash.com/photos/${photoId}/statistics?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`),
      fetch(`https://api.unsplash.com/photos/${photoId}?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`)
    ])
    
    const stats = await statsResponse.json()
    const photo = await photoResponse.json()
    
    return {
      views: stats.views.total.toLocaleString(),
      downloads: stats.downloads.total.toLocaleString(),
      camera: photo.exif.model || 'Unknown',
      aperture: photo.exif.aperture ? `ƒ/${photo.exif.aperture}` : null,
      focalLength: photo.exif.focal_length ? `${photo.exif.focal_length}mm` : null,
      iso: photo.exif.iso ? `ISO ${photo.exif.iso}` : null
    }
  } catch (error) {
    console.error('Error fetching photo stats:', error)
    return null
  }
}

export function Photos() {
  const rotations = [
    'rotate-3',
    '-rotate-4',
    'rotate-2',
    'rotate-2',
    '-rotate-2',
    'rotate-3',
    '-rotate-2',
  ]
  
  const photos = [
    {
      image: require('@/images/photos/image-1.jpg'),
      hoverText: 'Kauai, HI',
      link: 'https://unsplash.com/photos/a-beach-with-palm-trees-and-mountains-in-the-background-bjIi891Jfiw',
      photoId: 'bjIi891Jfiw'
    },
    {
      image: require('@/images/photos/image-2.jpg'),
      hoverText: 'Wrigley Field, Chicago',
      link: 'https://unsplash.com/photos/a-baseball-stadium-with-lights-on-at-night-Sj_3Jdr19L4',
      photoId: 'Sj_3Jdr19L4'
    },
    {
      image: require('@/images/photos/image-3.jpg'),
      hoverText: 'Boston, MA',
      link: 'https://unsplash.com/photos/a-city-street-with-tall-buildings-and-cars-QGr5riXVRYI',
      photoId: 'QGr5riXVRYI'
    },
    {
      image: require('@/images/photos/image-4.jpg'),
      hoverText: 'Hawaii',
      link: 'https://unsplash.com/photos/a-sunset-over-the-ocean-with-palm-trees-in-the-foreground-3dqnz_7u1XQ',
      photoId: '3dqnz_7u1XQ'
    },
    {
      image: require('@/images/photos/image-5.jpg'),
      hoverText: 'Washington, D.C.',
      link: 'https://unsplash.com/photos/the-washington-monument-at-sunset-_WR6tUIAJe8',
      photoId: '_WR6tUIAJe8'
    },
    {
      image: require('@/images/photos/image-6.jpg'),
      hoverText: 'New York City',
      link: 'https://unsplash.com/photos/a-city-street-at-night-with-tall-buildings-and-lights-7H77FWkK_x4',
      photoId: '7H77FWkK_x4'
    },
    {
      image: require('@/images/photos/image-7.jpg'),
      hoverText: 'Asheville, NC',
      link: 'https://unsplash.com/photos/a-person-holding-a-sparkler-in-their-hand-ljqQqJ1PDdU',
      photoId: 'ljqQqJ1PDdU'
    }
  ]

  const scrollRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [photoStats, setPhotoStats] = useState({})

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scroll = () => {
      const currentScroll = scrollContainer.scrollLeft
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth

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

  useEffect(() => {
    if (hoveredIndex !== null) {
      const photo = [...photos, ...photos.slice(0, 3)][hoveredIndex]
      if (!photoStats[photo.photoId]) {
        fetchPhotoStats(photo.photoId).then(stats => {
          if (stats) {
            setPhotoStats(prev => ({
              ...prev,
              [photo.photoId]: stats
            }))
          }
        })
      }
    }
  }, [hoveredIndex])

  return (
    <div className="mt-16 sm:mt-20">
      <div
        ref={scrollRef}
        className="scrollbar-hide relative -my-4 flex gap-5 overflow-x-auto scroll-smooth py-4 sm:gap-8 will-change-transform"
      >
        {[...photos, ...photos.slice(0, 3)].map(
          ({ image, hoverText, link, photoId }, index) => (
            <div
              key={`photo-${index}-${hoverText}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={clsx(
                'group relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-[10px] bg-zinc-100 sm:w-72 dark:bg-zinc-800',
                rotations[index % rotations.length],
              )}
              style={{ 
                transition: 'transform 0.3s ease-in-out',
                willChange: 'transform'
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
                    'absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-300 p-4',
                    hoveredIndex === index && 'opacity-100',
                  )}
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex cursor-pointer items-center text-lg font-semibold hover:underline mb-4"
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
                  {photoStats[photoId] && (
                    <div className="text-sm space-y-1 text-center">
                      <div className="flex justify-center space-x-4 mb-2">
                        <div>Views: {photoStats[photoId].views}</div>
                        <div>Downloads: {photoStats[photoId].downloads}</div>
                      </div>
                      {photoStats[photoId].camera && (
                        <div>Camera: {photoStats[photoId].camera}</div>
                      )}
                      <div className="flex justify-center space-x-4">
                        {photoStats[photoId].aperture && (
                          <div>{photoStats[photoId].aperture}</div>
                        )}
                        {photoStats[photoId].focalLength && (
                          <div>{photoStats[photoId].focalLength}</div>
                        )}
                        {photoStats[photoId].iso && (
                          <div>{photoStats[photoId].iso}</div>
                        )}
                      </div>
                    </div>
                  )}
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