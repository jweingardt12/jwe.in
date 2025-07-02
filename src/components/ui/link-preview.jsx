import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { trackLinkClick, EventNames } from '@/lib/analytics/tracking';

export function LinkPreview({ href, children, imageUrl, title, description }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
        >
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-80 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => trackLinkClick(EventNames.LINK_PREVIEW_CLICK, {
              title,
              url: href,
              type: 'link_preview',
              location: 'card'
            })}
          >
            <div className="flex flex-col">
              {imageUrl && (
                <motion.div 
                  className="relative h-32 w-full overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              )}
              <motion.div 
                className="p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
              </motion.div>
            </div>
          </a>
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  );
} 