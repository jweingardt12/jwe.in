export function formatDate(dateString) {
  if (!dateString) return ''
  
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
} 