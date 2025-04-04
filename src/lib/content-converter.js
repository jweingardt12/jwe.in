/**
 * Utility functions to handle conversion between HTML and Markdown
 * This helps maintain backward compatibility with existing notes
 */

// Simple function to detect if content is HTML
export function isHtml(content) {
  if (!content || typeof content !== 'string') return false;
  // Check for common HTML tags
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

// Function to sanitize HTML content (basic implementation)
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  
  // Remove potentially dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, 'removed:');
}

// Function to get plain text from HTML (for excerpts)
export function getPlainTextFromHtml(html, maxLength = 200) {
  if (!html || typeof html !== 'string') return '';
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Get text content
  let text = tempDiv.textContent || tempDiv.innerText || '';
  
  // Trim and limit length
  text = text.trim();
  if (maxLength && text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }
  
  return text;
}
