'use client';

import React from "react";

export const Timeline = ({ data }) => {
  return (
    <div className="w-full font-sans">
      <div className="max-w-5xl mx-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className="mb-24 last:mb-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-32 items-baseline">
              {/* Left column - Date and Logo */}
              <div>
                <h3 className="text-4xl whitespace-nowrap font-medium text-zinc-500 dark:text-zinc-400 mb-8 md:mb-8">
                  {item.title}
                </h3>
                {item.logo && (
                  <div className="mt-8">
                    {item.logo}
                  </div>
                )}
              </div>

              {/* Right column - Content */}
              <div>
                {item.role && (
                  <h3 className="order-first md:order-none text-3xl font-semibold text-zinc-800 dark:text-zinc-100 mb-8">
                    {item.role}
                  </h3>
                )}
                <div className="text-base text-zinc-600 dark:text-zinc-400 space-y-4">
                  {item.content}
                </div>
              </div>
            </div>

            {/* Divider */}
            {index < data.length - 1 && (
              <div className="mt-24 h-px bg-zinc-200 dark:bg-zinc-800" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
