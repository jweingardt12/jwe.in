import Link from 'next/link'
import Image from 'next/image'
import { Container } from './Container'
import { Prose } from './Prose'
import { formatDate } from '../lib/formatDate'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="mt-4">{children}</p>,
    [BLOCKS.HEADING_1]: (node, children) => <h1 className="mt-6 text-2xl font-bold">{children}</h1>,
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="mt-6 text-xl font-bold">{children}</h2>,
    [BLOCKS.HEADING_3]: (node, children) => <h3 className="mt-6 text-lg font-bold">{children}</h3>,
    [BLOCKS.UL_LIST]: (node, children) => <ul className="mt-2 list-disc pl-4">{children}</ul>,
    [BLOCKS.OL_LIST]: (node, children) => <ol className="mt-2 list-decimal pl-4">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node, children) => <li className="mt-0.5">{children}</li>,
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="mt-6 border-l-2 border-zinc-300 pl-6 italic">{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-zinc-300 dark:border-zinc-700" />,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { title, description, file } = node.data.target.fields;
      return (
        <div className="my-8 rounded-lg overflow-hidden aspect-[3/2] relative">
          <Image
            src={`https:${file.url}`}
            alt={description || title}
            fill
            className="object-cover"
          />
        </div>
      );
    },
    [INLINES.HYPERLINK]: (node, children) => (
      <a href={node.data.uri} className="text-sky-500 hover:text-sky-600" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: text => <strong className="font-semibold">{text}</strong>,
    [MARKS.ITALIC]: text => <em className="italic">{text}</em>,
    [MARKS.CODE]: text => <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">{text}</code>,
    [MARKS.UNDERLINE]: text => <u className="underline">{text}</u>,
  },
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4 stroke-zinc-400 transition group-hover:stroke-zinc-600 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400">
      <path d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ArticleLayout({ article, children }) {
  return (
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/notes"
            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0"
            aria-label="Go back to notes"
          >
            <ArrowLeft />
          </Link>
          <article>
            <header className="flex flex-col">
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                {article.title}
              </h1>
              <time
                dateTime={article.date}
                className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
              >
                <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                <span className="ml-3">{formatDate(article.date)}</span>
              </time>
            </header>
            {article.image && (
              <div className="relative w-full mt-8 rounded-lg overflow-hidden aspect-[3/2]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <Prose className="mt-8" data-mdx-content>
              {article.content ? (
                typeof article.content === 'string' ? (
                  <p>{article.content}</p>
                ) : (
                  documentToReactComponents(article.content, options)
                )
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">
                  Content not available
                </p>
              )}
            </Prose>
          </article>
        </div>
      </div>
    </Container>
  )
}
