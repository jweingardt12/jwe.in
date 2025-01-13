'use client';

import React from "react";

export const CompanyInfo = ({ industry, size, location, website }) => {
  return (
    <div className="flex flex-col gap-2 text-xs text-zinc-500 dark:text-zinc-600 mt-4">
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
    </div>
  );
}; 