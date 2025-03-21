"use client";

import React, { useRef, useState, useEffect } from "react";

export function GlowingEffect({
  spread = 40,
  glow = true,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.01,
}) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0.2);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if mouse is within the container
      const isWithinContainer = 
        x >= 0 && 
        x <= rect.width && 
        y >= 0 && 
        y <= rect.height;
      
      if (isWithinContainer) {
        setPosition({ x, y });
        setOpacity(1);
        setIsHovered(true);
      } else {
        // Calculate distance from container
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + 
          Math.pow(e.clientY - centerY, 2)
        );
        
        // Fade out based on proximity
        if (distance < proximity) {
          const opacityValue = Math.max(0.2, 1 - distance / proximity);
          setOpacity(opacityValue > inactiveZone ? opacityValue : 0.2);
        } else {
          setOpacity(0.2);
        }
        
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setOpacity(0.2);
      setIsHovered(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [disabled, proximity, inactiveZone]);

  // Set initial position to center of element
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({ x: rect.width / 2, y: rect.height / 2 });
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
      data-component-name="GlowingEffect"
    >
      {!disabled && (
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
          style={{
            opacity,
            background: glow
              ? `radial-gradient(${spread}rem circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.6), rgba(37, 99, 235, 0.3) 40%, transparent ${spread}%)`
              : "none",
            transition: "opacity 300ms ease, background 300ms ease",
          }}
        />
      )}
    </div>
  );
} 