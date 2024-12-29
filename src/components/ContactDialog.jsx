
'use client'

import { Dialog, DialogTitle, DialogBody, DialogTestimonial } from './Dialog'
import { XMarkIcon } from '@heroicons/react/24/solid'

export function ContactDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} size="full">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <DialogTitle>Get in touch</DialogTitle>
          <button
            onClick={onClose}
            className="rounded-md text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <DialogBody>
          <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
            <form action="#" method="POST" className="lg:w-[70%]">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm/6 font-medium text-white">
                    Name
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 bg-zinc-800/50 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="block w-full rounded-md border-0 bg-zinc-800/50 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm/6 font-medium text-white">
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="block w-full rounded-md border-0 bg-zinc-800/50 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className="block w-full rounded-md bg-teal-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:hover:bg-teal-400"
                >
                  Let's talk →
                </button>
              </div>
            </form>
            <DialogTestimonial
              quote="I had an excellent experience working with this team. They delivered exactly what I needed, on time and with great attention to detail."
              author="Sarah Johnson"
              role="CEO at TechCorp"
              image="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=96&h=96&q=80"
            />
          </div>
        </DialogBody>
      </div>
    </Dialog>
  )
}
