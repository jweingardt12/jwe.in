import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx', 'md'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'http',
        hostname: '*',
      },
    ],
    unoptimized: false
  },
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/themes', '@radix-ui/react-icons', 'lucide-react'],
    optimizeCss: true
  },
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      followSymlinks: false,
      ignored: ['**/node_modules', '**/.git', '**/.next']
    }

    if (!isServer) {
      // Don't bundle server-only modules on client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        'redis-parser': false
      }
    }

    return config
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  poweredByHeader: false,
  compress: true
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
})

export default withMDX(nextConfig)
