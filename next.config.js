/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  experimental: {
    // Enable the standalone output mode
    outputStandalone: true,
  },
  // Add WebSocket polyfill
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      // This ensures the ws module is bundled with the server code
      config.externals = [...config.externals, 'bufferutil', 'utf-8-validate'];
    }
    return config;
  },
};

module.exports = nextConfig;
