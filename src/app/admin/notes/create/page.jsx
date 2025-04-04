'use client'

import { useState, useEffect, useCallback } from 'react'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import OpenPanel from '@/components/analytics/OpenPanel'
import dynamic from 'next/dynamic'

// Dynamically import the WYSIWYG editor to avoid SSR issues
const WysiwygEditor = dynamic(() => import('@/components/WysiwygEditor'), { ssr: false })

export default function AdminCreateNotePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('Jason Weingardt')
  const [tags, setTags] = useState('')
  const [image, setImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedNotes, setSavedNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [editedContent, setEditedContent] = useState({
    title: '',
    content: '',
    description: '',
    author: '',
    tags: '',
    image: ''
  })

  const loadSavedNotes = useCallback(async () => {
    try {
      const response = await fetch('/api/notes');
      if (!response.ok) {
        console.error('Failed to load saved notes:', response.status)
        throw new Error('Network response was not ok')
      }
      const data = await response.json();
      console.log('Raw response from Redis:', data)
      
      // Create a Map to ensure unique entries by ID
      const uniqueNotes = new Map()
      const now = new Date()
      const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000))

      // Filter and validate notes
      const validNotes = data.filter(note => {
        // Basic existence check
        if (!note || !note.id) {
          console.log('Skipping invalid note:', note)
          return false
        }

        // Required fields check
        const requiredFields = ['title', 'content']
        const hasAllFields = requiredFields.every(field => {
          const hasField = note[field] !== undefined && note[field] !== null
          if (!hasField) {
            console.log(`Note ${note.id} missing required field: ${field}`)
          }
          return hasField
        })

        if (!hasAllFields) return false

        // Validate date and handle expiration
        try {
          const createdAt = note.createdAt ? new Date(note.createdAt) : new Date()
          if (isNaN(createdAt.getTime())) {
            console.log(`Note ${note.id} has invalid date:`, note.createdAt)
            return false
          }

          // If note is older than 60 days, delete it silently
          if (createdAt < sixtyDaysAgo) {
            console.log(`Note ${note.id} is expired, deleting...`)
            handleDelete(note, true)
            return false
          }

          // Store valid note with ensured createdAt
          uniqueNotes.set(note.id, {
            ...note,
            createdAt: note.createdAt || createdAt.toISOString(),
          })
          return true
        } catch (dateError) {
          console.error(`Error processing date for note ${note.id}:`, dateError)
          return false
        }
      })

      const notesArray = Array.from(uniqueNotes.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      console.log('Processed notes:', notesArray)
      setSavedNotes(notesArray)
      setFilteredNotes(notesArray)
    } catch (error) {
      console.error('Error loading saved notes:', error)
      toast.error('Failed to load saved notes')
    }
  }, [])

  useEffect(() => {
    loadSavedNotes()
  }, [loadSavedNotes])

  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      const filtered = savedNotes.filter(note => 
        note.title?.toLowerCase().includes(lowercaseQuery) ||
        note.content?.toLowerCase().includes(lowercaseQuery) ||
        note.description?.toLowerCase().includes(lowercaseQuery) ||
        note.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
      setFilteredNotes(filtered)
    } else {
      setFilteredNotes(savedNotes)
    }
  }, [searchQuery, savedNotes])

  const handleEdit = (note) => {
    setEditingNote(note)
    setEditedContent({
      title: note.title || '',
      content: note.content || '',
      description: note.description || '',
      author: note.author || 'Jason Weingardt',
      tags: Array.isArray(note.tags) ? note.tags.join(', ') : note.tags || '',
      image: note.image || ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editingNote) return

    setIsLoading(true)
    setError('')

    try {
      // Process tags if provided
      const processedTags = editedContent.tags
        ? editedContent.tags.split(',').map(tag => tag.trim())
        : []

      const updatedNote = {
        ...editingNote,
        title: editedContent.title,
        content: editedContent.content,
        description: editedContent.description,
        author: editedContent.author,
        tags: processedTags,
        image: editedContent.image,
        updatedAt: new Date().toISOString()
      }

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          noteId: editingNote.id,
          data: updatedNote
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update note')
      }

      // Update the local state
      setSavedNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === editingNote.id ? updatedNote : note
        )
      )

      // If the note was previously published, republish it to update the MDX file
      if (editingNote.published) {
        try {
          console.log('Republishing updated note...')
          const publishResponse = await fetch('/api/publish-note', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              noteId: editingNote.id
            })
          })
          
          if (!publishResponse.ok) {
            console.warn('Failed to republish note, but Redis update succeeded')
          } else {
            console.log('Note republished successfully')
          }
        } catch (publishError) {
          console.error('Error republishing note:', publishError)
          // We don't throw here because the Redis update succeeded
        }
      }

      setEditingNote(null)
      setEditedContent({
        title: '',
        content: '',
        description: '',
        author: '',
        tags: '',
        image: ''
      })

      toast.success('Note updated successfully')
      
      // Track the edit event
      OpenPanel.track('note_edited', {
        noteId: editingNote.id,
        title: updatedNote.title
      })
    } catch (error) {
      console.error('Error updating note:', error)
      setError(error.message || 'Failed to update note')
      toast.error(error.message || 'Failed to update note')
    } finally {
      setIsLoading(false)
    }
  }


  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!title || !content) {
        throw new Error('Title and content are required')
      }

      // Process tags if provided
      const processedTags = tags
        ? tags.split(',').map(tag => tag.trim())
        : []

      // Generate a unique ID for the note
      const noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      const noteData = {
        title,
        content,
        description,
        author,
        tags: processedTags,
        image,
        createdAt: new Date().toISOString()
      }

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          noteId,
          data: noteData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save note')
      }

      // Add the new note to the local state
      const newNote = {
        id: noteId,
        ...noteData
      }

      setSavedNotes(prevNotes => [newNote, ...prevNotes])

      // Reset form
      setTitle('')
      setContent('')
      setDescription('')
      setTags('')
      setImage('')

      toast.success('Note saved successfully')
      
      // Track the creation event
      OpenPanel.track('note_created', {
        noteId,
        title: noteData.title
      })
    } catch (error) {
      console.error('Error saving note:', error)
      setError(error.message || 'Failed to save note')
      toast.error(error.message || 'Failed to save note')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async (note) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/publish-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          noteId: note.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to publish note')
      }

      const data = await response.json()

      // Update the local state
      setSavedNotes(prevNotes =>
        prevNotes.map(n =>
          n.id === note.id ? { ...n, published: true, slug: data.slug, publishedAt: new Date().toISOString() } : n
        )
      )

      toast.success('Note published successfully')
      
      // Track the publish event
      OpenPanel.track('note_published', {
        noteId: note.id,
        title: note.title,
        slug: data.slug
      })
    } catch (error) {
      console.error('Error publishing note:', error)
      setError(error.message || 'Failed to publish note')
      toast.error(error.message || 'Failed to publish note')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnpublish = async (note) => {
    if (!note.published) return;
    
    // Confirm before unpublishing
    const confirmed = window.confirm(`Are you sure you want to unpublish "${note.title}"? This will remove it from your public notes.`);
    if (!confirmed) return;
    
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/unpublish-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          noteId: note.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to unpublish note')
      }

      // Update the local state
      setSavedNotes(prevNotes =>
        prevNotes.map(n =>
          n.id === note.id ? { ...n, published: false, unpublishedAt: new Date().toISOString() } : n
        )
      )

      toast.success('Note unpublished successfully')
      
      // Track the unpublish event
      OpenPanel.track('note_unpublished', {
        noteId: note.id,
        title: note.title
      })
    } catch (error) {
      console.error('Error unpublishing note:', error)
      setError(error.message || 'Failed to unpublish note')
      toast.error(error.message || 'Failed to unpublish note')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = (note) => {
    if (!note.slug) {
      toast.error('Note must be published first')
      return
    }
    
    const url = `${window.location.origin}/notes/${note.slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(note.id)
    setTimeout(() => setCopiedId(null), 2000)
    
    // Track the copy event
    OpenPanel.track('note_link_copied', {
      noteId: note.id,
      title: note.title,
      slug: note.slug
    })
  }

  const handleDelete = async (note, silent = false) => {
    if (!silent) {
      const confirmed = window.confirm(`Are you sure you want to delete "${note.title}"?`)
      if (!confirmed) return
    }

    try {
      const response = await fetch(`/api/notes?id=${note.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete note')
      }

      // Remove the note from the local state
      setSavedNotes(prevNotes => prevNotes.filter(n => n.id !== note.id))

      if (!silent) {
        toast.success('Note deleted successfully')
      }
      
      // Track the delete event if not silent
      if (!silent) {
        OpenPanel.track('note_deleted', {
          noteId: note.id,
          title: note.title
        })
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      if (!silent) {
        toast.error(error.message || 'Failed to delete note')
      }
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return {
          formattedDate: 'Invalid date',
          relativeTime: 'Invalid date'
        }
      }

      // Format the date as Month Day, Year
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })

      // Calculate relative time
      const now = new Date()
      const diffMs = now - date
      const diffSec = Math.floor(diffMs / 1000)
      const diffMin = Math.floor(diffSec / 60)
      const diffHour = Math.floor(diffMin / 60)
      const diffDay = Math.floor(diffHour / 24)

      let relativeTime
      if (diffDay > 30) {
        relativeTime = formattedDate
      } else if (diffDay > 0) {
        relativeTime = `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
      } else if (diffHour > 0) {
        relativeTime = `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
      } else if (diffMin > 0) {
        relativeTime = `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
      } else {
        relativeTime = 'Just now'
      }

      return { formattedDate, relativeTime }
    } catch (error) {
      console.error('Error formatting date:', error)
      return {
        formattedDate: 'Error',
        relativeTime: 'Error'
      }
    }
  }

  return (
    <SimpleLayout
      title="Note Creator"
      intro="Create and manage your notes. You can save drafts, edit existing notes, and publish them to your site."
    >
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
      <div className="space-y-10">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">
            {editingNote ? 'Edit Note' : 'Create New Note'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={editingNote ? editedContent.title : title}
                onChange={(e) => editingNote ? setEditedContent({...editedContent, title: e.target.value}) : setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={editingNote ? editedContent.description : description}
                onChange={(e) => editingNote ? setEditedContent({...editedContent, description: e.target.value}) : setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Author
              </label>
              <input
                type="text"
                id="author"
                value={editingNote ? editedContent.author : author}
                onChange={(e) => editingNote ? setEditedContent({...editedContent, author: e.target.value}) : setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                value={editingNote ? editedContent.tags : tags}
                onChange={(e) => editingNote ? setEditedContent({...editedContent, tags: e.target.value}) : setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-white"
                placeholder="technology, web development, etc."
              />
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Featured Image URL
              </label>
              <input
                type="text"
                id="image"
                value={editingNote ? editedContent.image : image}
                onChange={(e) => editingNote ? setEditedContent({...editedContent, image: e.target.value}) : setImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content * (Rich Text Editor)
              </label>
              <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                <WysiwygEditor
                  value={editingNote ? editedContent.content : content}
                  onChange={(newContent) => editingNote ? setEditedContent({...editedContent, content: newContent}) : setContent(newContent)}
                  height={400}
                />
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              {editingNote ? (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingNote(null)
                      setEditedContent({
                        title: '',
                        content: '',
                        description: '',
                        author: '',
                        tags: '',
                        image: ''
                      })
                    }}
                    className="inline-flex items-center"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveEdit}
                    className="inline-flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button
                  type="submit"
                  className="inline-flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Draft'}
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Saved Notes</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

          {savedNotes.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No saved notes yet. Create your first note above!
            </div>
          ) : (
            <div className="space-y-8">
              {(searchQuery ? filteredNotes : savedNotes).map((note) => (
                <div key={note.id} className="relative pb-16 border-b border-gray-200 dark:border-gray-700 mb-8 last:border-0">
                  <div className="mb-8">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-2 flex-wrap">
                      <span className="inline-block" title={formatDate(note.createdAt).relativeTime}>
                        Created on {formatDate(note.createdAt).formattedDate}
                      </span>
                      {note.updatedAt && note.updatedAt !== note.createdAt && (
                        <>
                          <span className="text-zinc-300 dark:text-zinc-600">•</span>
                          <span title={formatDate(note.updatedAt).relativeTime}>
                            Updated {formatDate(note.updatedAt).relativeTime}
                          </span>
                        </>
                      )}
                      {note.published && (
                        <>
                          <span className="text-zinc-300 dark:text-zinc-600">•</span>
                          <span className="text-green-600 dark:text-green-400">
                            Published
                          </span>
                        </>
                      )}
                      {note.tags && note.tags.length > 0 && (
                        <>
                          <span className="text-zinc-300 dark:text-zinc-600">•</span>
                          <span>
                            {Array.isArray(note.tags) 
                              ? note.tags.join(', ')
                              : typeof note.tags === 'string' 
                                ? note.tags
                                : ''}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                      {note.title}
                    </h3>
                    
                    {note.description && (
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        {note.description}
                      </p>
                    )}
                    
                    <div className="prose dark:prose-invert prose-sm max-w-none line-clamp-3">
                      {note.content.substring(0, 200)}...
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 right-0 flex gap-2 flex-wrap justify-end">
                    {editingNote?.id === note.id ? (
                      <>
                        <Button
                          onClick={() => {
                            setEditingNote(null)
                            setEditedContent({
                              title: '',
                              content: '',
                              description: '',
                              author: '',
                              tags: '',
                              image: ''
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
                          onClick={() => handleDelete(note)}
                          className="inline-flex items-center"
                          variant="outline"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => handleEdit(note)}
                          className="inline-flex items-center"
                          variant="outline"
                        >
                          Edit
                        </Button>
                        {note.published ? (
                          <>
                            <Button
                              onClick={() => handleCopyLink(note)}
                              className="inline-flex items-center"
                            >
                              {copiedId === note.id ? 'Copied!' : 'Copy Link'}
                            </Button>
                            <Button
                              onClick={() => handleUnpublish(note)}
                              className="inline-flex items-center bg-amber-600 hover:bg-amber-700"
                              disabled={isLoading}
                            >
                              {isLoading ? 'Processing...' : 'Unpublish'}
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handlePublish(note)}
                            className="inline-flex items-center"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Publishing...' : 'Publish'}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              
              {searchQuery && filteredNotes.length === 0 && (
                <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                  No notes found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SimpleLayout>
  )
}
