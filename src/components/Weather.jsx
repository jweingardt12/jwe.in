'use client';

import { useState } from 'react';
import { Weather } from '@/components/Weather';
import Image from 'next/image';
import avatarImage from '@/images/avatar.jpg';

export function AvatarWithTooltip() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <Link href="/">
        <Image
          src={avatarImage}
          alt="Jason Weingardt"
          width={80}
          height={80}
          className="rounded-full border border-zinc-200 dark:border-zinc-700"
        />
      </Link>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute top-20 z-10 w-64 p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg">
          <Weather />
        </div>
      )}
    </div>
  );
}