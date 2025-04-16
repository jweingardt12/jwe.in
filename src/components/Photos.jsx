'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Container } from './Container'

// Rotation classes for the photos
const rotations = [
  'rotate-3',
  '-rotate-4',
  'rotate-2',
  'rotate-2',
  '-rotate-2',
  'rotate-3',
  '-rotate-2',
]

// Simple placeholder photos for loading state
const placeholderPhotos = Array(5).fill(null).map((_, i) => ({
  id: `placeholder-${i}`,
  photoId: `placeholder-${i}`,
  image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==',
  hoverText: 'Loading...',
  link: '#'
}))

/**
 * Gets photos for the gallery
 * @returns {Promise<Array>} - Array of photo objects
 */
async function getPhotos() {
  try {
    console.log('Creating photo objects')
    
    // Create an array of photo data with locations
    const photoData = [
      { id: '1', location: 'Kauai, HI' },
      { id: '2', location: 'Chicago, IL' },
      { id: '3', location: 'Boston, MA' },
      { id: '4', location: 'Washington, D.C.' },
      { id: '5', location: 'Kauai, HI' },
      { id: '6', location: 'New York City' },
      { id: '7', location: 'Asheville, NC' },
      { id: '8', location: 'Toronto, ON' },
      { id: '9', location: 'Kauai, HI' }
    ];
    
    // Import the images directly
    const imageModules = {
      '1': '/images/photos/image-1.jpg',
      '2': '/images/photos/image-2.jpg',
      '3': '/images/photos/image-3.jpg',
      '4': '/images/photos/image-4.jpg',
      '5': '/images/photos/image-5.jpg',
      '6': '/images/photos/image-6.jpg',
      '7': '/images/photos/image-7.jpg',
      '8': '/images/photos/image-8.jpg',
      '9': '/images/photos/image-9.jpg'
    };
    
    // Create photo objects with the imported images
    const photos = photoData.map(({ id, location }) => ({
      id,
      photoId: id,
      image: imageModules[id],
      width: 800,
      height: 600,
      hoverText: location,
      link: `#photo-${id}`,
      description: `Photo by Jason Weingardt`
    }));
    
    console.log(`Created ${photos.length} photo objects`);
    return photos;
    
  } catch (error) {
    console.error('Error creating photo objects:', error);
    return [];
  }
}

/**
 * Fetches statistics for a photo from the Unsplash API
 * @param {string} photoId - Unsplash photo ID
 * @returns {Promise<Object>} - Photo statistics
 */
async function fetchPhotoStats(photoId) {
  try {
    // Use the Unsplash API to get photo statistics
    // Note: This requires an Unsplash API access key in your environment variables
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      console.warn('Unsplash API key not found, using fallback data');
      return getFallbackPhotoStats(photoId);
    }
    
    // First, get the photo details to get location and camera info
    const photoResponse = await fetch(`https://api.unsplash.com/photos/${photoId}?client_id=${accessKey}`);
    
    if (!photoResponse.ok) {
      throw new Error(`Failed to fetch photo details: ${photoResponse.status}`);
    }
    
    const photoData = await photoResponse.json();
    
    // Then, get the photo statistics
    const statsResponse = await fetch(`https://api.unsplash.com/photos/${photoId}/statistics?client_id=${accessKey}`);
    
    if (!statsResponse.ok) {
      throw new Error(`Failed to fetch photo statistics: ${statsResponse.status}`);
    }
    
    const statsData = await statsResponse.json();
    
    // Extract location from photo data
    let location = 'Unsplash Photo';
    if (photoData.location && photoData.location.name) {
      location = photoData.location.name;
    } else if (photoData.location && photoData.location.city && photoData.location.country) {
      location = `${photoData.location.city}, ${photoData.location.country}`;
    } else if (photoData.location && photoData.location.city) {
      location = photoData.location.city;
    } else if (photoData.location && photoData.location.country) {
      location = photoData.location.country;
    }
    
    // Extract camera info from exif data
    let camera = 'Unknown';
    let aperture = null;
    let focalLength = null;
    let iso = null;
    
    if (photoData.exif) {
      camera = photoData.exif.make && photoData.exif.model ? `${photoData.exif.make} ${photoData.exif.model}` : camera;
      aperture = photoData.exif.aperture || aperture;
      focalLength = photoData.exif.focal_length || focalLength;
      iso = photoData.exif.iso || iso;
    }
    
    // Return formatted photo stats
    return {
      views: statsData.views.total,
      downloads: statsData.downloads.total,
      likes: photoData.likes,
      location,
      camera,
      aperture,
      focalLength,
      iso,
      created_at: photoData.created_at
    };
  } catch (error) {
    console.error('Error fetching photo stats from Unsplash:', error);
    // If the API call fails, fall back to deterministic generated data
    return getFallbackPhotoStats(photoId);
  }
}

/**
 * Generates fallback statistics for a photo when the Unsplash API is unavailable
 * @param {string} photoId - Unsplash photo ID
 * @returns {Object} - Fallback photo statistics
 */
