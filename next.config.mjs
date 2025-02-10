import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx', 'md'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      }
    ]
  },
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/themes']
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: false
    }
    return config
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  poweredByHeader: false
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
})

export default withMDX(nextConfig)
