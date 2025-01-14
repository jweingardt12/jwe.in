'use client';

import React from "react";

export const CompanyInfo = ({ industry, size, location, website, tools, headlines }) => {
  return (
    <div className="flex flex-col gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-4 mb-2">
      <div className="grid grid-cols-[80px_1fr] gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-right">INDUSTRY:</span>
        <span>{industry}</span>
      </div>
      <div className="grid grid-cols-[80px_1fr] gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-right">SIZE:</span>
        <span>{size}</span>
      </div>
      <div className="grid grid-cols-[80px_1fr] gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-right">HQ:</span>
        <span>{location}</span>
      </div>
      {website && (
        <div className="grid grid-cols-[80px_1fr] gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-right">WEBSITE:</span>
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            {website.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        </div>
      )}
      {tools && tools.length > 0 && (
        <div className="grid grid-cols-[80px_1fr] gap-2 pt-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-right">TOOLS:</span>
          <span className="flex flex-wrap gap-1.5">
            {tools.map((tool, index) => (
              <span 
                key={index}
                className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-300"
              >
                {tool}
              </span>
            ))}
          </span>
        </div>
      )}
      {headlines && headlines.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-2 pt-1">
          <span className="text-xs font-semibold uppercase tracking-wide md:text-right">HEADLINES:</span>
          <div className="flex flex-col">
            {headlines.map((headline, index) => (
              <div key={index}>
                <div className={`flex flex-col gap-0.5 ${index === 0 ? 'pt-0 pb-2' : 'py-2'}`}>
                  {headline.publication && (
                    <span className="text-[8px] text-zinc-400 dark:text-zinc-300 uppercase tracking-wide">
                      {headline.publication}
                    </span>
                  )}
                  <a 
                    href={headline.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors break-words"
                  >
                    {headline.title}
                  </a>
                </div>
                {index < headlines.length - 1 && (
                  <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 