
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'tsx', 'mdx'],
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
  output: 'standalone'
}

export default nextConfig
