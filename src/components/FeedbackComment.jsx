'use client';

import { useState, useRef, useEffect } from 'react';
import { BugAntIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

export function FeedbackComment() {
  const [isActive, setIsActive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [type, setType] = useState('feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boundingBox, setBoundingBox] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const boxRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const handleToggle = () => {
      const newIsActive = !isActive;
      setIsActive(newIsActive);
      setShowForm(false);
      document.body.style.cursor = newIsActive ? 'crosshair' : 'default';
    };

    window.addEventListener('toggle-feedback', handleToggle);
    return () => {
      window.removeEventListener('toggle-feedback', handleToggle);
      document.body.style.cursor = 'default';
    };
  }, [isActive]);

  const handleClick = (e) => {
    if (!isActive || showForm) return;

    // Get click position relative to viewport
    const x = e.clientX;
    const y = e.clientY;

    // Set form position
    setPosition({ x, y });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          feedback,
          type,
          url: window.location.href,
          position,
          boundingBox: boundingBox ? {
            x: boundingBox.x,
            y: boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
          } : null,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: 'Thank you!',
        description: 'Your feedback has been submitted.',
      });
      setEmail('');
      setFeedback('');
      setShowForm(false);
      setIsActive(false);
      document.body.style.cursor = 'default';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startBoundingBox = () => {
    setIsDrawing(true);
    document.body.style.cursor = 'crosshair';
    // Add event listeners to document
    document.addEventListener('mousedown', startDrawing);
    document.addEventListener('mousemove', updateDrawing);
    document.addEventListener('mouseup', endDrawing);
  };

  const cancelBoundingBox = () => {
    setIsDrawing(false);
    document.body.style.cursor = 'default';
    // Remove event listeners
    document.removeEventListener('mousedown', startDrawing);
    document.removeEventListener('mousemove', updateDrawing);
    document.removeEventListener('mouseup', endDrawing);
    // Remove box if it exists
    if (boxRef.current) {
      boxRef.current.remove();
      boxRef.current = null;
    }
  };

  const startDrawing = (e) => {
    if (!isDrawing) return;
    
    // Get click position relative to viewport
    const x = e.clientX;
    const y = e.clientY;
    
    startPos.current = { x, y };
    
    // Create box element if it doesn't exist
    if (!boxRef.current) {
      const box = document.createElement('div');
      box.style.position = 'fixed';
      box.style.border = '2px solid #3b82f6';
      box.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      box.style.pointerEvents = 'none';
      box.style.zIndex = '9999';
      document.body.appendChild(box);
      boxRef.current = box;
    }
    
    boxRef.current.style.left = `${x}px`;
    boxRef.current.style.top = `${y}px`;
    boxRef.current.style.width = '0';
    boxRef.current.style.height = '0';
  };

  const updateDrawing = (e) => {
    if (!isDrawing || !boxRef.current) return;
    
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const width = currentX - startPos.current.x;
    const height = currentY - startPos.current.y;
    
    boxRef.current.style.width = `${Math.abs(width)}px`;
    boxRef.current.style.height = `${Math.abs(height)}px`;
    boxRef.current.style.left = `${width < 0 ? currentX : startPos.current.x}px`;
    boxRef.current.style.top = `${height < 0 ? currentY : startPos.current.y}px`;
  };

  const endDrawing = () => {
    if (!isDrawing || !boxRef.current) return;
    
    // Save bounding box dimensions
    const rect = boxRef.current.getBoundingClientRect();
    setBoundingBox({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });
    
    // Remove box element
    boxRef.current.remove();
    boxRef.current = null;
    
    setIsDrawing(false);
    setShowForm(true);
  };

  return (
    <>
      {isActive && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/5 transition-colors duration-300 pointer-events-none"
            onClick={handleClick}
            style={{ cursor: 'crosshair' }}
          >
            <div className="w-full h-full pointer-events-auto" onClick={handleClick} />
          </div>
          <button
            onClick={() => {
              setIsActive(false);
              setShowForm(false);
              setBoundingBox(null);
              setFeedback('');
              document.body.style.cursor = 'default';
            }}
            className="fixed right-4 top-4 z-[100] flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white hover:text-gray-900 dark:bg-zinc-800/90 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-gray-100 pointer-events-auto"
          >
            <XMarkIcon className="h-4 w-4" />
            Exit Feedback Mode
          </button>
        </>
      )}

      {showForm && (
        <div
          ref={formRef}
          className="fixed z-[100] w-96 rounded-lg border bg-white p-6 shadow-xl dark:bg-zinc-900 animate-zoom-in pointer-events-auto"
          style={{
            left: `${Math.min(Math.max(position.x, 220), window.innerWidth - 220)}px`,
            top: position.y < window.innerHeight / 2 
              ? `${Math.max(position.y + 20, 20)}px` 
              : `${Math.min(position.y - 20, window.innerHeight - 20)}px`,
            transform: position.y < window.innerHeight / 2 
              ? 'translate(-50%, 0)' 
              : 'translate(-50%, -100%)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Share Your Thoughts</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Help me improve the site</p>
            </div>

            <div className="flex gap-2 p-1 bg-zinc-100/50 rounded-lg dark:bg-zinc-800/50">
              <button
                type="button"
                onClick={() => setType('feedback')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  type === 'feedback'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-zinc-800/50'
                }`}
              >
                Feedback
              </button>
              <button
                type="button"
                onClick={() => setType('bug')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  type === 'bug'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-zinc-800 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-zinc-800/50'
                }`}
              >
                Bug Report
              </button>
            </div>

            {boundingBox && (
              <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Selected area: {Math.round(boundingBox.width)}×{Math.round(boundingBox.height)}px
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                id="email"
                className="w-full rounded-md border-0 bg-white/50 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200 ease-spring hover:bg-white dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:hover:bg-zinc-800 sm:text-sm"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="feedback" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={type === 'bug' ? 'Describe the issue...' : 'What\'s on your mind?'}
                id="feedback"
                className="w-full rounded-md border-0 bg-white/50 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200 ease-spring hover:bg-white dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:hover:bg-zinc-800 sm:text-sm"
                required
                disabled={isSubmitting}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEmail('');
                  setFeedback('');
                }}
                disabled={isSubmitting}
                className="transition-all duration-200 ease-spring hover:scale-105 active:scale-95 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 ease-spring hover:scale-105 active:scale-95 hover:shadow-md"
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>

          <div className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform border-b border-r bg-white dark:bg-zinc-900" />
        </div>
      )}
    </>
  );
}
