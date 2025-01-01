
'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Container } from '@/components/Container'
import { useOpenPanel } from '@openpanel/nextjs'

// Move photos array and other constants outside component
const photos = [
  // ... existing photos array
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

export function Photos() {
  const scrollRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [photoStats, setPhotoStats] = useState({})
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [visiblePhotos, setVisiblePhotos] = useState(new Set())
  const [showTooltip, setShowTooltip] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const op = useOpenPanel() // Move hook to top level

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    const updateVisiblePhotos = () => {
      if (!scrollRef.current) return
      const containerWidth = scrollRef.current.clientWidth
      const photoWidth = window.innerWidth >= 640 ? 320 : 240
      const visibleCount = Math.ceil(containerWidth / photoWidth)
      const newVisiblePhotos = new Set(photos.slice(0, visibleCount).map(p => p.photoId))
      setVisiblePhotos(newVisiblePhotos)
    }

    updateVisiblePhotos()
    window.addEventListener('resize', updateVisiblePhotos)
    return () => window.removeEventListener('resize', updateVisiblePhotos)
  }, [])

  const handleImageLoad = useCallback((photoId) => {
    setLoadedImages(prev => new Set([...prev, photoId]))
  }, [])

  const fetchPhotoStatsIfNeeded = useCallback((photoId) => {
    if (!photoStats[photoId]) {
      fetch(`/api/photos/${photoId}/metadata`)
        .then(response => response.json())
        .then(stats => {
          if (stats) {
            setPhotoStats(prev => ({
              ...prev,
              [photoId]: stats
            }))
          }
        })
        .catch(error => console.error('Error fetching photo stats:', error))
    }
  }, [photoStats])

  const handlePhotoClick = useCallback((index) => {
    setHasInteracted(true)
    setShowTooltip(false)
    if (isTouchDevice) {
      if (selectedIndex === index) {
        window.open(photos[index].link, '_blank')
        setSelectedIndex(null)
      } else {
        setSelectedIndex(index)
        fetchPhotoStatsIfNeeded(photos[index].photoId)
        op.track('photo_stats_view', {
          photo: photos[index].hoverText,
          photoId: photos[index].photoId,
          interaction: 'tap'
        })
      }
    } else {
      window.open(photos[index].link, '_blank')
    }
  }, [isTouchDevice, selectedIndex, fetchPhotoStatsIfNeeded, op])

  const handlePhotoHover = useCallback((index) => {
    if (!isTouchDevice) {
      setHasInteracted(true)
      setShowTooltip(false)
      setHoveredIndex(index)
      fetchPhotoStatsIfNeeded(photos[index].photoId)
      op.track('photo_stats_view', {
        photo: photos[index].hoverText,
        photoId: photos[index].photoId,
        interaction: 'hover'
      })
    }
  }, [isTouchDevice, fetchPhotoStatsIfNeeded, op])

  // Rest of your component remains the same
  return (
    // ... existing JSX
  )
}
