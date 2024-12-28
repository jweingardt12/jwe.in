
export default function imageLoader({ src, width, quality }) {
  if (src.startsWith('/_next/static/media/')) {
    return src;
  }
  return `${src}?w=${width}&q=${quality || 75}`;
}
