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
  webpack: (config, { isServer, dev }) => {
    // Optimize build trace collection
    if (!dev) {
      config.optimization.moduleIds = 'deterministic'
      config.optimization.chunkIds = 'deterministic'
    }
    // Strict file watching and pattern matching
    config.snapshot = {
      managedPaths: [/^(.+?[\\/]node_modules[\\/])/, /^(.+?[\\/]src[\\/])/],
      immutablePaths: [],
      buildDependencies: {
        hash: true,
        timestamp: true
      }
    }

    // Optimize file watching
    config.watchOptions = {
      followSymlinks: false,
      ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**']
    }

    // Optimize module resolution
    config.resolve.symlinks = false
    config.resolve.preferRelative = true

    // Handle OpenTelemetry warnings
    config.module.rules.push({
      test: /node_modules\/@opentelemetry/,
      sideEffects: false
    })

    if (!isServer) {
      // Don't bundle server-only modules on client-side
      config.resolve.fallback = {
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

    // Optimize build traces collection
    if (isServer) {
      config.optimization.moduleIds = 'named'
    }

    return config
  },
  // Add output configuration to reduce build trace complexity
  output: 'standalone',
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
