
export default function myImageLoader({ src, width, quality }) {
  if (src.startsWith('/_next/static/media/')) {
    return src;
  }
  // For external images, we can return the src directly
  if (src.startsWith('http')) {
    return src;
  }
  // For local images, append width and quality
  return `${src}?w=${width}&q=${quality || 75}`;
}
