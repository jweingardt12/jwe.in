import rehypePrism from '@mapbox/rehype-prism'
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  experimental: {
    outputFileTracingIncludes: {
      '/articles/*': ['./src/app/articles/**/*.mdx'],
    },
  },
  images: {
    domains: ['substackcdn.com'],
  },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['substackcdn.com'],
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig)
