'use client'

import { useState, useEffect } from 'react'
import { useToast } from './ui/use-toast'
import { useOpenPanel } from '@openpanel/nextjs'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'
import { Button } from './ui/button'
import clsx from 'clsx'

export function ContactDrawer({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const { track } = useOpenPanel()

  const handleOpenChange = (open) => {
    setIsOpen(open)
    if (open) {
      track('contact_drawer_open', {
        source: 'navigation'
      })
    }
  }

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => {
        const newState = !prev
        if (newState) {
          track('contact_drawer_open', {
            source: 'command_palette'
          })
        }
        return newState
      })
    }

    window.addEventListener('toggle-contact-drawer', handleToggle)
    return () => {
      window.removeEventListener('toggle-contact-drawer', handleToggle)
    }
  }, [track])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const { toast } = useToast()

  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            // Reset states after closing
            setTimeout(() => {
              setIsSuccess(false)
              setCountdown(3)
            }, 300)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isSuccess])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if any required field is empty
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('https://cloud.activepieces.com/api/v1/webhooks/UuUYOtqy2aDXB8GqKzSq4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        toast({
          title: "Error sending message",
          description: "Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer 
      open={isOpen} 
      onOpenChange={handleOpenChange}
      className="fixed inset-0 z-50"
      data-state={isOpen ? 'open' : 'closed'}
    >
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl px-6">
          <div className="flex flex-col gap-6 py-6">
            <div>
              <DrawerTitle>Get in touch</DrawerTitle>
              <DrawerDescription className="mt-2">Have a question? Found a bug on this site? Send me a message via the form below and I'll get back to you.</DrawerDescription>
            </div>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-16 animate-success-in">
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Thanks for your message!</h3>
                  <p className="text-gray-600 dark:text-zinc-400 text-lg mb-4">I'll get back to you as soon as possible.</p>
                  <p className="text-gray-500 dark:text-zinc-500 text-sm">Closing in {countdown}...</p>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                        Name
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          minLength={1}
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 bg-gray-50 dark:bg-zinc-800 px-3.5 py-2 text-gray-900 dark:text-white shadow-sm ring-[0.5px] ring-inset ring-gray-200 dark:ring-zinc-700 placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                        Email
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                          className="block w-full rounded-md border-0 bg-gray-50 dark:bg-zinc-800 px-3.5 py-2 text-gray-900 dark:text-white shadow-sm ring-[0.5px] ring-inset ring-gray-200 dark:ring-zinc-700 placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                        Message
                      </label>
                      <div className="mt-2.5">
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          minLength={1}
                          className="block w-full rounded-md border-0 bg-gray-50 dark:bg-zinc-800 px-3.5 py-2 text-gray-900 dark:text-white shadow-sm ring-[0.5px] ring-inset ring-gray-200 dark:ring-zinc-700 placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 text-base"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 flex gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle 
                              className="opacity-25" 
                              cx="12" 
                              cy="12" 
                              r="10" 
                              stroke="currentColor" 
                              strokeWidth="4"
                              fill="none"
                            />
                            <path 
                              className="opacity-75" 
                              fill="currentColor" 
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Let's talk →"
                      )}
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline" className="text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancel</Button>
                    </DrawerClose>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
