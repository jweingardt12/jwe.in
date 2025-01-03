'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Container } from './Container'

// Import images statically
import image1 from '../images/photos/image-1.jpg'
import image2 from '../images/photos/image-2.jpg'
import image3 from '../images/photos/image-3.jpg'
import image4 from '../images/photos/image-4.jpg'
import image5 from '../images/photos/image-5.jpg'
import image6 from '../images/photos/image-6.jpg'
import image7 from '../images/photos/image-7.jpg'
import image8 from '../images/photos/image-8.jpg'
import image9 from '../images/photos/image-9.jpg'

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
  const handleLinkClick = (e) => {
    e.stopPropagation()
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  if (!visible) return null
  
  return (
    <div className="absolute inset-0 p-4 text-white animate-[fadeIn_0.2s_ease-out_0.3s] opacity-0 [animation-fill-mode:forwards]">
      <div className="flex flex-col w-full">
        <div className="flex items-start justify-between mb-2">
          <div className="text-xl font-medium">{title}</div>
          <button
            onClick={handleLinkClick}
            className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M5 5v14h14v-7h2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7v2H5z M14 3h7v7h-2V6.41l-7.29 7.3-1.42-1.42L17.59 5H14z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Views</span>
            <span>{metadata?.views?.toLocaleString() || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span>Downloads</span>
            <span>{metadata?.downloads?.toLocaleString() || '—'}</span>
          </div>
          
          <div className="space-y-2 mt-2 pt-2 border-t border-white/20">
            <div className="flex justify-between">
              <span>Camera</span>
              <span className="truncate ml-2">{metadata?.camera || '—'}</span>
            </div>
            {metadata?.aperture && (
              <div className="flex justify-between">
                <span>Aperture</span>
                <span>ƒ/{metadata.aperture}</span>
              </div>
            )}
            {metadata?.iso && (
              <div className="flex justify-between">
                <span>ISO</span>
                <span>{metadata.iso}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TouchIndicator() {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 animate-[fadeIn_0.5s_ease-out]">
      <div className="relative">
        <div className="absolute h-6 w-6 rounded-full bg-zinc-800/20 animate-[ripple_2s_ease-out_infinite]" />
        <div className="h-6 w-6 rounded-full bg-zinc-800/50 animate-[press_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}

function Photo({ 
  photo, 
  className, 
  index, 
  isHovered, 
  isSelected, 
  onSelect, 
  photoStats, 
  onFetchStats, 
  showTouchIndicator,
  onMouseEnter,
  onMouseLeave 
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const photoRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const currentPhotoRef = photoRef.current
    if (currentPhotoRef) {
      observer.observe(currentPhotoRef)
    }

    return () => {
      if (currentPhotoRef) {
        observer.unobserve(currentPhotoRef)
      }
    }
  }, [])

  const handleClick = (e) => {
    e.preventDefault()
    
    if (!isSelected) {
      onSelect(index)
      onFetchStats(photo)
    }
  }

  return (
    <div 
      ref={photoRef}
      role="button"
      tabIndex={0}
      className={clsx(
        'relative aspect-[9/10] w-60 flex-none overflow-visible rounded-2xl bg-zinc-100 dark:bg-zinc-800',
        'shadow-[0_8px_28px_-6px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.5)]',
        'ring-1 ring-zinc-400/20 dark:ring-zinc-300/20',
        rotations[index % rotations.length],
        'transition-opacity duration-1000',
        isVisible && isLoaded ? 'opacity-100' : 'opacity-0',
        'cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-500',
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e)
        }
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        {index === 0 && showTouchIndicator && <TouchIndicator />}
        <Image
          src={photo.image}
          alt={photo.hoverText}
          sizes="(min-width: 640px) 240px, 240px"
          quality={95}
          className={clsx(
            'absolute inset-0 h-full w-full object-cover transition-[filter,brightness] duration-300',
            (isHovered || isSelected) && 'blur-[3px] brightness-[0.85]'
          )}
          priority={index <= 2}
          onLoad={() => setIsLoaded(true)}
        />
        <div 
          className={clsx(
            'absolute inset-0 bg-black/25 transition-opacity duration-300',
            (isHovered || isSelected) ? 'opacity-100' : 'opacity-0'
          )}
        />
        <PhotoMetadata 
          metadata={photoStats[photo.photoId]} 
          visible={isHovered || isSelected} 
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
  const [showTouchIndicator, setShowTouchIndicator] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleHover = (index) => {
    if (!hasInteracted) {
      setHasInteracted(true)
    }
    setHoveredIndex(index)
  }

  const handleSelect = (index) => {
    if (!hasInteracted) {
      setHasInteracted(true)
    }
    setSelectedIndex(index)
  }

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

  // Add timer to show touch indicator after 3 seconds if no interaction
  useEffect(() => {
    if (!hasInteracted && hoveredIndex === null && selectedIndex === null) {
      const timer = setTimeout(() => {
        setShowTouchIndicator(true)
      }, 3000)

      return () => clearTimeout(timer)
    } else {
      setShowTouchIndicator(false)
    }
  }, [hoveredIndex, selectedIndex, hasInteracted])

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex gap-5 overflow-x-auto py-12 px-4 sm:gap-8 no-scrollbar">
        {[...photos, ...photos.slice(0, 3)].map((photo, index) => (
          <Photo
            key={`photo-${index}-${photo.hoverText}`}
            photo={photo}
            index={index}
            onHover={handleHover}
            isHovered={hoveredIndex === index}
            isSelected={selectedIndex === index}
            onSelect={handleSelect}
            photoStats={photoStats}
            onFetchStats={getPhotoStats}
            showTouchIndicator={showTouchIndicator}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => handleHover(null)}
          />
        ))}
      </div>
      <style jsx>{`
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes press {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.85); }
        }
      `}</style>
    </div>
  )
}

export { Photo, fetchPhotoStats }
