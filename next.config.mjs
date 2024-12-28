
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],
  images: {
    loader: 'custom',
    loaderFile: './image-loader.mjs',
    domains: ['cdn.arstechnica.net', 'cdn.vox-cdn.com'],
    unoptimized: process.env.NODE_ENV === 'development'
  }
}

export default nextConfig
