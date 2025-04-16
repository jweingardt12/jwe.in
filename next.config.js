/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  experimental: {
    turbo: true,
  },
  // Configure image domains for static generation
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    // Only run this on the server
    if (isServer) {
      // Keep these from being bundled
      config.externals = [...(config.externals || []), 'bufferutil', 'utf-8-validate'];
    }
    
    return config;
  }
};

module.exports = nextConfig;
