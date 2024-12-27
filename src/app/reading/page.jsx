
import { SimpleLayout } from '@/components/SimpleLayout'

export const metadata = {
  title: 'Reading',
  description: 'Recently liked articles, displayed in descending order.',
}

export default function ReadingPage() {
  const articles = [
    {
      id: '1',
      title: 'Crafting Better Code',
      href: 'https://example.com/article1',
      description: 'A deep dive into software architecture patterns and their practical applications.',
      publicationName: 'Dev Weekly',
      dateDisplay: 'Dec 24, 2023',
      dateISO: '2023-12-24',
      imageUrl: 'https://via.placeholder.com/256?text=Article+1'
    },
    {
      id: '2',
      title: 'The Future of Web Development',
      href: 'https://example.com/article2',
      description: 'Exploring upcoming trends and technologies shaping the web development landscape.',
      publicationName: 'Tech Insights',
      dateDisplay: 'Dec 23, 2023',
      dateISO: '2023-12-23',
      imageUrl: 'https://via.placeholder.com/256?text=Article+2'
    }
  ]

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl dark:text-zinc-100">Reading</h2>
          <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Articles I've enjoyed reading recently.
          </p>
          <div className="mt-10 space-y-16 border-t border-gray-200 pt-10 dark:border-gray-700">
            {articles.map((article) => (
              <article key={article.id} className="flex max-w-xl flex-col items-start">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={article.dateISO} className="text-gray-500">
                    {article.dateDisplay}
                  </time>
                  <span className="text-gray-500">{article.publicationName}</span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-zinc-800 dark:text-zinc-100">
                    <a href={article.href} target="_blank" rel="noopener noreferrer">
                      <span className="absolute inset-0" />
                      {article.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{article.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
