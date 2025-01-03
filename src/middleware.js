import { OpenPanelMiddleware } from '@openpanel/nextjs'

export default OpenPanelMiddleware({
  secret: process.env.OPENPANEL_SECRET,
  apiUrl: process.env.NEXT_PUBLIC_OPENPANEL_API_URL,
})

export const config = {
  matcher: '/api/openpanel/:path*',
}
