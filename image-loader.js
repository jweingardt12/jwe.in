
export default function myImageLoader({ src, width, quality }) {
  if (src.startsWith('/_next')) {
    return src;
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
