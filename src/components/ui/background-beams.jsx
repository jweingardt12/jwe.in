"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = React.memo(
  ({ className }) => {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        <svg
          className={cn("[mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 [--gradient-size:50%] [--gradient-angle:60deg]")}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="gradient" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgb(200 200 200 / 0.05)" />
              <stop offset="50%" stopColor="rgb(200 200 200 / 0.025)" />
              <stop offset="100%" stopColor="rgb(200 200 200 / 0)" />
            </radialGradient>
          </defs>
          <motion.rect
            className="h-full w-full"
            fill="url(#gradient)"
            width="100%"
            height="100%"
            initial={{
              opacity: 0,
              pathLength: 0,
            }}
            animate={{
              opacity: 1,
              pathLength: 1,
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.g>
            {[...Array(40)].map((_, i) => (
              <motion.line
                key={i}
                x1="-500"
                y1={-400 + i * 20}
                x2="1000"
                y2={600 + i * 20}
                stroke="url(#gradient)"
                strokeWidth="1"
                initial={{
                  opacity: 0,
                  pathLength: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  pathLength: [0, 1, 0],
                }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.g>
        </svg>
      </div>
    );
  }
);

BackgroundBeams.displayName = "BackgroundBeams"; 