/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Vercel-specific optimizations
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  // Enable static optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', '@radix-ui/react-accordion', 'lucide-react']
  },
}

module.exports = nextConfig
