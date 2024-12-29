
export default function imageLoader({ src, width, quality }) {
  if (src.startsWith('/') || src.startsWith('/_next')) {
    return src
  }
  return src + `?w=${width}&q=${quality || 75}`
}
