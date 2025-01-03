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
STRAPI_URL=http://localhost:1337
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
- [Strapi](https://strapi.io) - Headless CMS

## Setting up Strapi CMS

To set up Strapi CMS, follow these steps:

1. Install Strapi globally if you haven't already:

```bash
npm install -g strapi@latest
```

2. Create a new Strapi project:

```bash
strapi new my-project
```

3. Navigate to the project directory:

```bash
cd my-project
```

4. Start the Strapi development server:

```bash
npm run develop
```

5. Open your browser and go to `http://localhost:1337/admin` to access the Strapi admin panel.

6. Create a new collection type called `Article` with the following fields:
   - `title` (Text)
   - `slug` (UID)
   - `date` (Date)
   - `description` (Text)
   - `image` (Media)
   - `content` (Rich Text)

7. Add some articles to the `Article` collection.

8. Update the `.env.local` file in your Next.js project with the Strapi URL:

```
STRAPI_URL=http://localhost:1337
```

9. Restart your Next.js development server:

```bash
npm run dev
```

Your Next.js application should now be fetching articles from Strapi CMS.
