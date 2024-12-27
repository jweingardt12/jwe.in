
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'tsx', 'mdx'],
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['substackcdn.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // This enables static export for dynamic routes
    staticPageGenerationTimeout: 300
  }
}

export default nextConfig
