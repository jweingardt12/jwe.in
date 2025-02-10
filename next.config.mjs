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
    optimizeCss: true,
    serverActions: true,
    mdxRs: true
  },
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      followSymlinks: false,
      ignored: ['**/node_modules', '**/.git', '**/.next']
    }
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/]([^@\\/]+)/)?.[1] || '';
              return `npm.${packageName.replace(/[\\/@]/g, '_')}`;
            },
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            priority: -10
          }
        }
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