function getFallbackPhotoStats(photoId) {
  // Generate deterministic but seemingly random stats based on the photo ID
  const idSum = photoId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const views = 1000 + (idSum % 9000); // Between 1,000 and 10,000
  const downloads = 100 + (idSum % 900); // Between 100 and 1,000
  const likes = 50 + (idSum % 450); // Between 50 and 500
  
  // Get location from our photo data mapping
  let location = 'Unsplash Photo';
  if (photoId.includes('1')) {
    location = 'Kauai, HI';
  } else if (photoId.includes('2')) {
    location = 'Chicago, IL';
  } else if (photoId.includes('3')) {
    location = 'Boston, MA';
  } else if (photoId.includes('4')) {
    location = 'Washington, D.C.';
  } else if (photoId.includes('6')) {
    location = 'New York City';
  } else if (photoId.includes('7')) {
    location = 'Asheville, NC';
  } else if (photoId.includes('8')) {
    location = 'Toronto, ON';
  } else if (photoId.includes('9')) {
    location = 'Kauai, HI';
  }
  
  // Generate a random date within the last 3 years
  const now = new Date();
  const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
  const randomTimestamp = threeYearsAgo.getTime() + Math.random() * (now.getTime() - threeYearsAgo.getTime());
  const created_at = new Date(randomTimestamp).toISOString();
  
  // Return fallback photo stats
  return {
    views,
    downloads,
    likes,
    location,
    camera: 'Sony α7 III',
    aperture: 'f/2.8',
    focalLength: '24mm',
    iso: '100',
    created_at
  };
}

