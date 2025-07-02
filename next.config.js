/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
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
  webpack: (config, { isServer, webpack }) => {
    // Only run this on the server
    if (isServer) {
      // Keep these from being bundled
      config.externals = [...(config.externals || []), 'bufferutil', 'utf-8-validate'];
    } else {
      // Provide polyfills for Node.js modules in the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
      };
      
      // Provide Buffer globally
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }
    
    return config;
  }
};

module.exports = nextConfig;
