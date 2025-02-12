"use client"

import { cn } from "@/lib/utils"

/**
 * @name Shine Border
 * @description It is an animated background border effect component with easy to use and configurable props.
 * @param borderRadius defines the radius of the border.
 * @param borderWidth defines the width of the border.
 * @param duration defines the animation duration to be applied on the shining border
 * @param color a string or string array to define border color.
 * @param className defines the class name to be applied to the component
 * @param children contains react node elements.
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 8,
  color = ["#9333EA", "#3B82F6"],
  className,
  children,
}) {
  return (
    <div 
      className={cn("p-[1px] relative rounded-[--radius] overflow-hidden bg-gradient-to-r from-purple-500/20 to-blue-500/20 dark:from-transparent dark:to-transparent", className)}
      style={{ "--radius": `${borderRadius}px` }}
    >
      {/* Animated gradient border */}
      <div 
        className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite]"
        style={{
          background: "conic-gradient(from 0deg, #9333EA, #3B82F6, #9333EA)",
          opacity: "0.9",
        }}
      />
      
      {/* Content */}
      <div className="relative rounded-[--radius] bg-white/95 dark:bg-black/60 backdrop-blur-sm">
        {children}
      </div>
    </div>
  )
}

// Add this to your global CSS file
const styles = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}`

// Create and append style element
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style")
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
} 