function PhotoMetadata({ metadata, visible, title, link }) {
  const handleLinkClick = (e) => {
    e.stopPropagation()
    // Track the click before opening the link
    window.umami?.track('external_link_click', {
      domain: 'unsplash.com',
      type: 'photo',
      photoId: link.split('/').pop()
    })
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  if (!visible) return null
  
  return (
    <div className="absolute inset-0 p-4 text-white animate-[fadeIn_0.15s_ease-out_0.05s] opacity-0 [animation-fill-mode:forwards]">
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
        'group relative aspect-[9/10] w-56 flex-none rounded-2xl',
        'border border-zinc-400/50 dark:border-zinc-200/50',
        rotations[index % rotations.length],
        'transition-opacity duration-1000',
        'shadow-[0_8px_28px_-6px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.5)]',
        isVisible && isLoaded ? 'opacity-100' : 'opacity-0',
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
      <div className="relative h-full w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden">
        {index === 0 && showTouchIndicator && <TouchIndicator />}
        <Image
          src={photo.image}
          alt={photo.hoverText}
          fill
          sizes="(min-width: 640px) 224px, 224px"
          quality={95}
          className={clsx(
            'absolute inset-0 h-full w-full object-cover transition-[filter,brightness] duration-300',
            'will-change-[filter,transform]',
            (isHovered || isSelected) && 'blur-[3px] brightness-[0.85]'
          )}
          priority={index <= 2}
          onLoad={() => setIsLoaded(true)}
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
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

function Photos() {
  const scrollRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [photoStats, setPhotoStats] = useState({})
  const [showTouchIndicator, setShowTouchIndicator] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [photos, setPhotos] = useState([]) // Start with empty array
  const [isLoading, setIsLoading] = useState(true) // Start in loading state
  const animationRef = useRef(null)

  const handleHover = (index) => {
    if (!hasInteracted) {
      setHasInteracted(true)
    }
    setHoveredIndex(index)
    
    if (index !== null && photos.length > 0) {
      const photo = [...photos, ...photos][index % (photos.length * 2)]
      // Track analytics event if needed
      window.umami?.track('photo_hover', {
        photo_id: photo.photoId,
        location: photo.hoverText,
        index: index
      })
    }
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



  // Load photos when component mounts
  useEffect(() => {
    let isMounted = true;
    
    // Use requestIdleCallback to load photos during browser idle time
    // This prevents the photos from blocking the main thread during initial page load
    const loadPhotosWhenIdle = () => {
      const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
      idleCallback(async () => {
        await loadPhotos();
      });
    };
    
    async function loadPhotos() {
      if (!isMounted) return;
      
      try {
        setIsLoading(true);
        console.log('Loading photos...');
        
        // Get photos using our local images approach
        const galleryPhotos = await getPhotos();
        
        if (!isMounted) return;
        
        if (galleryPhotos && galleryPhotos.length > 0) {
          console.log('Successfully loaded photos:', galleryPhotos.length);
          
          // Set photos with a slight delay to prevent layout shifts
          // This allows the rest of the page to load first
          setTimeout(() => {
            if (isMounted) {
              setPhotos(galleryPhotos);
              setIsLoading(false);
            }
          }, 100);
          return; // Exit early since we're handling loading state in setTimeout
        } else {
          console.warn('No photos returned');
          // Show placeholder photos if no results
          setPhotos(placeholderPhotos);
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Failed to load photos:', error);
        // Use placeholder photos on error
        setPhotos(placeholderPhotos);
      } finally {
        if (isMounted && photos.length === 0) { // Only set loading false if we didn't enter the setTimeout branch
          setIsLoading(false);
        }
      }
    }
    
    // Start loading photos during browser idle time
    loadPhotosWhenIdle();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [photos.length]) // Add photos.length to dependency array

  useEffect(() => {
    if ((hoveredIndex !== null || selectedIndex !== null) && photos.length > 0) {
      const index = hoveredIndex ?? selectedIndex
      const photo = [...photos, ...photos][index % (photos.length * 2)]
      getPhotoStats(photo)
    }
  }, [hoveredIndex, selectedIndex, getPhotoStats, photos])

  // Use a ref for the timestamp to persist between renders
  const lastTimestampRef = useRef(0)
  
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || photos.length === 0) return

    const scrollSpeed = 0.05 // Adjust speed as needed

    const animateScroll = (timestamp) => {
      if (!scrollContainer) return
      
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp
      const elapsed = timestamp - lastTimestampRef.current
      
      const currentScroll = scrollContainer.scrollLeft
      const photoWidth = scrollContainer.firstChild?.offsetWidth || 0
      const gapWidth = 24 // 6 in gap-6 equals 24px
      const photoWithGapWidth = photoWidth + gapWidth
      const totalOriginalWidth = photos.length * photoWithGapWidth
      
      const scrollAmount = elapsed * scrollSpeed
      
      // When we reach the point where we've scrolled past all original photos
      // Reset to the beginning to create a truly perpetual scroll
      if (currentScroll >= totalOriginalWidth - 10) { // Added small buffer for more reliable detection
        // Reset to the beginning to create a truly perpetual scroll
        scrollContainer.scrollLeft = 0
      } else {
        scrollContainer.scrollLeft += scrollAmount
      }
      
      lastTimestampRef.current = timestamp
      
      // Always continue the animation regardless of hover or selection state
      animationRef.current = requestAnimationFrame(animateScroll)
    }

    // Always start the animation when the component mounts
    animationRef.current = requestAnimationFrame(animateScroll)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [photos.length]) // Include photos.length in the dependency array

  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedIndex(null)
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

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
    <div className="w-full overflow-hidden relative">
      {isLoading ? (
        <div className="flex justify-center items-center py-20" aria-label="Loading photos...">
          <div className="animate-pulse flex space-x-4" style={{ opacity: 0.7 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-48 w-36 rounded-md" style={{ animationDelay: `${i * 100}ms` }}></div>
            ))}
          </div>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">No photos available</p>
        </div>
      ) : (
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto py-8 no-scrollbar w-full px-4 sm:px-8 md:px-16 lg:px-24 justify-start md:justify-center mask-fade"
          style={{
            willChange: 'scroll-position',
            transform: 'translateZ(0)',
            WebkitOverflowScrolling: 'touch'
          }}
          data-component-name="Photos"
        >
          {photos.map((photo, index) => (
            <Photo
              key={`photo-${index}-${photo.photoId || index}`}
              photo={photo}
              index={index}
              onHover={handleHover}
              isHovered={hoveredIndex === index}
              isSelected={selectedIndex === index}
              onSelect={handleSelect}
              photoStats={photoStats}
              onFetchStats={getPhotoStats}
              showTouchIndicator={showTouchIndicator && index === 0}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => handleHover(null)}
              priority={index < 3} // Only prioritize the first few visible photos
              loading={index < 5 ? 'eager' : 'lazy'} // Load first 5 eagerly, rest lazily
            />
          ))}
          {/* Add duplicate photos for infinite scrolling - 3 sets for more reliable looping */}
          {photos.map((photo, index) => (
            <Photo
              key={`photo-dup-1-${index}-${photo.photoId || index}`}
              photo={photo}
              index={index + photos.length}
              onHover={handleHover}
              isHovered={hoveredIndex === (index + photos.length)}
              isSelected={selectedIndex === (index + photos.length)}
              onSelect={handleSelect}
              photoStats={photoStats}
              onFetchStats={getPhotoStats}
              showTouchIndicator={false}
              onMouseEnter={() => handleHover(index + photos.length)}
              onMouseLeave={() => handleHover(null)}
              priority={false} // Don't prioritize duplicate photos
              loading='lazy' // Always lazy load duplicates
            />
          ))}
          {/* Add a third set of photos for even more reliable infinite scrolling */}
          {photos.map((photo, index) => (
            <Photo
              key={`photo-dup-2-${index}-${photo.photoId || index}`}
              photo={photo}
              index={index + (photos.length * 2)}
              onHover={handleHover}
              isHovered={hoveredIndex === (index + (photos.length * 2))}
              isSelected={selectedIndex === (index + (photos.length * 2))}
              onSelect={handleSelect}
              photoStats={photoStats}
              onFetchStats={getPhotoStats}
              showTouchIndicator={false}
              onMouseEnter={() => handleHover(index + (photos.length * 2))}
              onMouseLeave={() => handleHover(null)}
              priority={false} // Don't prioritize duplicate photos
              loading='lazy' // Always lazy load duplicates
            />
          ))}
        </div>
      )}
      <style jsx>{`
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .mask-fade {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
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

export { Photos, Photo, fetchPhotoStats }
