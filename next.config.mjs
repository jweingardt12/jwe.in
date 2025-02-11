import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
        '.git',
        'node_modules/sharp',
        '**/*.md',
        '**/*.map'
      ]
    },
    optimizeCss: {
      enabled: true
    },
    turbotrace: {
      memoryLimit: 4096
    },
    serverComponentsExternalPackages: ['ws', '@upstash/redis']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('ws');
    }
    return config;
  },
  swcMinify: true,
  compress: true,
  generateBuildId: () => 'build',
  typescript: {
    ignoreBuildErrors: true
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx', 'md'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  staticPageGenerationTimeout: 180,
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

export default withMDX(nextConfig);
