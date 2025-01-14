'use client'

import { useState, useEffect } from 'react'
import { SimpleLayout } from '@/components/SimpleLayout'
import { nanoid } from 'nanoid'
import { ClipboardIcon as ClipboardIconOutline, CheckIcon, PencilIcon } from '@heroicons/react/24/outline'

export default function CreatePage() {
  const [jobUrl, setJobUrl] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedCards, setSavedCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [editingCard, setEditingCard] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [isRegenerating, setIsRegenerating] = useState(null)

  useEffect(() => {
    // Load saved cards from localStorage
    const loadSavedCards = () => {
      const cards = Object.entries(localStorage)
        .filter(([key]) => key.startsWith('job-analysis-'))
        .map(([key, value]) => {
          try {
            const data = JSON.parse(value)
            return {
              id: key.replace('job-analysis-', ''),
              ...data
            }
          } catch (e) {
            return null
          }
        })
        .filter(Boolean)
      setSavedCards(cards)
    }

    loadSavedCards()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Make API call to analyze job
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobUrl: jobUrl,
          jobContent: jobDescription
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze job')
      }

      // Generate a short ID for the job
      const jobId = Math.random().toString(36).substring(2, 8)

      // Store the analysis data
      const storeResponse = await fetch('/api/job-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          data
        }),
      })

      if (!storeResponse.ok) {
        throw new Error('Failed to save job analysis')
      }

      // Add to saved cards
      const newCard = {
        id: jobId,
        ...data
      }
      setSavedCards(prev => [newCard, ...prev])

      // Clear form
      setJobUrl('')
      setJobDescription('')
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
      setIsLoading(false)
    }
  }

  const handleDelete = (id) => {
    localStorage.removeItem(`job-analysis-${id}`)
    setSavedCards(prev => prev.filter(card => card.id !== id))
  }

  const handleCopy = async (id) => {
    const shareUrl = `https://jwe.in/work?job=${id}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleEdit = (card) => {
    setEditingCard(card.id)
    setEditForm({
      jobTitle: card.jobTitle,
      companyName: card.companyName,
      introText: card.introText,
      bulletPoints: [...card.bulletPoints],
      relevantSkills: [...card.relevantSkills]
    })
  }

  const handleSaveEdit = (id) => {
    // Update localStorage
    const updatedCard = {
      ...savedCards.find(card => card.id === id),
      ...editForm,
      lastEdited: new Date().toISOString()
    }
    localStorage.setItem(`job-analysis-${id}`, JSON.stringify(updatedCard))

    // Update state
    setSavedCards(prev => prev.map(card => 
      card.id === id ? updatedCard : card
    ))

    // Reset edit state
    setEditingCard(null)
    setEditForm(null)
  }

  const handleCancelEdit = () => {
    setEditingCard(null)
    setEditForm(null)
  }

  const handleBulletPointChange = (index, value) => {
    setEditForm(prev => ({
      ...prev,
      bulletPoints: prev.bulletPoints.map((point, i) => 
        i === index ? value : point
      )
    }))
  }

  const handleSkillChange = (index, value) => {
    setEditForm(prev => ({
      ...prev,
      relevantSkills: prev.relevantSkills.map((skill, i) => 
        i === index ? value : skill
      )
    }))
  }

  const handleRegenerate = async (card) => {
    setIsRegenerating(card.id)
    setError('')

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          jobUrl: card.originalUrl,
          jobContent: card.jobContent
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate analysis')
      }

      const data = await response.json()
      
      // Save to localStorage with the existing ID
      const updatedCard = {
        ...data,
        id: card.id,
        originalUrl: card.originalUrl,
        jobContent: card.jobContent,
        createdAt: card.createdAt,
        lastEdited: new Date().toISOString()
      }
      
      localStorage.setItem(`job-analysis-${card.id}`, JSON.stringify(updatedCard))

      // Update state
      setSavedCards(prev => prev.map(c => 
        c.id === card.id ? updatedCard : c
      ))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRegenerating(null)
    }
  }

  return (
    <SimpleLayout>
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
            Create Job Card
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="jobUrl" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Job URL (optional)
              </label>
              <input
                type="url"
                id="jobUrl"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:focus:border-sky-400 dark:focus:ring-sky-400 sm:text-sm bg-white/5 dark:bg-zinc-800/50"
                placeholder="https://example.com/job-posting"
              />
            </div>
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Job Description (paste here if URL doesn't work)
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:focus:border-sky-400 dark:focus:ring-sky-400 sm:text-sm bg-white/5 dark:bg-zinc-800/50"
                placeholder="Paste the job description here..."
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading || (!jobUrl && !jobDescription)}
              className="inline-flex justify-center rounded-md border border-transparent bg-sky-600 dark:bg-sky-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Create Card'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6">
            Saved Cards
          </h2>
          <div className="space-y-4">
            {savedCards.map((card) => (
              <div
                key={card.id}
                className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between items-start">
                  {editingCard === card.id ? (
                    <div className="w-full space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={editForm.companyName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, companyName: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:focus:border-sky-400 dark:focus:ring-sky-400 sm:text-sm bg-white/5 dark:bg-zinc-800/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={editForm.jobTitle}
                          onChange={(e) => setEditForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:focus:border-sky-400 dark:focus:ring-sky-400 sm:text-sm bg-white/5 dark:bg-zinc-800/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Intro Text
                        </label>
                        <textarea
                          value={editForm.introText}
                          onChange={(e) => setEditForm(prev => ({ ...prev, introText: e.target.value }))}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:focus:border-sky-400 dark:focus:ring-sky-400 sm:text-sm bg-white/5 dark:bg-zinc-800/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Bullet Points
                        </label>
                        {editForm.bulletPoints.map((point, index) => (
                          <textarea
                            key={index}
                            value={point}
                            onChange={(e) => handleBulletPointChange(index, e.target.value)}
                            rows={3}
                            className="mt-1 mb-2 block w-full rounded-md border-zinc-300 dark:border-zinc-700 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:focus:border-sky-400 dark:focus:ring-sky-400 sm:text-sm bg-white/5 dark:bg-zinc-800/50"
                          />
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Relevant Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {editForm.relevantSkills.map((skill, index) => (
                            <input
                              key={index}
                              type="text"
                              value={skill}
                              onChange={(e) => handleSkillChange(index, e.target.value)}
                              className="mt-1 block flex-1 min-w-[150px] rounded-md border-zinc-300 dark:border-zinc-700 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:focus:border-sky-400 dark:focus:ring-sky-400 sm:text-sm bg-white/5 dark:bg-zinc-800/50"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(card.id)}
                          className="inline-flex justify-center rounded-md border border-transparent bg-sky-600 dark:bg-sky-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="inline-flex justify-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                        {card.companyName} - {card.jobTitle}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Created: {new Date(card.createdAt).toLocaleDateString()}
                        {card.lastEdited && ` • Edited: ${new Date(card.lastEdited).toLocaleDateString()}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Share URL: jwe.in/work?job={card.id}
                        </p>
                        <button
                          onClick={() => handleCopy(card.id)}
                          className="inline-flex items-center p-1 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                          title="Copy share URL"
                        >
                          {copiedId === card.id ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <ClipboardIconOutline className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!editingCard && (
                    <>
                      <button
                        onClick={() => handleEdit(card)}
                        className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        title="Edit card"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleRegenerate(card)}
                        disabled={isRegenerating === card.id}
                        className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-50 text-sm"
                        title="Regenerate AI analysis"
                      >
                        {isRegenerating === card.id ? (
                          <span className="inline-flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Regenerating...
                          </span>
                        ) : (
                          'Regenerate'
                        )}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
                {!editingCard && (
                  <div className="mt-2">
                    <button
                      onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                      className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
                    >
                      {selectedCard === card.id ? 'Hide details' : 'Show details'}
                    </button>
                    {selectedCard === card.id && (
                      <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                        <p><strong>Original URL:</strong> {card.originalUrl}</p>
                        <p><strong>Intro:</strong> {card.introText}</p>
                        <div>
                          <strong>Bullet Points:</strong>
                          <ul className="list-disc pl-4 mt-1">
                            {card.bulletPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>Relevant Skills:</strong>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {card.relevantSkills.map((skill, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {savedCards.length === 0 && (
              <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">
                No saved cards yet
              </p>
            )}
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
} 