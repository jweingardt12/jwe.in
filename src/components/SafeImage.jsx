'use client'

import { useState, useEffect } from 'react'

/**
 * SafeImage component with robust error handling and fallback
 * @param {Object} props Component props
 * @param {string} props.src Image source URL
 * @param {string} props.alt Alt text for the image
 * @param {string} props.className CSS classes for the image
 * @param {Function} props.onError Custom error handler (optional)
 * @param {string} props.fallbackSrc Fallback image source (optional)
 * @param {React.ReactNode} props.fallback Fallback component (optional)
 */
export function SafeImage({
  src,
  alt = '',
  className = '',
  onError,
  fallbackSrc = '',
  fallback = null,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src)
    setHasError(false)
    setIsLoading(true)
  }, [src])

  // Handle image load error
  const handleError = () => {
    console.error('Image failed to load:', src)
    
    // Try with a proxy if the image is from an external domain
    if (!hasError && src && !src.startsWith('/') && !src.startsWith('data:')) {
      // Use a CORS proxy for external images
      const proxiedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(src)}`
      setImgSrc(proxiedUrl)
      setHasError(true)
    } else if (fallbackSrc) {
      // Use fallback image if provided
      setImgSrc(fallbackSrc)
      setHasError(true)
    } else {
      // Hide the image
      setImgSrc('')
      setHasError(true)
    }
    
    setIsLoading(false)
    
    // Call custom error handler if provided
    if (onError) {
      onError(src)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // If we have no source or an error occurred and we have a fallback component
  if ((hasError && !imgSrc) || (!src && fallback)) {
    return fallback || (
      <div className={`bg-zinc-200 dark:bg-zinc-700 ${className}`} {...props}>
        <div className="flex items-center justify-center w-full h-full text-zinc-400 dark:text-zinc-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  )
}
