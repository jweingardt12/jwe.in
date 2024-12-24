
import withMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { 
    unoptimized: true,
    domains: ['substackcdn.com'],
  },
  trailingSlash: true,
  staticPageGenerationTimeout: 120,
  pageExtensions: ['js', 'jsx', 'mdx'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      }
    }
    return config
  },
  experimental: {
    appDir: true,
  }
}

export default withMDX()(nextConfig)
