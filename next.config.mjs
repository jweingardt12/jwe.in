
import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ['cdn.arstechnica.net', 'cdn.vox-cdn.com'],
    loader: 'custom',
    loaderFile: './image-loader.js',
    unoptimized: false,
  },
}

export default withMDX(nextConfig)
