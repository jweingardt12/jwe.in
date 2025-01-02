# jwe.in

My personal site, built with Next.js, Tailwind CSS, and OpenPanel analytics.

## Getting started

To run this site locally, first install the npm dependencies:

```bash
npm install
```

Next, create a `.env.local` file in the root of your project and set the required environment variables:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_OPENPANEL_CLIENT_ID=your_client_id
NEXT_PUBLIC_OPENPANEL_CLIENT_SECRET=your_client_secret
```

Then run the development server:

```bash
npm run dev
```

## Features

- 📝 Notes/blog with markdown support
- 📚 RSS feed integration for sharing what I'm reading
- 🌓 Dark mode support
- 📊 Analytics with OpenPanel
- 📱 Responsive design
- 🖼️ Photo gallery with hover states
- 🔗 Social links with click tracking

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [OpenPanel](https://openpanel.dev) - Analytics
- [Headless UI](https://headlessui.dev) - UI components
- [MDX](https://mdxjs.com) - Markdown/JSX
