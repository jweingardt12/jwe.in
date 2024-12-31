'use client'

import { Card } from '@/components/Card'
import { formatDate } from '@/lib/formatDate'
import Image from 'next/image'

export function NoteCard({ article }) {
  const handleNoteClick = () => {
    window.umami?.track('note_click', {
      title: article.title,
      slug: article.slug
    })
  }

  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
      <div className="md:col-span-3">
        <Card>
          {/* Mobile Layout */}
          <div className="flex flex-col md:hidden">
            <Card.Title 
              href={`/notes/${article.slug}`}
              onClick={handleNoteClick}
              className="text-zinc-800 dark:text-zinc-100 hover:text-sky-500 dark:hover:text-sky-500"
            >
              {article.title}
            </Card.Title>
            <Card.Eyebrow
              as="time"
              dateTime={article.date}
              className="mt-2 mb-4"
            >
              {formatDate(article.date)}
            </Card.Eyebrow>
            {article.image && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <Card.Description>{article.description}</Card.Description>
            <Card.Cta>Read article</Card.Cta>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex md:justify-between">
            <div className="flex-1">
              <Card.Title 
                href={`/notes/${article.slug}`}
                onClick={handleNoteClick}
                className="text-zinc-800 dark:text-zinc-100 hover:text-sky-500 dark:hover:text-sky-500"
              >
                {article.title}
              </Card.Title>
              <Card.Description>{article.description}</Card.Description>
              <Card.Cta>Read article</Card.Cta>
            </div>
            {article.image && (
              <div className="relative w-48 aspect-square rounded-lg overflow-hidden shrink-0 ml-6">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </article>
  )
} 