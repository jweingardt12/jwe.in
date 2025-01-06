"use client";

import React, { useEffect, useId, useRef, useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { cn } from "../../lib/utils";
import { ExpandedContext } from '../../app/work/page'

export const ExpandableCard = ({ 
  children, 
  className,
  title,
  description,
  header,
  defaultOpen = false
}) => {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();
  const { setIsExpanded } = useContext(ExpandedContext);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
        setIsExpanded(false);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
      setIsExpanded(true);
    } else {
      document.body.style.overflow = "auto";
      setIsExpanded(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, setIsExpanded]);

  useOutsideClick(ref, () => {
    setActive(null);
    setIsExpanded(false);
  });

  const handleClick = () => {
    if (!active) {
      setActive(true);
      setIsExpanded(true);
    }
  };

  return (
    <div className="relative">
      <motion.div
        layoutId={`card-${title}-${id}`}
        className={cn(
          "overflow-hidden rounded-2xl cursor-pointer bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200/50 dark:border-white/[0.05]",
          className
        )}
        onClick={handleClick}
      >
        <motion.div layoutId={`header-${title}-${id}`} className="relative">
          {header}
        </motion.div>
        <div className="p-4">
          <motion.h3
            layoutId={`title-${title}-${id}`}
            className="text-xl font-semibold text-zinc-800 dark:text-zinc-200"
          >
            {title}
          </motion.h3>
          <motion.p
            layoutId={`description-${description}-${id}`}
            className="text-base text-zinc-600 dark:text-zinc-400 mt-1"
          >
            {description}
          </motion.p>
        </div>
      </motion.div>

      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm h-full w-full z-10"
            />
            <div className="fixed inset-0 grid place-items-center z-[100]">
              <motion.button
                key={`button-${title}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.05 },
                }}
                className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                onClick={() => setActive(null)}
              >
                <CloseIcon />
              </motion.button>
              <motion.div
                layoutId={`card-${title}-${id}`}
                ref={ref}
                className="w-full max-w-[600px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden border border-neutral-200/50 dark:border-white/[0.05]"
              >
                <motion.div 
                  layoutId={`header-${title}-${id}`} 
                  className="w-full relative"
                >
                  {header}
                </motion.div>
                <div className="p-6">
                  <motion.h3
                    layoutId={`title-${title}-${id}`}
                    className="text-xl font-semibold text-zinc-800 dark:text-zinc-200"
                  >
                    {title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${description}-${id}`}
                    className="text-base text-zinc-600 dark:text-zinc-400 mt-1"
                  >
                    {description}
                  </motion.p>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-zinc-600 dark:text-zinc-400"
                  >
                    {children}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.05 },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
}; 