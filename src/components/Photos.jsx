'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Container } from '@/components/Container'

// Import images statically
import image1 from '@/images/photos/image-1.jpg'
import image2 from '@/images/photos/image-2.jpg'
import image3 from '@/images/photos/image-3.jpg'
import image4 from '@/images/photos/image-4.jpg'
import image5 from '@/images/photos/image-5.jpg'
import image6 from '@/images/photos/image-6.jpg'
import image7 from '@/images/photos/image-7.jpg'
import image8 from '@/images/photos/image-8.jpg'
import image9 from '@/images/photos/image-9.jpg'

const photos = [
  {
    image: image1,
    hoverText: 'Kauai, HI',
    link: 'https://unsplash.com/photos/green-mountain-during-daytime-fFDyu46W_OA',
    photoId: 'fFDyu46W_OA'
  },
  {
    image: image2,
    hoverText: 'Chicago, IL',
    link: 'https://unsplash.com/photos/black-and-white-american-printed-wall-with-flag-of-america-36XU1kKUExI',
    photoId: '36XU1kKUExI'
  },
  {
    image: image3,
    hoverText: 'Boston, MA',
    link: 'https://unsplash.com/photos/reflection-on-brown-building-on-glass-building-uiVj0r8Tt5Q',
    photoId: 'uiVj0r8Tt5Q'
  },
  {
    image: image4,
    hoverText: 'Washington, D.C.',
    link: 'https://unsplash.com/photos/tilt-shift-photography-of-sakura-tree-QodGaSHzbzo',
    photoId: 'QodGaSHzbzo'
  },
  {
    image: image5,
    hoverText: 'Kauai, HI',
    link: 'https://unsplash.com/photos/green-tree-bQuVWeyuYB4',
    photoId: 'bQuVWeyuYB4'
  },
  {
    image: image6,
    hoverText: 'New York City',
    link: 'https://unsplash.com/photos/building-lot-during-daytime-mhAAFrStCkw',
    photoId: 'mhAAFrStCkw'
  },
  {
    image: image7,
    hoverText: 'Asheville, NC',
    link: 'https://unsplash.com/photos/a-person-holding-a-sparkler-in-their-hand-ljqQqJ1PDdU',
    photoId: 'ljqQqJ1PDdU'
  },
  {
    image: image8,
    hoverText: 'Toronto, ON',
    link: 'https://unsplash.com/photos/black-propeller-bdy2Hm9j0HI',
    photoId: 'bdy2Hm9j0HI'
  },
  {
    image: image9,
    hoverText: 'Kauai, HI',
    link: 'https://unsplash.com/photos/emhDmEgbi8s',
    photoId: 'emhDmEgbi8s'
  }
]

const rotations = [
  'rotate-3',
  '-rotate-4',
  'rotate-2',
  'rotate-2',
  '-rotate-2',
  'rotate-3',
  '-rotate-2',
]

async function fetchPhotoStats(photoId) {
  if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
    console.error('Missing Unsplash access key')
    return null
  }

  try {
    const [statsResponse, photoResponse] = await Promise.all([
      fetch(`https://api.unsplash.com/photos/${photoId}/statistics?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`),
      fetch(`https://api.unsplash.com/photos/${photoId}?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`)
    ])
    
    if (!statsResponse.ok || !photoResponse.ok) {
      throw new Error('Failed to fetch photo data')
    }
    
    const stats = await statsResponse.json()
    const photo = await photoResponse.json()
    
    // Extract EXIF data
    const exif = photo.exif || {}
    
    return {
      views: stats.views?.total || 0,
      downloads: stats.downloads?.total || 0,
      camera: exif.model || exif.name || 'Unknown',
      aperture: exif.aperture || null,
      focalLength: exif.focal_length || null,
      iso: exif.iso || null
    }
  } catch (error) {
    console.error('Error fetching photo stats:', error)
    return null
  }
}

