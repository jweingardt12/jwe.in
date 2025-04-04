'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { cn } from '../../lib/utils';
import { usePlausible } from '@/lib/analytics';
import Image from 'next/image';

export const ExpandableCard = ({
  children,
  className,
  title,
  description,
  header,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.documentElement.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  useOutsideClick(modalRef, () => setIsOpen(false));

  const { track } = usePlausible();

  const handleOpen = () => {
    setIsOpen(true);
    track('expand_card', { title });
    if (onClick) onClick();
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className={cn(
          'overflow-hidden rounded-2xl cursor-pointer bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200/50 dark:border-white/[0.05] h-[250px] transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-neutral-900/50 hover:scale-[1.02] relative',
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100',
          className
        )}
      >
        <div className="absolute inset-0 w-full h-full">
          {header}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
        <div className="absolute bottom-0 p-6 flex flex-col">
          <h3 className="text-xl font-semibold text-white">
            {title}
          </h3>
          <p className="text-base text-white/80 mt-1">
            {description}
          </p>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-all duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!isOpen}
      />
      <div
        className={cn(
          'fixed inset-0 grid place-items-center z-[201] transition-all duration-300 p-4',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!isOpen}
      >
        <button
          onClick={() => setIsOpen(false)}
          className={cn(
            'fixed top-4 right-4 flex items-center justify-center bg-white dark:bg-neutral-900 rounded-full h-8 w-8 shadow-lg transition-all duration-200 z-[202]',
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-zinc-800 dark:text-zinc-200"
          >
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'w-full max-w-[600px] max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden border border-neutral-200/50 dark:border-white/[0.05] transition-all duration-300',
            isOpen
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-4'
          )}
        >
          <div className="w-full relative h-[300px] overflow-hidden shrink-0">
            <div className="absolute inset-0 w-full h-full">
              {header}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
          </div>
          <div className="p-8 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                {title}
              </h3>
              <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2">
                {description}
              </p>
            </div>
            <div className="text-zinc-600 dark:text-zinc-400">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
