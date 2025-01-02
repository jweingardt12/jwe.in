'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useOpenPanel } from '@openpanel/nextjs'
import { Container } from '@/components/Container'
import Link from 'next/link'
import { UnsplashIcon } from '@/components/SocialIcons'

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

function PhotoMetadata({ photo }) {
  const op = useOpenPanel()

  const handleLinkClick = () => {
    op.track('unsplash_link_click', {
      title: photo.hoverText,
      link: photo.link
    })
  }

  return (
    <Link
      href={photo.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleLinkClick}
      className="absolute bottom-2 left-2 hidden rounded-lg bg-white/10 px-2 py-1 text-xs font-medium text-white backdrop-blur sm:flex items-center gap-1 hover:bg-white/20 transition-colors"
    >
      <UnsplashIcon className="h-3 w-3" />
      <span>Unsplash</span>
    </Link>
  )
}

function Photo({ photo, index, onHover }) {
  const op = useOpenPanel()
  const hoverStartTime = useRef(null)

  const handleMouseEnter = () => {
    hoverStartTime.current = Date.now()
    onHover(index)
  }

  const handleMouseLeave = () => {
    if (hoverStartTime.current) {
      const hoverDuration = Date.now() - hoverStartTime.current
      op.track('photo_hover', {
        title: photo.hoverText,
        hover_duration_ms: hoverDuration
      })
      hoverStartTime.current = null
    }
  }

  return (
    <div 
      className="relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={photo.image}
        alt=""
        sizes="(min-width: 640px) 18rem, 11rem"
        className="absolute inset-0 h-full w-full object-cover"
        priority
      />
      <div className="absolute inset-0 z-10">
        <PhotoMetadata photo={photo} />
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