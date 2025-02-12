'use client'

import { useState, useEffect } from 'react'
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
  const [selectedCard, setSelectedCard] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [editingCard, setEditingCard] = useState(null)
  const [editedContent, setEditedContent] = useState({
    title: '',
    introText: '',
    bulletPoints: [],
    relevantSkills: []
  })

  const loadSavedCards = async () => {
    try {
      const response = await fetch('/api/job-analysis')
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded cards from Redis:', data.map(card => ({ id: card.id, createdAt: card.createdAt })))
        
        // Create a Map to ensure unique entries by ID
        const uniqueCards = new Map()
        data.forEach(card => {
          // Only include cards that have all required data
          if (card && 
              card.id && 
              card.jobTitle && 
              card.companyName && 
              card.introText && 
              card.bulletPoints && 
              card.relevantSkills) {
            // Ensure createdAt exists and is valid
            const createdAt = card.createdAt || new Date().toISOString()
            uniqueCards.set(card.id, {
              ...card,
              createdAt // Ensure createdAt exists
            })
          }
        })

        // Convert Map back to array and sort by createdAt
        const validCards = Array.from(uniqueCards.values())
        const sortedData = validCards.sort((a, b) => {
          // Parse dates, fallback to 0 if invalid
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA // Sort newest to oldest
        })
        
        console.log('Sorted cards by date:', sortedData.map(card => ({
          id: card.id,
          createdAt: card.createdAt,
          date: new Date(card.createdAt).toLocaleString()
        })))
        
        setSavedCards(sortedData)
      }
    } catch (error) {
      console.error('Error loading saved cards:', error)
      setSavedCards([])
    }
  }

  useEffect(() => {
    loadSavedCards()
  }, [])

  const handleEdit = (card) => {
    setEditingCard(card)
    // Parse both title and content from bullet points
    const parsedBulletPoints = card.bulletPoints.map(point => {
      const match = point.match(/^\*\*([^*]+):\*\*\s*(.+)$/);
      return match ? {
        title: match[1].trim(),
        content: match[2].trim()
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
  }

  const handleSaveEdit = async () => {
    setIsLoading(true)
    try {
      // Format bullet points combining titles and content
      const formattedBulletPoints = editedContent.bulletPoints.map(point => {
        return `**${point.title}:** ${point.content}`;
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
        createdAt: editingCard.createdAt
      };

      // Save to Redis
      const saveResponse = await fetch('/api/job-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: editingCard.id,
          data: updatedData
        }),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save changes')
      }

      // Update the card in the local state
      setSavedCards(prev => prev.map(card => 
        card.id === editingCard.id ? updatedData : card
      ))

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
      
      // Add a small delay before refreshing to ensure Redis replication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Refresh the saved cards list
      await loadSavedCards()
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

      // Format bullet points to use single colon
      const formattedBulletPoints = data.bulletPoints.map((point, index) => {
        const titles = ['📱 Mobile', '🧠 AI/ML', '📈 Growth'];
        const title = point.match(/^\*\*([^*]+):+\*\*/)?.[1] || titles[index];
        const content = point.replace(/^\*\*[^*]+:+\*\*\s*/, '').trim();
        return `**${title}:** ${content}`;
      });

      // If we're editing, use the existing ID
      const jobId = editingCard ? editingCard.id : data.id

      // Save to Redis
      const saveResponse = await fetch('/api/job-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          data: {
            id: jobId,
            jobTitle: data.jobTitle,
            companyName: data.companyName,
            title: data.title,
            introText: data.introText,
            bulletPoints: formattedBulletPoints,
            relevantSkills: data.relevantSkills,
            jobContent: jobDescription.trim(),
            createdAt: editingCard ? editingCard.createdAt : new Date().toISOString(),
          },
        }),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save job analysis')
      }

      // Update local state and refresh saved cards
      setSelectedCard(data)
      setJobUrl('')
      setJobDescription('')
      setEditingCard(null)
      toast.success(editingCard ? 'Job analysis updated successfully!' : 'Job analysis created successfully!')
      
      // Add a small delay before refreshing to ensure Redis replication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Refresh the saved cards list
      await loadSavedCards()
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

  const handleDelete = async (card) => {
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return
    }

    try {
      console.log('Attempting to delete card with ID:', card.id)
      // Attempt to delete the card
      const deleteResponse = await fetch(`/api/job-analysis?id=${card.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const responseData = await deleteResponse.json()
      console.log('Delete response:', { status: deleteResponse.status, data: responseData })

      // If we get a 404 or success, remove from UI
      if (deleteResponse.status === 404 || deleteResponse.ok) {
        setSavedCards(prev => prev.filter(c => c.id !== card.id))
        toast.success('Analysis deleted successfully!')
        // Refresh the list to ensure we're in sync with Redis
        await loadSavedCards()
      } else {
        throw new Error(responseData.error || 'Failed to delete job analysis')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message)
      // Refresh the list to ensure UI is in sync
      await loadSavedCards()
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
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
              Preview
            </h3>
            <div className="relative pb-16">
              <TldrCard data={selectedCard} />
              <div className="absolute -bottom-4 right-0">
                <Button
                  onClick={() => handleCopyLink(selectedCard.id)}
                  className="inline-flex items-center"
                >
                  {copiedId === selectedCard.id ? 'Copied!' : 'Copy Share Link'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {savedCards.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
              Recent Analyses
            </h3>
            <div className="space-y-16 w-full">
              {savedCards.map((card) => (
                <div key={card.id} className="relative pb-16">
                  <div className="mb-8">
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
            </div>
          </div>
        )}
      </div>
    </SimpleLayout>
  )
} 