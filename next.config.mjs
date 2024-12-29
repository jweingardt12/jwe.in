
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
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  output: 'standalone',
  experimental: {
    optimizeCss: true,
    webpackBuildWorker: false,
    typedRoutes: false
  },
  swcMinify: true,
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    config.cache = false
    config.output = {
      ...config.output,
      clean: true
    }
    return config
  },
  // Add hostname binding
  hostname: '0.0.0.0',
  port: 3000
}

export default withMDX(nextConfig)
