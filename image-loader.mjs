
export default function imageLoader({ src, width }) {
  if (src.startsWith('/_next/static/media/')) {
    return src;
  }
  return `${src}?w=${width}`;
}
