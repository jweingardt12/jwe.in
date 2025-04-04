'use client';

import dynamic from 'next/dynamic';

// Use the new HybridContentRenderer that can handle both HTML and Markdown
const HybridContentRenderer = dynamic(() => import('./HybridContentRenderer'), { ssr: false });

export default function NotesClientContent({ content }) {
  return <HybridContentRenderer content={content} />;
}
