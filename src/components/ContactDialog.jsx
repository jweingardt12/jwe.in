'use client'

import { Dialog, DialogTitle, DialogBody } from './Dialog'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export function ContactDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        // Track successful form submission
        window.umami?.track('contact_form_submit', { success: true })
        
        setIsSuccess(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        // Track failed form submission
        window.umami?.track('contact_form_submit', { success: false })
        
        toast({
          title: "Error sending message",
          description: "Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      // Track form error
      window.umami?.track('contact_form_error', { error: error.message })
      
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
    <Dialog open={open} onClose={onClose}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <DialogTitle><h1 className="text-2xl font-semibold text-white mb-4">Get in touch</h1></DialogTitle>
          <button
            onClick={onClose}
            className="rounded-md text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <DialogBody>
          <div className="mt-16 flex flex-col gap-16 sm:gap-y-20">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-semibold text-white mb-4">Thanks for your message!</h3>
                  <p className="text-zinc-400 text-lg mb-8">I'll get back to you as soon as possible.</p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-sky-500 hover:text-sky-400"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-xl mx-auto w-full">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm/6 font-medium text-white">
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
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 bg-zinc-800/50 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
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
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-md border-0 bg-zinc-800/50 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm/6 font-medium text-white">
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
                          className="block w-full rounded-md border-0 bg-zinc-800/50 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-10">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="block w-full rounded-md bg-sky-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Let\'s talk →'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </DialogBody>
      </div>
    </Dialog>
  )
}
