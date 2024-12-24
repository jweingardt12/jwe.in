
import withMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],
  images: {
    domains: ['substackcdn.com'],
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
  // Enable dynamic rendering for articles routes
  experimental: {
    mdxRs: true
  }
}

export default withMDX()(nextConfig)
