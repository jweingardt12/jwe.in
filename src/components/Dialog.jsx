
'use client'

import { Fragment } from 'react'
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
}

export function Dialog({ open = false, onClose, size = 'lg', children }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-400/50 backdrop-blur-md transition-all duration-200 dark:bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <HeadlessDialog.Panel className={clsx('relative w-full transform rounded-lg bg-white text-left shadow-xl transition-all dark:bg-zinc-900 sm:my-8', sizes[size])}>
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  )
}

export function DialogTitle({ children, className }) {
  return (
    <HeadlessDialog.Title className={clsx('text-lg font-semibold leading-6 text-zinc-900 dark:text-white', className)}>
      {children}
    </HeadlessDialog.Title>
  )
}

export function DialogBody({ children, className }) {
  return (
    <div className={clsx('mt-2 text-sm text-zinc-600 dark:text-zinc-400', className)}>
      {children}
    </div>
  )
}

export function DialogTestimonial({ quote, author, role, image }) {
  return (
    <div className="mt-6 lg:mt-0">
      <figure className="mt-10">
        <blockquote className="text-lg/8 font-semibold text-zinc-900 dark:text-zinc-100">
          <p>{quote}</p>
        </blockquote>
        <figcaption className="mt-10 flex gap-x-6">
          <img
            src={image}
            alt={author}
            className="size-12 flex-none rounded-full bg-zinc-100 dark:bg-zinc-800"
          />
          <div>
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {author}
            </div>
            <div className="text-sm/6 text-zinc-600 dark:text-zinc-400">
              {role}
            </div>
          </div>
        </figcaption>
      </figure>
    </div>
  )
}
