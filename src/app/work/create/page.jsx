'use client'

import { useState, useEffect, useCallback } from 'react'
import { SimpleLayout } from '@/components/SimpleLayout'
import { TldrCard } from '@/components/ui/tldr-card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function CreatePage() {
  const [jobUrl, setJobUrl] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedCards, setSavedCards] = useState([])
  const [filteredCards, setFilteredCards] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCard, setSelectedCard] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [editingCard, setEditingCard] = useState(null)
  const [selectedModel, setSelectedModel] = useState('gpt-4o')
  const [availableModels, setAvailableModels] = useState([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [editedContent, setEditedContent] = useState({
    title: '',
    introText: '',
    bulletPoints: [],
    relevantSkills: []
  })

  const loadAvailableModels = useCallback(async () => {
    setIsLoadingModels(true)
    try {
      const response = await fetch('/api/models')
      if (!response.ok) {
        console.error('Failed to load models:', response.status)
        return
      }

      const data = await response.json()
      if (data.models && Array.isArray(data.models)) {
        // Models are already filtered on the server side
        console.log('Models received from API:', data.models.map(m => m.name));
        setAvailableModels(data.models)
        
        // Check if gpt-4o is available, otherwise keep the current selection
        const gpt4oModel = data.models.find(model => model.id === 'gpt-4o' || model.name.startsWith('GPT-4o'))
        if (gpt4oModel && selectedModel !== gpt4oModel.id) {
          setSelectedModel(gpt4oModel.id)
        }
      }
    } catch (error) {
      console.error('Error loading models:', error)
    } finally {
      setIsLoadingModels(false)
    }
  }, [selectedModel])

  const loadSavedCards = useCallback(async () => {
    try {
      const response = await fetch('/api/job-analysis');
      if (!response.ok) {
        console.error('Failed to load saved cards:', response.status)
        throw new Error('Network response was not ok')
      }
      const data = await response.json();
      console.log('Raw response from Redis:', data)
      
      // Create a Map to ensure unique entries by ID
      const uniqueCards = new Map()
      const now = new Date()
      const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000))

      // Filter and validate cards
      const validCards = data.filter(card => {
        // Basic existence check
        if (!card || !card.id) {
          console.log('Skipping invalid card:', card)
          return false
        }

        // Required fields check
        const requiredFields = ['jobTitle', 'companyName', 'introText', 'bulletPoints', 'relevantSkills']
        const hasAllFields = requiredFields.every(field => {
          const hasField = card[field] !== undefined && card[field] !== null
          if (!hasField) {
            console.log(`Card ${card.id} missing required field: ${field}`)
          }
          return hasField
        })

        if (!hasAllFields) return false

        // Validate date and handle expiration
        try {
          const createdAt = card.createdAt ? new Date(card.createdAt) : new Date()
          if (isNaN(createdAt.getTime())) {
            console.log(`Card ${card.id} has invalid date:`, card.createdAt)
            return false
          }

          // If card is older than 60 days, delete it silently
          if (createdAt < sixtyDaysAgo) {
            console.log(`Card ${card.id} is expired, deleting...`)
            handleDelete(card, true)
            return false
          }

          // Store valid card with ensured createdAt
          uniqueCards.set(card.id, {
            ...card,
            createdAt: createdAt.toISOString()
          })
          return true
        } catch (error) {
          console.error(`Error processing card ${card.id}:`, error)
          return false
        }
      })

      // Sort cards by creation date
      const sortedCards = Array.from(uniqueCards.values()).sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

      console.log('Processed valid cards:', sortedCards.length)
      setSavedCards(sortedCards)
    } catch (error) {
      console.error('Error loading saved cards:', error)
      setSavedCards([])
    }
  }, [])

  useEffect(() => {
    loadSavedCards()
    loadAvailableModels()
  }, [loadSavedCards, loadAvailableModels])

  useEffect(() => {
    // Filter cards based on search query
    const query = searchQuery.toLowerCase()
    const filtered = savedCards.filter(card => 
      card.companyName?.toLowerCase().includes(query) ||
      card.jobTitle?.toLowerCase().includes(query) ||
      card.introText?.toLowerCase().includes(query) ||
      card.title?.toLowerCase().includes(query) ||
      card.relevantSkills?.some(skill => skill.toLowerCase().includes(query))
    )
    setFilteredCards(filtered)
  }, [searchQuery, savedCards])

  const handleEdit = (card) => {
    setEditingCard(card)
    // Parse both title and content from bullet points
    const parsedBulletPoints = card.bulletPoints.map(point => {
      // Updated regex to handle emoji and full title
      const match = point.match(/^\*\*([^*]+)\*\*\s*(.+)$/);
      return match ? {
        title: match[1].trim(),
        content: match[2].replace(/^:\s*/, '').trim() // Remove leading colon if present
      } : {
        title: '',
        content: point.trim()
      };
    });
    
    setEditedContent({
      title: card.title || `✨ TL;DR - Why I'm a Great Fit for ${card.companyName || 'this role'}`,
      introText: card.introText,
      bulletPoints: parsedBulletPoints,
      relevantSkills: [...card.relevantSkills]
    })
    
    // Set the job content in the form for editing
    setJobDescription(card.jobContent || '')
    setJobUrl('') // Clear URL since we're editing existing content
    
    // Set the model if available, otherwise use default
    setSelectedModel(card.model || 'gpt-4o')
    
    // Scroll to the top where the edit form is
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveEdit = async () => {
    setIsLoading(true)
    try {
      // Format bullet points combining titles and content
      const formattedBulletPoints = editedContent.bulletPoints.map(point => {
        // Ensure the title is preserved exactly as is, including emoji
        return `**${point.title}** ${point.content}`;
      });

      const updatedData = {
        id: editingCard.id,
        jobTitle: editingCard.jobTitle,
        companyName: editingCard.companyName,
        title: editedContent.title,
        introText: editedContent.introText,
        bulletPoints: formattedBulletPoints,
        relevantSkills: editedContent.relevantSkills,
        jobContent: jobDescription.trim() || editingCard.jobContent,
        createdAt: editingCard.createdAt,
        updatedAt: new Date().toISOString(),
        model: selectedModel
      };

      // Save to Redis
      const saveResponse = await fetch('/api/job-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: editingCard.id,
          data: updatedData,
          model: selectedModel
        }),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save changes')
      }

      // Update the card in the local state
      setSavedCards(prev => prev.map(card => 
        card.id === editingCard.id ? updatedData : card
      ))

      // Update selectedCard if we're editing it
      if (selectedCard?.id === editingCard.id) {
        setSelectedCard(updatedData)
      }

      setEditingCard(null)
      setEditedContent({
        title: '',
        introText: '',
        bulletPoints: [],
        relevantSkills: []
      })
      setJobDescription('')
      setJobUrl('')
      
      toast.success('Changes saved successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          jobUrl: jobUrl.trim(),
          jobContent: jobDescription.trim(),
          model: selectedModel,
        }),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        throw new Error(`API Error: ${response.status} ${errorText}`)
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze job')
      }

      // Format bullet points preserving full titles with emojis
      const formattedBulletPoints = data.bulletPoints.map((point, index) => {
        const defaultTitles = ['🔍 User-Centric Design', '📊 Data Wizard', '🤖 AI Enthusiast'];
        // Try to extract the title and content, fallback to default if not found
        const match = point.match(/^\*\*([^*]+):*\*\*\s*(.+)$/);
        const title = match ? match[1].trim() : defaultTitles[index];
        const content = match ? match[2].trim() : point.trim();
        return `**${title}** ${content}`;
      });

      // If we're editing, use the existing ID and createdAt
      const jobId = editingCard ? editingCard.id : data.id
      const now = new Date().toISOString()

      const cardData = {
        id: jobId,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        title: data.title,
        introText: data.introText,
        bulletPoints: formattedBulletPoints,
        relevantSkills: data.relevantSkills,
        jobContent: jobDescription.trim(),
        createdAt: editingCard ? editingCard.createdAt : now,
        updatedAt: now
      }

      // Save to Redis
      const saveResponse = await fetch('/api/job-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          data: cardData
        }),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save job analysis')
      }

      // Update local state
      setSelectedCard(cardData)
      setSavedCards(prev => {
        const newCards = prev.filter(c => c.id !== jobId)
        return [cardData, ...newCards]
      })
      
      setJobUrl('')
      setJobDescription('')
      setEditingCard(null)
      toast.success(editingCard ? 'Job analysis updated successfully!' : 'Job analysis created successfully!')
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async (id) => {
    const shareUrl = `${window.location.origin}/work?job=${id}`
    await navigator.clipboard.writeText(shareUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('Share link copied to clipboard!')
  }

  const handleDelete = async (card, silent = false) => {
    if (!card || !card.id) {
      console.error('Invalid card or missing ID:', card)
      if (!silent) {
        toast.error('Cannot delete: invalid card data')
      }
      return
    }

    try {
      console.log('Attempting to delete card with ID:', card.id)
      
      // Remove the card from UI state first for better UX
      setSavedCards(prev => prev.filter(c => c.id !== card.id))
      setFilteredCards(prev => prev.filter(c => c.id !== card.id))
      
      // Clear selectedCard if it was the deleted card
      if (selectedCard?.id === card.id) {
        setSelectedCard(null)
      }

      // Then attempt to delete from backend
      const deleteResponse = await fetch(`/api/job-analysis?id=${encodeURIComponent(card.id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store'
      })

      const responseData = await deleteResponse.text()
      console.log('Delete response:', deleteResponse.status, responseData)

      // If it's a 404, the card is already gone which is fine
      if (deleteResponse.status === 404) {
        console.log('Card was already deleted from backend:', card.id)
        if (!silent) {
          toast.success('Card removed successfully')
        }
        return
      }

      // For other non-200 responses, we should show an error
      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete analysis (${deleteResponse.status})`)
      }

      if (!silent) {
        toast.success('Analysis deleted successfully!')
      }
    } catch (error) {
      console.error('Error:', error)
      // Revert the UI state since deletion failed
      loadSavedCards() // Reload the cards to ensure UI is in sync with backend
      if (!silent) {
        toast.error(error.message || 'Failed to delete analysis')
      }
    }
  }

  const renderCard = (card) => {
    const isEditing = editingCard?.id === card.id

    if (isEditing) {
      return (
        <div className="space-y-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editedContent.title}
              onChange={(e) => setEditedContent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Introduction
            </label>
            <textarea
              value={editedContent.introText}
              onChange={(e) => setEditedContent(prev => ({ ...prev, introText: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-zinc-800 dark:text-white"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bullet Points
            </label>
            {editedContent.bulletPoints.map((point, index) => (
              <div key={index} className="mb-4 space-y-2">
                <input
                  value={point.title}
                  onChange={(e) => {
                    const newPoints = [...editedContent.bulletPoints]
                    newPoints[index] = { ...point, title: e.target.value }
                    setEditedContent(prev => ({ ...prev, bulletPoints: newPoints }))
                  }}
                  className="w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white/5 dark:bg-zinc-800/50 mb-2"
                  placeholder={`Bullet point ${index + 1} title`}
                />
                <textarea
                  value={point.content}
                  onChange={(e) => {
                    const newPoints = [...editedContent.bulletPoints]
                    newPoints[index] = { ...point, content: e.target.value }
                    setEditedContent(prev => ({ ...prev, bulletPoints: newPoints }))
                  }}
                  className="w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white/5 dark:bg-zinc-800/50"
                  rows={2}
                  placeholder={`Bullet point ${index + 1} content`}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Skills
            </label>
            <textarea
              value={editedContent.relevantSkills.join(', ')}
              onChange={(e) => {
                const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                setEditedContent(prev => ({ ...prev, relevantSkills: skills }))
              }}
              className="w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white/5 dark:bg-zinc-800/50"
              rows={2}
              placeholder="Separate skills with commas"
            />
          </div>
        </div>
      )
    }

    return <TldrCard data={card} />
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    
    // Also calculate relative time for tooltip
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    let relativeTime
    if (diffDays === 0) {
      relativeTime = 'Today'
    } else if (diffDays === 1) {
      relativeTime = 'Yesterday'
    } else if (diffDays < 7) {
      relativeTime = `${diffDays} days ago`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      relativeTime = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
    } else {
      const months = Math.floor(diffDays / 30)
      relativeTime = `${months} ${months === 1 ? 'month' : 'months'} ago`
    }
    
    return { formattedDate, relativeTime }
  }

  return (
    <SimpleLayout>
      <div className="space-y-10 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
            {editingCard ? 'Edit Job Card' : 'Create Job Card'}
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
            <div>
              <label htmlFor="modelSelector" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                OpenAI Model
              </label>
              <select
                id="modelSelector"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:focus:border-sky-400 dark:focus:ring-sky-400 sm:text-sm bg-white/5 dark:bg-zinc-800/50"
                disabled={isLoadingModels}
              >
                {isLoadingModels ? (
                  <option>Loading models...</option>
                ) : availableModels.length > 0 ? (
                  <>
                    {/* Show recommended models first */}
                    {availableModels.filter(model => model.isRecommended).length > 0 && (
                      <optgroup label="Recommended Models">
                        {availableModels
                          .filter(model => model.isRecommended)
                          .map(model => (
                            <option key={model.id} value={model.id}>
                              {model.name}{model.description ? ` (${model.description})` : ''}
                            </option>
                          ))}
                      </optgroup>
                    )}
                    
                    {/* Show other models */}
                    {availableModels.filter(model => !model.isRecommended).length > 0 && (
                      <optgroup label="Other Models">
                        {availableModels
                          .filter(model => !model.isRecommended)
                          .map(model => (
                            <option key={model.id} value={model.id}>
                              {model.name}
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </>
                ) : (
                  <>
                    <option value="gpt-4o">GPT-4o (Latest and most capable model)</option>
                    <option value="gpt-4-turbo-preview">GPT-4 Turbo (Powerful with larger context)</option>
                    <option value="gpt-4">GPT-4 (High quality, slower)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast, less accurate)</option>
                  </>
                )}
              </select>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Select the model to use for analysis. GPT-4o is recommended for best results.
              </p>
            </div>
            <div className="flex justify-end gap-4">
              {editingCard && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingCard(null)
                    setJobUrl('')
                    setJobDescription('')
                  }}
                >
                  Cancel Edit
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading || (!jobUrl && !jobDescription)}
                className="inline-flex justify-center"
              >
                {isLoading ? 'Analyzing...' : editingCard ? 'Update Analysis' : 'Create Analysis'}
              </Button>
            </div>
          </form>
          {error && (
            <div className="mt-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {selectedCard && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                Preview
              </h3>
              <div className="flex gap-2">
                {editingCard?.id === selectedCard.id ? (
                  <>
                    <Button
                      onClick={() => {
                        setEditingCard(null)
                        setEditedContent({
                          title: '',
                          introText: '',
                          bulletPoints: [],
                          relevantSkills: []
                        })
                      }}
                      className="inline-flex items-center"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="inline-flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleEdit(selectedCard)}
                    className="inline-flex items-center"
                    variant="outline"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => handleCopyLink(selectedCard.id)}
                  className="inline-flex items-center"
                >
                  {copiedId === selectedCard.id ? 'Copied!' : 'Copy Share Link'}
                </Button>
              </div>
            </div>
            <div className="relative pb-4">
              {editingCard?.id === selectedCard.id ? renderCard(selectedCard) : <TldrCard data={selectedCard} />}
            </div>
          </div>
        )}

        {savedCards.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                Recent Analyses
              </h3>
              <div className="relative w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cards..."
                  className="w-full px-4 py-2 pr-10 text-sm border rounded-md border-zinc-300 dark:border-zinc-700 bg-white/5 dark:bg-zinc-800/50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-16 w-full">
              {(searchQuery ? filteredCards : savedCards).map((card) => (
                <div key={card.id} className="relative pb-16">
                  <div className="mb-8">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-2">
                      <span className="inline-block" title={formatDate(card.createdAt).relativeTime}>
                        Created on {formatDate(card.createdAt).formattedDate}
                      </span>
                      {card.updatedAt && card.updatedAt !== card.createdAt && (
                        <>
                          <span className="text-zinc-300 dark:text-zinc-600">•</span>
                          <span title={formatDate(card.updatedAt).relativeTime}>
                            Updated {formatDate(card.updatedAt).formattedDate}
                          </span>
                        </>
                      )}
                      {card.companyName && (
                        <>
                          <span className="text-zinc-300 dark:text-zinc-600">•</span>
                          <span>{card.companyName}</span>
                        </>
                      )}
                      {card.jobTitle && (
                        <>
                          <span className="text-zinc-300 dark:text-zinc-600">•</span>
                          <span>{card.jobTitle}</span>
                        </>
                      )}
                    </div>
                    {renderCard(card)}
                  </div>
                  <div className="absolute bottom-0 right-0 flex gap-2">
                    {editingCard?.id === card.id ? (
                      <>
                        <Button
                          onClick={() => {
                            setEditingCard(null)
                            setEditedContent({
                              title: '',
                              introText: '',
                              bulletPoints: [],
                              relevantSkills: []
                            })
                          }}
                          className="inline-flex items-center"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveEdit}
                          className="inline-flex items-center"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleDelete(card)}
                          className="inline-flex items-center"
                          variant="outline"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => handleEdit(card)}
                          className="inline-flex items-center"
                          variant="outline"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleCopyLink(card.id)}
                          className="inline-flex items-center"
                        >
                          {copiedId === card.id ? 'Copied!' : 'Copy Share Link'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {searchQuery && filteredCards.length === 0 && (
                <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                  No cards found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SimpleLayout>
  )
} 