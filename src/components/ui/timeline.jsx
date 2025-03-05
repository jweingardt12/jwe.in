'use client';

import React from "react";
import { motion } from "framer-motion";
import { JobCard } from "./job-card";

export const Timeline = ({ data }) => {
  return (
    <div className="w-full font-sans">
      <div className="max-w-5xl mx-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className="mb-16 last:mb-0"
          >
            <div className="relative">
              {/* Timeline connector - simplified */}
              {index < data.length - 1 && (
                <div className="absolute left-4 top-16 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700/40 hidden sm:block" />
              )}
              
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-16">
                {/* Left column - Date and Logo */}
                <div className="sm:w-64 flex-shrink-0">
                  {/* Date with minimal dot for timeline */}
                  <div className="flex items-center">
                    <div className="relative hidden sm:block">
                      <div className="w-8 h-8 flex items-center justify-center z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                      </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-medium text-zinc-500 dark:text-zinc-400 sm:ml-4">
                      {item.title}
                    </h3>
                  </div>
                  
                  {/* Logo */}
                  {item.logo && (
                    <div className="mt-6 sm:ml-8">
                      {item.logo}
                    </div>
                  )}
                </div>

                {/* Right column - Content */}
                <div className="flex-1">
                  <div>
                    {/* Role title */}
                    {item.role && (
                      <h3 className="text-xl sm:text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
                        {item.role}
                      </h3>
                    )}
                    
                    {/* Content */}
                    <JobCard content={item.content} />
                  </div>
                </div>
              </div>
            </div>

            {/* Simple divider between entries */}
            {index < data.length - 1 && (
              <div className="mt-16 h-px bg-zinc-200 dark:bg-zinc-800" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
