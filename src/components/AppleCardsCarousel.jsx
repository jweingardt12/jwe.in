'use client'

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const cards = [
  {
    id: 1,
    title: "Product Management",
    category: "Leadership",
    description: "Leading product teams and building innovative solutions",
    gradient: "from-blue-600 to-blue-400",
  },
  {
    id: 2,
    title: "Technology",
    category: "Engineering",
    description: "Passionate about emerging tech and its applications",
    gradient: "from-green-600 to-green-400",
  },
  {
    id: 3,
    title: "Photography",
    category: "Creative",
    description: "Amateur photographer capturing life's moments",
    gradient: "from-purple-600 to-purple-400",
  },
  {
    id: 4,
    title: "Innovation",
    category: "Future",
    description: "Driving the future of autonomous kitchens",
    gradient: "from-orange-600 to-orange-400",
  },
];

export const AppleCardsCarousel = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);

  const checkScrollability = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef}
        onScroll={checkScrollability}
        className="flex overflow-x-auto hide-scrollbar gap-6 px-8 py-20"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className={`relative shrink-0 cursor-pointer rounded-3xl bg-gradient-to-b ${card.gradient} h-[32rem] w-[24rem] p-8 overflow-hidden`}
            style={{ scrollSnapAlign: 'start' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: card.id * 0.1,
            }}
            onHoverStart={() => setHoveredId(card.id)}
            onHoverEnd={() => setHoveredId(null)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/20" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex-1">
                <p className="text-sm font-medium text-white/80 mb-2">
                  {card.category}
                </p>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {card.title}
                </h3>
                <p className="text-base text-white/90">
                  {card.description}
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: hoveredId === card.id ? 1 : 0,
                  y: hoveredId === card.id ? 0 : 10
                }}
                className="mt-4"
              >
                <span className="inline-flex items-center text-white">
                  Learn more
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 bottom-6 flex gap-2">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`p-2 rounded-full bg-white/10 backdrop-blur-sm transition-opacity ${
            !canScrollLeft ? 'opacity-30' : 'opacity-100 hover:bg-white/20'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`p-2 rounded-full bg-white/10 backdrop-blur-sm transition-opacity ${
            !canScrollRight ? 'opacity-30' : 'opacity-100 hover:bg-white/20'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}; 