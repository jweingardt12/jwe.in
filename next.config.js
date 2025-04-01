/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  // Specifically for Vercel deployment
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark ws as external to prevent bundling issues
      config.externals = [...(config.externals || []), 'bufferutil', 'utf-8-validate', 'ws'];
    }
    
    // Add a fallback for the ws module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      ws: false,
    };
    
    return config;
  },
  // Explicitly set the target for Vercel
  target: 'serverless',
};

module.exports = nextConfig;
