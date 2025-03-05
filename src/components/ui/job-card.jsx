'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const JobCard = ({ content, className }) => {
  // This component expects content to be a motion.div with children
  // We'll extract the children and apply our own styling
  const contentChildren = React.isValidElement(content) && content.props.children;
  
  if (!contentChildren) return content;
  
  return (
    <div className={`space-y-5 ${className}`}>
      {React.Children.map(contentChildren, (child) => {
        if (React.isValidElement(child) && child.props.className?.includes('text-zinc-600')) {
          // This is the content div
          const contentItems = child.props.children;
          
          return (
            <div className="space-y-5">
              {React.Children.map(contentItems, (item, index) => {
                if (React.isValidElement(item)) {
                  if (item.props.className?.includes('text-base font-semibold')) {
                    // This is a section heading (Impact or Responsibilities)
                    return (
                      <h4 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                        {item.props.children}
                      </h4>
                    );
                  } else if (item.type === 'ul') {
                    // This is a list of bullet points
                    return (
                      <ul className="space-y-2 pl-5 list-disc marker:text-zinc-400">
                        {React.Children.map(item.props.children, (listItem) => {
                          if (React.isValidElement(listItem) && listItem.type === 'li') {
                            return (
                              <li className="text-sm text-zinc-600 dark:text-zinc-400">
                                {listItem.props.children}
                              </li>
                            );
                          }
                          return listItem;
                        })}
                      </ul>
                    );
                  } else if (item.type === 'div' && item.props.className?.includes('h-px')) {
                    // This is a divider
                    return <div className="h-px bg-zinc-100 dark:bg-zinc-800" />;
                  }
                }
                return item;
              })}
            </div>
          );
        }
        return child;
      })}
    </div>
  );
}; 