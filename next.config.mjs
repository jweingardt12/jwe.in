import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'
import withTM from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
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
    // Handle server-side externals
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'ws',
        'next-ws',
        '@upstash/redis'
      ];
    } else {
      // Client-side polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        async_hooks: false,
        buffer: false,
        stream: false,
        crypto: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
    }

    // Handle CSS files
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use));

    rules.forEach((rule) => {
      rule.use.forEach((moduleLoader) => {
        if (
          moduleLoader.loader?.includes('css-loader') &&
          !moduleLoader.loader?.includes('postcss-loader')
        ) {
          moduleLoader.options.modules.exportLocalsConvention = 'camelCase';
        }
      });
    });

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

const withConfig = withTM(['ws', 'next-ws']);
export default withMDX(withConfig(nextConfig));
