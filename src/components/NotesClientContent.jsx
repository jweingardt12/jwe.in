'use client';

import dynamic from 'next/dynamic';

const MDXContent = dynamic(() => import('./MDXContent'), { ssr: false });

export default function NotesClientContent({ content }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXContent content={content} />
    </div>
  );
}