function PhotoMetadata({ metadata, visible, title, link }) {
  if (!visible || !metadata) return null
  
  return (
    <div className="absolute inset-0 p-4 text-white flex items-center justify-center">
      <div className="flex flex-col w-full">
        <div className="flex items-start justify-between mb-3">
          <div className="text-base md:text-lg font-medium">{title}</div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="currentColor"
            >
              <path d="M5 5v14h14v-7h2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7v2H5z M14 3h7v7h-2V6.41l-7.29 7.3-1.42-1.42L17.59 5H14z" />
            </svg>
          </a>
        </div>

        {/* Stats only shown on desktop */}
        <div className="hidden md:flex flex-col space-y-1 text-xs md:text-sm">
          <div className="grid grid-cols-[5rem_1fr] gap-x-1">
            <span className="text-right">Views:</span>
            <span>{metadata.views?.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-[5rem_1fr] gap-x-1">
            <span className="text-right">Downloads:</span>
            <span>{metadata.downloads?.toLocaleString()}</span>
          </div>
          
          <div className="space-y-1 mt-2 pt-2 border-t border-white/20">
            {metadata.camera && (
              <div className="grid grid-cols-[5rem_1fr] gap-x-1">
                <span className="text-right">Camera:</span>
                <span>{metadata.camera}</span>
              </div>
            )}
            {metadata.aperture && (
              <div className="grid grid-cols-[5rem_1fr] gap-x-1">
                <span className="text-right">Aperture:</span>
                <span>ƒ/{metadata.aperture}</span>
              </div>
            )}
            {metadata.iso && (
              <div className="grid grid-cols-[5rem_1fr] gap-x-1">
                <span className="text-right">ISO:</span>
                <span>{metadata.iso}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Photo({ photo, className }) {
  const [isHovered, setIsHovered] = useState(false)
  const [metadata, setMetadata] = useState(null)

  const fetchMetadata = useCallback(async () => {
    if (!photoStats[photo.photoId]) {
      const stats = await fetchPhotoStats(photo.photoId)
      if (stats) {
        setPhotoStats(prev => ({
          ...prev,
          [photo.photoId]: stats
        }))
      }
    }
  }, [photo.photoId])

  return (
    <div 
      className={`group relative ${className}`}
      onMouseEnter={() => {
        setIsHovered(true)
        fetchMetadata()
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full w-full">
        <Image
          src={photo.image}
          alt={photo.hoverText}
          sizes="(min-width: 640px) 18rem, 11rem"
          className={clsx(
            'absolute inset-0 h-full w-full object-cover transition duration-300',
            isHovered && 'blur-[2px]'
          )}
          priority
        />
        <div 
          className={clsx(
            'absolute inset-0 bg-black/75 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />
        <PhotoMetadata 
          metadata={photoStats[photo.photoId]} 
          visible={isHovered} 
          title={photo.hoverText} 
          link={photo.link} 
        />
      </div>
    </div>
  )
}

export function Photos() {
  const scrollRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [photoStats, setPhotoStats] = useState({})

  const getPhotoStats = useCallback(async (photo) => {
    if (!photoStats[photo.photoId]) {
      const stats = await fetchPhotoStats(photo.photoId)
      if (stats) {
        setPhotoStats(prev => ({
          ...prev,
          [photo.photoId]: stats
        }))
      }
    }
  }, [photoStats])

  useEffect(() => {
    if (hoveredIndex !== null || selectedIndex !== null) {
      const photo = [...photos, ...photos.slice(0, 3)][hoveredIndex ?? selectedIndex]
      getPhotoStats(photo)
    }
  }, [hoveredIndex, selectedIndex, getPhotoStats])

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
    if (hoveredIndex === null && selectedIndex === null) {
      intervalId = setInterval(scroll, 50)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [hoveredIndex, selectedIndex])

  const handleImageClick = (e, index, link) => {
    e.preventDefault()
    if (selectedIndex === index) {
      // If already selected, open the link
      window.open(link, '_blank', 'noopener,noreferrer')
      setSelectedIndex(null)
    } else {
      // First tap, just select the image
      setSelectedIndex(index)
    }
  }

  // Clear selection when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedIndex(null)
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="mt-16 sm:mt-20">
      <div
        ref={scrollRef}
        className="scrollbar-hide relative -my-4 flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth py-8 px-4 will-change-transform"
      >
        {[...photos, ...photos.slice(0, 3)].map(
          ({ image, hoverText, link, photoId }, index) => (
            <div
              key={`photo-${index}-${hoverText}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                'group relative aspect-[9/10] w-36 sm:w-44 md:w-72 flex-none overflow-hidden rounded-[10px] bg-zinc-100 dark:bg-zinc-800',
                'shadow-lg dark:shadow-zinc-900/50',
                'ring-1 ring-zinc-400/20 dark:ring-zinc-300/20',
                rotations[index % rotations.length],
              )}
              style={{ 
                transition: 'transform 0.3s ease-in-out',
                willChange: 'transform'
              }}
            >
              <a
                href={link}
                onClick={(e) => handleImageClick(e, index, link)}
                className="block h-full w-full"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={image}
                    alt={hoverText}
                    sizes="(min-width: 768px) 18rem, (min-width: 640px) 11rem, 7rem"
                    className={clsx(
                      'absolute inset-0 h-full w-full object-cover transition-all duration-300',
                      (hoveredIndex === index || selectedIndex === index) && 'blur-[1px] brightness-[0.25]'
                    )}
                    loading="lazy"
                    quality={75}
                  />
                  <div
                    className={clsx(
                      'absolute inset-0 bg-black/20 transition-opacity duration-300',
                      (hoveredIndex === index || selectedIndex === index) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <PhotoMetadata 
                    metadata={photoStats[photoId]} 
                    visible={hoveredIndex === index || selectedIndex === index} 
                    title={hoverText} 
                    link={link} 
                  />
                </div>
              </a>
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