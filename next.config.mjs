
import withMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['substackcdn.com'],
  },
  pageExtensions: ['js', 'jsx', 'mdx'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      }
    }
    return config
  }
}

export default withMDX()(nextConfig)
