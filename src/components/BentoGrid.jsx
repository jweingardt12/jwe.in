'use client'

import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import smartHomeImage from '../images/photos/smart-home.jpg'

export const SkeletonImage = ({ src }) => {
  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt="Photography"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
    </div>
  );
};

export const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="absolute inset-0 flex flex-col space-y-2 p-6"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 ml-auto bg-white dark:bg-black"
      >
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
      </motion.div>
    </motion.div>
  );
};

export const SkeletonTwo = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="absolute inset-0 bg-gradient-to-br from-violet-500 to-pink-500"
      style={{
        backgroundSize: "200% 200%",
      }}
    />
  );
};

export const SmartHomeAnimation = () => {
  return (
    <div className="relative w-full h-full">
      <Image
        src={smartHomeImage}
        alt="Smart Home"
        fill
        className="object-cover rounded-t-xl"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
    </div>
  );
};

export const BentoGrid = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  header,
  icon,
}) => {
  return (
    <div
      className={cn(
        "group/bento relative rounded-xl border border-neutral-200 dark:border-white/[0.2] overflow-hidden bg-white dark:bg-black hover:shadow-xl transition duration-200",
        className
      )}
    >
      <div className="relative h-[250px]">
        {header}
      </div>
      <div className="p-4 border-t border-neutral-200 dark:border-white/[0.2]">
        <div className="flex items-center gap-2">
          {icon}
          <div className="font-medium text-neutral-600 dark:text-neutral-200">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}; 