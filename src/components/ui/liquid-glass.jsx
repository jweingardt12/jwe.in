'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { clsx } from 'clsx'

export function LiquidGlass({ 
  children, 
  className = '',
  displacementScale = 70,
  blurAmount = 0.3,
  saturation = 220,
  aberrationIntensity = 2,
  elasticity = 0.15,
  cornerRadius = 999,
  ...props 
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [targetPosition, setTargetPosition] = useState({ x: 0.5, y: 0.5 })
  const [isHovered, setIsHovered] = useState(false)
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 })

  // Smooth animation using elasticity
  const animatePosition = useCallback(() => {
    setMousePosition(prev => ({
      x: prev.x + (targetPosition.x - prev.x) * elasticity,
      y: prev.y + (targetPosition.y - prev.y) * elasticity
    }))
    
    animationRef.current = requestAnimationFrame(animatePosition)
  }, [targetPosition, elasticity])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animatePosition)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animatePosition])

  // Handle scroll-based displacement
  useEffect(() => {
    const handleScroll = () => {
      const scrollX = window.scrollX
      const scrollY = window.scrollY
      setScrollOffset({ 
        x: (scrollX % 100) / 100, 
        y: (scrollY % 100) / 100 
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setTargetPosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) })
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => {
      setIsHovered(false)
      setTargetPosition({ x: 0.5, y: 0.5 })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const glassStyle = {
    '--mouse-x': `${mousePosition.x * 100}%`,
    '--mouse-y': `${mousePosition.y * 100}%`,
    '--scroll-x': `${scrollOffset.x * 100}%`,
    '--scroll-y': `${scrollOffset.y * 100}%`,
    '--displacement-scale': displacementScale,
    '--blur-amount': `${blurAmount}rem`,
    '--saturation': `${saturation}%`,
    '--aberration': aberrationIntensity,
    '--elasticity': elasticity,
    '--corner-radius': `${cornerRadius}px`,
    '--opacity': isHovered ? 1 : 0.8,
    '--displacement-x': `${(mousePosition.x - 0.5) * (displacementScale * 0.3)}px`,
    '--displacement-y': `${(mousePosition.y - 0.5) * (displacementScale * 0.3)}px`,
    '--scroll-displacement-x': `${scrollOffset.x * 8}px`,
    '--scroll-displacement-y': `${scrollOffset.y * 8}px`,
    '--aberration-offset': `${aberrationIntensity}px`,
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        'liquid-glass-container relative overflow-hidden transition-all duration-300 ease-out',
        className
      )}
      style={glassStyle}
      {...props}
    >
      {/* SVG Filter for displacement and aberration */}
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none">
        <defs>
          <filter id="liquid-glass-filter" x="-50%" y="-50%" width="200%" height="200%">
            {/* Turbulence for liquid effect */}
            <feTurbulence
              id="turbulence"
              baseFrequency="0.02"
              numOctaves="3"
              result="noise"
            />
            
            {/* Displacement map */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementScale * (isHovered ? 0.3 : 0.1)}
              result="displacement"
            />
            
            {/* Chromatic aberration effect */}
            <feOffset in="displacement" dx={aberrationIntensity * 0.3} dy="0" result="red" />
            <feOffset in="displacement" dx={-aberrationIntensity * 0.3} dy="0" result="blue" />
            
            <feComponentTransfer in="red" result="redChannel">
              <feFuncR type="discrete" tableValues="1 0 0" />
              <feFuncG type="discrete" tableValues="0 0 0" />
              <feFuncB type="discrete" tableValues="0 0 0" />
            </feComponentTransfer>
            
            <feComponentTransfer in="blue" result="blueChannel">
              <feFuncR type="discrete" tableValues="0 0 0" />
              <feFuncG type="discrete" tableValues="0 0 0" />
              <feFuncB type="discrete" tableValues="0 0 1" />
            </feComponentTransfer>
            
            <feBlend in="redChannel" in2="blueChannel" mode="screen" result="aberration" />
            <feBlend in="aberration" in2="displacement" mode="normal" />
          </filter>
        </defs>
      </svg>
      
      {/* Background refraction layer */}
      <div className="liquid-glass-bg absolute inset-0" />
      
      {/* Darkening overlay on hover */}
      <div className="liquid-glass-darken absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none" />
      
      {/* Liquid effect overlay with multiple layers */}
      <div className="liquid-glass-overlay absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none">
        {/* Primary liquid bubble */}
        <div className="liquid-glass-bubble absolute w-40 h-40 rounded-full transform-gpu transition-all duration-700 ease-out" 
             style={{
               left: 'var(--mouse-x)',
               top: 'var(--mouse-y)',
               transform: `translate(-50%, -50%) scale(${isHovered ? 1.4 : 0.6}) rotate(${mousePosition.x * 45}deg)`,
               background: `radial-gradient(circle, 
                 rgba(59, 130, 246, ${0.15 * (isHovered ? 1.5 : 0.8)}) 0%, 
                 rgba(147, 51, 234, ${0.1 * (isHovered ? 1.5 : 0.8)}) 50%, 
                 transparent 70%)`,
               filter: `blur(${isHovered ? '1.5rem' : '0.8rem'}) saturate(var(--saturation))`,
             }} 
        />
        
        {/* Secondary ripple effect */}
        <div className="liquid-glass-ripple absolute w-24 h-24 rounded-full transform-gpu transition-all duration-1000 ease-out" 
             style={{
               left: 'var(--mouse-x)',
               top: 'var(--mouse-y)',
               transform: `translate(-50%, -50%) scale(${isHovered ? 2 : 1}) rotate(${-mousePosition.y * 30}deg)`,
               background: `conic-gradient(from ${mousePosition.x * 360}deg, 
                 rgba(34, 197, 94, ${0.08 * (isHovered ? 1.2 : 0.6)}) 0%, 
                 rgba(168, 85, 247, ${0.06 * (isHovered ? 1.2 : 0.6)}) 50%, 
                 rgba(59, 130, 246, ${0.04 * (isHovered ? 1.2 : 0.6)}) 100%)`,
               filter: `blur(2rem) saturate(150%)`,
             }} 
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 liquid-glass-content">
        {children}
      </div>
      
      <style jsx>{`
        .liquid-glass-container {
          border-radius: var(--corner-radius);
          backdrop-filter: blur(var(--blur-amount)) saturate(var(--saturation)) contrast(1.2) brightness(1.1);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.15) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.15),
            0 4px 16px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05);
          transform: translate3d(
            calc(var(--displacement-x) + var(--scroll-displacement-x)), 
            calc(var(--displacement-y) + var(--scroll-displacement-y)), 
            0
          );
          transition: transform 0.1s ease-out;
        }
        
        .dark .liquid-glass-container {
          background: linear-gradient(135deg, 
            rgba(0, 0, 0, 0.5) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.2) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.5),
            0 4px 16px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3);
        }
        
        .liquid-glass-container:hover {
          transform: translate3d(
            calc(var(--displacement-x) * 0.8 + var(--scroll-displacement-x)), 
            calc(var(--displacement-y) * 0.8 + var(--scroll-displacement-y)), 
            0
          );
        }
        
        .liquid-glass-container:hover .liquid-glass-overlay {
          opacity: var(--opacity);
        }
        
        .liquid-glass-container:hover .liquid-glass-darken {
          opacity: 1;
        }
        
        .liquid-glass-bg {
          border-radius: inherit;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.35) 0%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.15) 100%
          );
          transform: translate3d(
            calc(var(--scroll-displacement-x) * -0.2), 
            calc(var(--scroll-displacement-y) * -0.2), 
            0
          );
          transition: transform 0.2s ease-out;
        }
        
        .dark .liquid-glass-bg {
          background: linear-gradient(135deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.2) 100%
          );
        }
        
        .liquid-glass-darken {
          border-radius: inherit;
          background: radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            rgba(0, 0, 0, 0.15) 0%,
            rgba(0, 0, 0, 0.08) 40%,
            rgba(0, 0, 0, 0.04) 70%,
            transparent 100%
          );
          mix-blend-mode: multiply;
        }
        
        .dark .liquid-glass-darken {
          background: radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            rgba(0, 0, 0, 0.25) 0%,
            rgba(0, 0, 0, 0.15) 40%,
            rgba(0, 0, 0, 0.08) 70%,
            transparent 100%
          );
        }
        
        .liquid-glass-content {
          transform: translate3d(
            calc(var(--displacement-x) * 0.1), 
            calc(var(--displacement-y) * 0.1), 
            0
          );
          transition: transform 0.2s ease-out;
        }
        
        .liquid-glass-container:hover .liquid-glass-content {
          transform: translate3d(
            calc(var(--displacement-x) * 0.15), 
            calc(var(--displacement-y) * 0.15), 
            0
          );
        }
        
        /* Animate turbulence */
        @keyframes liquid-flow {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2px, -1px) scale(1.02); }
          66% { transform: translate(-1px, 2px) scale(0.98); }
          100% { transform: translate(0, 0) scale(1); }
        }
        
        .liquid-glass-container:hover #turbulence {
          animation: liquid-flow 3s ease-in-out infinite;
        }
        
        @supports (backdrop-filter: blur(1px)) {
          .liquid-glass-container {
            backdrop-filter: blur(var(--blur-amount)) saturate(var(--saturation)) contrast(1.3) brightness(1.1);
          }
          
          .dark .liquid-glass-container {
            backdrop-filter: blur(var(--blur-amount)) saturate(var(--saturation)) contrast(1.2) brightness(0.9);
          }
        }
        
        /* Enhanced text contrast with subtle aberration */
        .liquid-glass-container * {
          text-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.25),
            0 2px 6px rgba(0, 0, 0, 0.15),
            calc(var(--aberration-offset) * 0.2) 0 0 rgba(255, 0, 0, 0.06),
            calc(var(--aberration-offset) * -0.2) 0 0 rgba(0, 0, 255, 0.06);
          font-weight: 500;
        }
        
        .dark .liquid-glass-container * {
          text-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.6),
            0 2px 6px rgba(0, 0, 0, 0.4),
            calc(var(--aberration-offset) * 0.15) 0 0 rgba(255, 100, 100, 0.05),
            calc(var(--aberration-offset) * -0.15) 0 0 rgba(100, 100, 255, 0.05);
          font-weight: 500;
        }
        
        /* Scroll-based refraction */
        .liquid-glass-container {
          background-position: 
            calc(50% + var(--scroll-x) * 0.5) 
            calc(50% + var(--scroll-y) * 0.5);
          background-size: 120% 120%;
        }
      `}</style>
    </div>
  )
}