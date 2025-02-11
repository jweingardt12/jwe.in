import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
// Patterns to ignore during trace collection
const traceIgnores = [
  '**/node_modules/**',
  '**/.git/**',
  '**/.next/**',
  '**/cache/**',
  '**/*.test.*',
  '**/__tests__/**',
];

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx', 'md'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      }
    ],
  },
  swcMinify: true,
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = ['ws', 'next-ws', '@upstash/redis'];
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['ws', 'next-ws', '@upstash/redis'],
    optimizePackageImports: ['@radix-ui/themes'],
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  staticPageGenerationTimeout: 120,
  traceIncludes: {
    production: ['**/*.{js,jsx,ts,tsx}'],
  },
  traceIgnores: traceIgnores,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  optimizeFonts: false
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  }
})

export default withMDX(nextConfig)
