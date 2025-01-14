"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const HighlightText = ({ content, isActive }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsVisible(true), 400);
      return () => clearTimeout(timer);
    }
    setIsVisible(false);
  }, [isActive]);

  return (
    <span className="inline">
      <span className="relative inline">
        <span className="relative z-10">{content}</span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: isVisible ? 1 : 0
          }}
          transition={{ 
            duration: 0.6,
            ease: [0.33, 1, 0.68, 1]
          }}
          className="absolute inset-0 bg-yellow-100 dark:bg-yellow-500/30 -z-10 origin-left"
        />
      </span>
    </span>
  );
};

export const CardStack = ({
  items,
  offset,
  scaleFactor
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const ROTATION_INTERVAL = 8000; // 8 seconds per card
  const CARD_TRANSITION_DURATION = 300; // Duration of card transition animation
  
  // Filter out invisible cards
  const visibleCards = items.filter(card => card.visibility !== false);
  const [cards, setCards] = useState(visibleCards);
  const [maxHeight, setMaxHeight] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressInterval = useRef(null);
  const rotationTimer = useRef(null);
  const startTime = useRef(null);
  const pausedTime = useRef(null);
  const cardRefs = useRef(new Map());

  useEffect(() => {
    // Calculate max height after initial render
    const heights = Array.from(cardRefs.current.values()).map(
      ref => ref.getBoundingClientRect().height
    );
    const max = Math.max(...heights);
    if (max > 0) {
      setMaxHeight(max);
    }
  }, [items]);

  useEffect(() => {
    startTime.current = Date.now();
    
    const startRotationTimer = () => {
      rotationTimer.current = setInterval(moveToNext, ROTATION_INTERVAL);
    };

    const updateProgress = () => {
      const animate = () => {
        if (!isPaused) {
          const elapsed = pausedTime.current 
            ? Date.now() - startTime.current - (Date.now() - pausedTime.current)
            : Date.now() - startTime.current;
          const newProgress = (elapsed / ROTATION_INTERVAL) * 100;
          
          if (newProgress <= 100) {
            setProgress(newProgress);
            progressInterval.current = requestAnimationFrame(animate);
          }
        }
      };
      progressInterval.current = requestAnimationFrame(animate);
    };

    if (!isPaused) {
      startRotationTimer();
      updateProgress();
    }

    return () => {
      if (rotationTimer.current) {
        clearInterval(rotationTimer.current);
      }
      if (progressInterval.current) {
        cancelAnimationFrame(progressInterval.current);
      }
    };
  }, [cards, isPaused]);

  const moveToNext = () => {
    setCards((prevCards) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop());
      return newArray;
    });
    startTime.current = Date.now();
    pausedTime.current = null;
    setProgress(0);
  };

  const moveToPrevious = () => {
    setCards((prevCards) => {
      const newArray = [...prevCards];
      newArray.push(newArray.shift());
      return newArray;
    });
    startTime.current = Date.now();
    pausedTime.current = null;
    setProgress(0);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    pausedTime.current = Date.now();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    if (pausedTime.current) {
      startTime.current = startTime.current + (Date.now() - pausedTime.current);
      pausedTime.current = null;
    }
  };

  const getTextSize = (content) => {
    // Remove HTML tags for length calculation
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length > 200) return 'text-xs md:text-sm leading-relaxed';
    if (plainText.length > 150) return 'text-sm md:text-base leading-relaxed';
    return 'text-base md:text-lg leading-relaxed';
  };

  const renderHighlightedContent = (content, isActive) => {
    const parts = content.split(/(<highlight>.*?<\/highlight>)/g);
    
    return parts.map((part, index) => {
      const highlightMatch = part.match(/<highlight>(.*?)<\/highlight>/);
      if (highlightMatch) {
        return <HighlightText key={index} content={highlightMatch[1]} isActive={isActive} />;
      }
      return <span key={index} className="inline">{part}</span>;
    });
  };

  return (
    <div className="relative min-h-[15rem] w-full mt-12 md:mt-16">
      {cards.map((card, index) => {
        const textSize = getTextSize(card.content);
        return (
          <motion.div
            key={card.id}
            ref={el => {
              if (el) cardRefs.current.set(card.id, el);
              else cardRefs.current.delete(card.id);
            }}
            onMouseEnter={index === 0 ? handleMouseEnter : undefined}
            onMouseLeave={index === 0 ? handleMouseLeave : undefined}
            className="absolute dark:bg-black bg-white w-full rounded-3xl pt-8 md:pt-10 pb-6 md:pb-8 px-4 md:px-6 shadow-xl border border-neutral-200 dark:border-white/[0.2] dark:shadow-white/[0.05] dark:hover:border-white/[0.3] transition-colors"
            style={{
              transformOrigin: "top center",
              height: window.innerWidth < 768 ? '320px' : undefined
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
            }}
          >
            <div className="flex flex-col h-full md:h-auto">
              <div className="flex-1">
                <div className={`font-normal text-neutral-700 dark:text-neutral-200 italic ${textSize} max-w-[95%]`}>
                  "{renderHighlightedContent(card.content, index === 0)}"
                </div>
              </div>
              <div className="flex-none mt-4 md:mt-8 mb-12 md:mb-0">
                <div className="flex items-center gap-3">
                  {card.profileImage && (
                    <div className="relative h-8 w-8 md:h-10 md:w-10 shrink-0">
                      <Image
                        src={card.profileImage}
                        alt={`${card.name.replace(/<[^>]*>/g, '')} profile photo`}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p 
                      className="text-neutral-500 font-medium dark:text-white text-sm md:text-base"
                      dangerouslySetInnerHTML={{ __html: card.name }}
                    />
                    <p className="text-neutral-400 font-normal dark:text-neutral-200 text-xs md:text-xs italic">
                      {card.designation}
                    </p>
                  </div>
                </div>
              </div>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 mx-4 md:mx-6 mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-zinc-300 dark:bg-zinc-600"
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-1 ml-3">
                      <button
                        onClick={moveToPrevious}
                        className="p-2 md:p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Previous card"
                      >
                        <ChevronUpIcon className="h-4 w-4 md:h-4 md:w-4 text-zinc-500" />
                      </button>
                      <button
                        onClick={moveToNext}
                        className="p-2 md:p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Next card"
                      >
                        <ChevronDownIcon className="h-4 w-4 md:h-4 md:w-4 text-zinc-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
