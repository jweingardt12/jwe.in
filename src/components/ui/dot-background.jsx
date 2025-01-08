'use client'

import React from "react";
import { motion } from "framer-motion";

export function DotBackgroundDemo() {
  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-dot-black dark:bg-dot-white [background-size:16px_16px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
          style={{
            willChange: 'opacity',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)'
          }}
        />
      </div>
    </motion.div>
  );
}
