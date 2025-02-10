'use client'

import { Card } from './Card'
import { formatDate } from '../lib/formatDate'
import Image from 'next/image'

export function NoteCard({ article }) {
  console.log('Rendering NoteCard with article:', JSON.stringify(article, null, 2))

  const handleNoteClick = () => {
    window.umami?.track('note_click', {
      title: article.title,
      slug: article.slug
    })
  }

  return (
    <Card as="article" className="md:grid md:grid-cols-4 md:items-baseline">
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>

      <div className="md:col-span-3">
        <div className="flex gap-6">
          <div className="flex-1">
            <Card.Title 
              href={`/notes/${article.slug}`}
              onClick={handleNoteClick}
              className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 hover:text-sky-500 dark:hover:text-sky-500"
            >
              {article.title}
            </Card.Title>
            
            {article.image && (
              <div className="relative w-96 h-48 mt-4 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 24rem, 24rem"
                />
              </div>
            )}
            
            <Card.Description className="prose dark:prose-invert">{article.description}</Card.Description>
            
            <div className="flex items-center mt-4">
              <Card.Cta>Read note</Card.Cta>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
