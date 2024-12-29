
'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

export function Photos() {
  const photos = [
    { image: require('@/images/photos/image-1.jpg'), hoverText: 'Kauai, HI', link: 'https://unsplash.com/photos/high-angle-photo-of-mountain-bjIi891Jfiw' },
    { image: require('@/images/photos/image-2.jpg'), hoverText: 'Mountain vista', link: 'https://example.com/mountain' },
    { image: require('@/images/photos/image-3.jpg'), hoverText: 'City lights', link: 'https://example.com/city' },
    { image: require('@/images/photos/image-4.jpg'), hoverText: 'Forest trail', link: 'https://example.com/forest' },
    { image: require('@/images/photos/image-5.jpg'), hoverText: 'Ocean waves', link: 'https://example.com/ocean' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, photos.length]);

  return (
    <div className="mt-16 sm:mt-20">
      <div className="relative w-full h-[400px] overflow-hidden rounded-2xl">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={clsx(
              'absolute w-full h-full transition-transform duration-500',
              { 'translate-x-full': index > currentIndex },
              { '-translate-x-full': index < currentIndex },
              { 'translate-x-0': index === currentIndex }
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <a href={photo.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <Image
                src={photo.image}
                alt={photo.hoverText}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 18rem, 11rem"
                quality={75}
                priority={index === 0}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold">{photo.hoverText}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
