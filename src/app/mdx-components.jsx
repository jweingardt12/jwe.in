import { Prose } from '@/components/Prose'

export function MDXComponents(components = {}) {
  return {
    ...components,
    wrapper: ({ children }) => <Prose>{children}</Prose>,
  }
}

export default MDXComponents
