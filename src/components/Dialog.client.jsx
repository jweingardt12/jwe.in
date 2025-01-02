'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import clsx from 'clsx'

const sizes = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  'full': 'sm:max-w-[80%]',
}

function MobileDialog({ open, onClose, children }) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className={clsx(
          "fixed inset-0 bg-black/75 backdrop-blur-sm",
          isClosing ? 'animate-overlay-out' : 'animate-overlay-in'
        )} 
        onClick={handleClose} 
      />
      <div className="fixed inset-x-0 bottom-0">
        <div 
          className={clsx(
            "relative w-full bg-white dark:bg-zinc-900 rounded-t-2xl shadow-xl overflow-hidden",
            isClosing ? 'animate-sheet-out' : 'animate-sheet-in'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function DesktopDialog({ open, onClose, size, children }) {
  if (!open) return null

  return (
    <Transition show={open} as={Fragment}>
      <HeadlessDialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel
                className={clsx(
                  'relative w-full bg-white dark:bg-zinc-900 shadow-xl',
                  'rounded-2xl',
                  'ring-1 ring-gray-200 dark:ring-zinc-800',
                  sizes[size]
                )}
              >
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}

function CustomDialog({ open = false, onClose, size = 'lg', children }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => window.innerWidth < 640
      setIsMobile(checkMobile())
      
      const handleResize = () => {
        setIsMobile(checkMobile())
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (isMobile) {
    return <MobileDialog open={open} onClose={onClose}>{children}</MobileDialog>
  }

  return <DesktopDialog open={open} onClose={onClose} size={size}>{children}</DesktopDialog>
}

function DialogTitle({ children, className }) {
  return (
    <div className={clsx('text-lg font-semibold leading-6 text-gray-900 dark:text-white', className)}>
      {children}
    </div>
  )
}

function DialogBody({ children, className }) {
  return (
    <div className={clsx('text-sm text-gray-600 dark:text-zinc-400', className)}>
      {children}
    </div>
  )
}

export { CustomDialog as Dialog, DialogTitle, DialogBody } 