
import imageLoader from './image-loader.js'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
  experimental: {
    mdxRs: true,
  },
}

export default nextConfig
