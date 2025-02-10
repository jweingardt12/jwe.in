/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['ws']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('ws')
    }
    return config
  }
}

module.exports = nextConfig
