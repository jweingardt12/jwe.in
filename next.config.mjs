
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'tsx', 'mdx'],
  images: {
    unoptimized: true,
    domains: ['substackcdn.com'],
  },
}

export default nextConfig
