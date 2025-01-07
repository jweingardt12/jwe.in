'use client'

import { createContext } from 'react'

export const ExpandedContext = createContext({
  isExpanded: false,
  setIsExpanded: () => {},
})
