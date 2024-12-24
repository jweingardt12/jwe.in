
import withMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],
  images: {
    domains: ['substackcdn.com'],
  },
}

export default withMDX()(nextConfig)
