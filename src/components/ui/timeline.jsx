'use client';

import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({
  data
}) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 40px", "end center"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height - 64]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    (<div
      className="w-full"
      ref={containerRef}>
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-40 md:gap-10">
            <div
              className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-zinc-50 dark:bg-black flex items-center justify-center">
                {index === 0 && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-emerald-400/20" />
                )}
                <div
                  className={`h-4 w-4 rounded-full ${index === 0 ? 'bg-emerald-400 border-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'} border p-2`} />
              </div>
              <div className="hidden md:flex md:flex-col md:pl-20">
                <h3 className="text-xl md:text-5xl font-bold text-zinc-500 dark:text-zinc-400">
                  {item.title}
                </h3>
                {item.logo}
              </div>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <div className="md:hidden flex flex-col mb-4">
                <h3 className="text-2xl font-bold text-zinc-500 dark:text-zinc-400">
                  {item.title}
                </h3>
                {item.logo}
              </div>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height - 64 + "px",
          }}
          className="absolute md:left-8 left-8 top-[45px] overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-zinc-200 dark:via-zinc-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-zinc-500 via-zinc-400 to-transparent from-[0%] via-[90%] rounded-full" />
        </div>
      </div>
    </div>)
  );
};
