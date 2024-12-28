
module.exports = function imageLoader({ src, width }) {
  if (src.startsWith('/_next')) {
    return src;
  }
  return `${src}?w=${width}`;
}
