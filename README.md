# Jason Weingardt's Portfolio Site

## Overview

This is a modern personal portfolio website built with Next.js 15 for Jason Weingardt, a product manager and technologist based in Washington, D.C. The site showcases professional experience, projects, writing, and personal interests through a clean, responsive design with sophisticated UI animations and effects.

## Purpose

The site serves as:
- A professional portfolio highlighting work experience at companies like CloudKitchens, Uber, Ritual, and Countable
- A blog/notes platform for writing about technology, product management, and personal projects
- A showcase for side projects and technical experiments
- A central hub for professional networking and contact

## Key Features

### Core Sections

1. **Homepage** (`/`)
   - Hero section with animated introduction
   - Featured projects showcase (Otter Lockers, Emoji Studio, Home Management Platform)
   - Photo gallery with personal photography

2. **About Page** (`/about`)
   - Personal introduction with expandable cards for interests:
     - Photography setup and philosophy
     - Smart home automation details
     - Side projects and technical experiments
   - Interactive UI with modal expansion for detailed content

3. **Work/Experience Page** (`/work`)
   - Dynamic job analysis feature that can parse job descriptions via URL parameters
   - Detailed timeline of work experience with company information
   - Testimonials carousel with LinkedIn integration
   - FAQ section covering management style, remote work experience, etc.
   - Call-to-action section with sparkle effects

4. **Notes/Blog** (`/notes`)
   - Server-side rendered blog posts stored in Redis
   - Support for creating, editing, and managing posts
   - Markdown rendering with syntax highlighting
   - Dynamic content loading with suspense boundaries

5. **Reading Page** (`/reading`)
   - Integration with RSS feed from Raindrop.io
   - Shareable feed URL functionality
   - Clean presentation of reading list

### Notable UI Components & Effects

- **Liquid Glass Header**: Custom glassmorphism effect with animated gradient backgrounds
- **Blur Fade Animations**: Smooth entry animations throughout the site
- **Smart Home Animation**: Interactive visualization on the about page
- **Timeline Component**: Visual work history with expandable sections
- **Sparkles Effect**: Particle animation system for CTAs
- **Link Previews**: Rich hover previews for external links
- **Responsive Drawer**: Contact form in a sliding drawer interface
- **Dark Mode**: Full dark mode support with theme switching

## Technical Architecture

- **Framework**: Next.js 15.2.4 with React 18.2.0
- **Styling**: Tailwind CSS v4 with custom animations via Framer Motion
- **Database**: Redis (via Upstash) for storing blog posts/notes
- **Analytics**: OpenPanel, Plausible, and custom Mixpanel integration
- **Deployment**: Optimized for Vercel with edge functions
- **AI Integration**: Job analysis feature using OpenAI API

### Performance Features
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Suspense boundaries for better UX
- Edge runtime optimization

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── admin/             # Admin features
│   ├── api/               # API routes
│   ├── notes/             # Blog/notes section
│   ├── reading/           # Reading list
│   └── work/              # Work experience
├── components/            # React components
│   ├── ui/               # UI components (buttons, cards, effects)
│   └── ...               # Feature components
├── lib/                   # Utility functions and helpers
└── hooks/                 # Custom React hooks
```

## Tech Stack

### Core
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### UI Libraries
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [Headless UI](https://headlessui.dev) - Unstyled components
- [Lucide React](https://lucide.dev/) - Icons
- [Vaul](https://vaul.emilkowalski.com/) - Drawer component

### Data & APIs
- [Upstash Redis](https://upstash.com/) - Database for blog posts
- [OpenAI](https://openai.com/) - AI features
- [MDX](https://mdxjs.com) - Markdown/JSX

### Analytics & Monitoring
- [OpenPanel](https://openpanel.dev/) - Analytics
- [Plausible](https://plausible.io) - Privacy-friendly analytics
- [Mixpanel](https://mixpanel.com/) - Product analytics
- [Vercel Analytics](https://vercel.com/analytics) - Performance monitoring

### Development Tools
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting
- [pnpm](https://pnpm.io/) - Package management

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
# (Add other required environment variables as needed)

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run process-notes` - Process notes before building

## License

This project is private and proprietary.