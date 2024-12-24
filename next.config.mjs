
import withMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  pageExtensions: ['js', 'jsx', 'mdx'],
  images: {
    unoptimized: true,
    domains: ['substackcdn.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      }
    }
    return config
  },
}

export default withMDX()(nextConfig)
