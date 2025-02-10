'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export function GlowEffect({ colors }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg">
      <div className="absolute inset-0 flex items-center justify-center">
        {colors.map((color, index) => (
          <div
            key={index}
            className="absolute h-[200%] w-[200%] rounded-[50%] mix-blend-normal filter blur-[80px]"
            style={{
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              transform: `translate(${(index - (colors.length - 1) / 2) * 30}%, -50%)`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>
    </div>
  )
}
