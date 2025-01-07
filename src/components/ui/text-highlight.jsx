"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { motion, useInView } from "framer-motion";

export const TextHighlight = ({
  children,
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [highlightWidth, setHighlightWidth] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setHighlightWidth(ref.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      <motion.span
        initial={{ width: 0 }}
        animate={isInView || hasAnimated ? { width: highlightWidth } : { width: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute bottom-0 left-0 h-3 bg-yellow-300/50 dark:bg-yellow-300/30 -z-10"
      />
    </span>
  );
}; 