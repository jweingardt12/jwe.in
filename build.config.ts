import { defineConfig } from '@vercel/build'

export default defineConfig({
  buildCommand: 'pnpm run build',
  cleanUrls: true,
  devCommand: 'pnpm run dev',
  framework: 'nextjs',
  ignoreCommand: 'git diff --quiet HEAD^ HEAD ./',
  installCommand: 'pnpm install',
  outputDirectory: '.next',
  regions: ['iad1'],
  trailingSlash: false,
  buildOptions: {
    incremental: true,
    memory: 3008, // 3GB RAM
    maxDuration: 60, // 60 seconds max build time
    nodeVersion: '18.x',
    buildTraceTimeout: 30, // 30 seconds timeout for trace collection
    buildTraceIncrementalMode: true,
    ignorePackageErrors: ['shadcn-ui'], // Ignore shadcn-ui bin creation warning
  },
  functions: {
    'api/**/*.js': {
      memory: 1024,
      maxDuration: 10
    }
  }
})
