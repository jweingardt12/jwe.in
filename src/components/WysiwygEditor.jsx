'use client';

import { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';

export default function WysiwygEditor({ value, onChange, height = 500 }) {
  const editorRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Handle theme changes
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      // Apply theme changes if editor is initialized
      if (editor.editor) {
        editor.editor.setContent(editor.editor.getContent());
      }
    }
  }, [resolvedTheme]);

  return (
    <Editor
      apiKey="no-api-key" // You can get a free API key from TinyMCE
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={onChange}
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
        // Enable automatic conversion from Markdown
        paste_enable_default_filters: true,
        paste_data_images: true,
        // Add custom CSS for better integration with your site
        content_css: isDark ? 'dark' : 'default',
        // Add custom CSS for better integration with your site
        setup: (editor) => {
          editor.on('change', () => {
            onChange(editor.getContent());
          });
        }
      }}
    />
  );
}
