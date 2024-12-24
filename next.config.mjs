
/** @type {import('next').NextConfig} */
import rehypePrism from '@mapbox/rehype-prism'
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'substackcdn.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    outputFileTracingIncludes: {
      '/articles/*': ['./src/app/articles/**/*.mdx'],
    },
  }
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX({
  ...nextConfig,
  // Add these settings for static export
  trailingSlash: true,
  images: {
    ...nextConfig.images,
    loader: 'custom',
    loaderFile: './image-loader.js',
  }
})
