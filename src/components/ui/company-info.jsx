'use client';

import React from "react";
import { trackWorkClick } from '@/lib/analytics/tracking';

export const CompanyInfo = ({ industry, size, location, website, tools, headlines }) => {
  return (
    <div className="flex flex-col gap-3 text-xs text-zinc-600 dark:text-zinc-400">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-1">Industry</span>
          <span>{industry}</span>
        </div>
        
        <div>
          <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-1">Size</span>
          <span>{size}</span>
        </div>
        
        <div>
          <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-1">Headquarters</span>
          <span>{location}</span>
        </div>
        
        {website && (
          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-1">Website</span>
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              onClick={() => trackWorkClick('website', {
                url: website,
                company: website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
                location: 'company_info'
              })}
            >
              {website.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </div>
        )}
      </div>
      
      {tools && tools.length > 0 && (
        <div className="mt-2">
          <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-2">Tools</span>
          <div className="flex flex-wrap gap-1.5">
            {tools.map((tool, index) => (
              <span 
                key={index}
                className="inline-flex items-center text-xs text-zinc-600 dark:text-zinc-400"
              >
                {tool}{index < tools.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {headlines && headlines.length > 0 && (
        <div className="mt-3">
          <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-2">In the news</span>
          <ul className="space-y-1">
            {headlines.map((headline, index) => (
              <li key={index} className="text-xs">
                <a 
                  href={headline.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  onClick={() => trackWorkClick('headline', {
                    title: headline.title,
                    publication: headline.publication,
                    url: headline.url,
                    location: 'company_info'
                  })}
                >
                  "{headline.title}" - {headline.publication}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 