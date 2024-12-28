
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],
  images: {
    domains: ['cdn.arstechnica.net', 'cdn.vox-cdn.com'],
  },
  experimental: {
    mdxRs: true,
  },
}

export default withMDX(nextConfig)
