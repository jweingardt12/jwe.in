'use client';

import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

// Create a component that will load TinyMCE only on the client side
export default function WysiwygEditor({ value, onChange, height = 500 }) {
  const editorRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [Editor, setEditor] = useState(null);

  // Load the editor dynamically only on the client side
  useEffect(() => {
    // Import TinyMCE editor only on client side
    import('@tinymce/tinymce-react').then(({ Editor }) => {
      setEditor(() => Editor);
      setEditorLoaded(true);
    });
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.editor) {
      const editor = editorRef.current.editor;
      // Apply theme changes if editor is initialized
      editor.setContent(editor.getContent());
    }
  }, [resolvedTheme]);

  if (!editorLoaded || !Editor) {
    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 bg-gray-100 dark:bg-gray-800" style={{ height }}>
        <div className="animate-pulse flex space-x-4 items-center justify-center h-full">
          <span className="text-gray-500 dark:text-gray-400">Loading editor...</span>
        </div>
      </div>
    );
  }

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // Using API key from environment variables
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      initialValue={value}
      value={value}
      onEditorChange={(newContent) => {
        onChange(newContent);
      }}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: `body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 16px; ${isDark ? 'background-color: #27272a; color: #fff;' : ''} }`,
        skin: isDark ? 'oxide-dark' : 'oxide',
        content_css: isDark ? 'dark' : 'default',
        branding: false,
        promotion: false,
        paste_enable_default_filters: true,
        paste_data_images: true,
        setup: (editor) => {
          editor.on('change', () => {
            onChange(editor.getContent());
          });
        }
      }}
    />
  );
}
