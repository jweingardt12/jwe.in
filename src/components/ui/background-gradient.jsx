'use client';

import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={cn("relative group rounded-2xl", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "200% 200%" : undefined,
        }}
        className={cn(
          "absolute -inset-2.5 rounded-[1.2rem] opacity-0 group-hover:opacity-100 blur-md",
          "bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-cyan-500/40"
        )}
      />
      <div className={cn("relative z-[1] rounded-2xl overflow-hidden", className)}>
        {children}
      </div>
    </div>
  );
};
