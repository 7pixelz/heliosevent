# Helios Event Website

A premium event management website built with Next.js, TypeScript, and TailwindCSS.

## Tech Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Component Library**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Hosting**: Vercel

## Project Structure

```
app/
  ├── layout.tsx              # Root layout
  ├── page.tsx                # Home page
  ├── globals.css             # Global styles
  └── (public)/               # Public routes
      ├── services/
      ├── portfolio/
      └── blog/

components/
  ├── layout/
  │   ├── Header.tsx
  │   └── Footer.tsx
  ├── home/
  │   ├── HeroSection.tsx
  │   ├── ServicesSection.tsx
  │   ├── PortfolioPreview.tsx
  │   ├── ClientsSection.tsx
  │   ├── TestimonialsSection.tsx
  │   └── CTASection.tsx
  └── ui/                     # Reusable UI components

lib/
  ├── prisma.ts              # Prisma client
  └── auth.ts                # Authentication

services/
  ├── services.service.ts
  ├── portfolio.service.ts
  └── blog.service.ts

types/
  ├── service.types.ts
  ├── portfolio.types.ts
  └── blog.types.ts

utils/
  └── helpers.ts
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
npm start
```

## Design System

### Colors

- **Primary**: #ADC905 (Lime Green)
- **CTA**: #FF6A00 (Orange)
- **CTA Hover**: #E55F00
- **Dark Background**: #0F0F0F
- **Light Background**: #FAFAFA
- **Text Dark**: #1A1A1A
- **Text Muted**: #6B7280

### Typography

- **Headings**: Poppins Font
- **Body**: Inter Font

## Features

- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags, structured data
- **Performance**: Image optimization, lazy loading
- **Animations**: Smooth animations with Framer Motion
- **Accessibility**: WCAG compliant
- **Dark Mode**: Supports dark theme

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=your_supabase_url
NEXTAUTH_SECRET=your_secret_key
```

## Documentation

See the `/docs` folder for:
- Project Business Requirements (BRD)
- Project Functional Requirements (FRD)
- Architecture Guidelines
- Brand Guidelines
- Database Schema
- System Prompt

## License

All rights reserved © 2025 Helios Event Productions
