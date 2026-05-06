# Helios Event Website Rebuild – Technology Stack

## Overview

This document defines the final technology stack for developing and deploying the Helios Event website. The stack is optimized for **Next.js performance, SEO, scalability, and media-heavy event portfolio management**.

The architecture separates **application hosting, database, and media storage** to ensure scalability and lower operational costs.

---

# 1. Frontend Framework

Framework:
Next.js (App Router)

Reasons:

- Server-side rendering for SEO
- Static generation for marketing pages
- Built-in routing
- Image optimization
- Excellent integration with Vercel

Language:
TypeScript

Benefits:

- Type safety
- Better maintainability
- Improved developer productivity

---

# 2. Styling and UI

CSS Framework:
Tailwind CSS

Benefits:

- Utility-first design
- Faster UI development
- Small production CSS bundle

Component Library:
shadcn/ui

Used for:

- forms
- dialogs
- tables
- admin dashboard components
- UI consistency

---

# 3. Animations

Library:
Framer Motion

Use cases:

- hero section animations
- scroll reveal effects
- portfolio hover interactions
- page transitions

---

# 4. Forms and Validation

Form Management:
React Hook Form

Validation:
Zod

Benefits:

- fast form handling
- strong schema validation
- seamless TypeScript integration

---

# 5. Backend Layer

Backend handled using:
Next.js Server Actions / API Routes

Responsibilities:

- process inquiry forms
- vendor registrations
- job applications
- CMS operations

---

# 6. Database

Database Provider:
Supabase

Database Engine:
PostgreSQL

Reasons:

- fully managed PostgreSQL
- easy integration with Next.js
- scalable serverless infrastructure
- excellent developer tools

ORM:
Prisma

Benefits:

- type-safe queries
- schema migrations
- easy database management

---

# 7. Authentication (Admin Panel)

Authentication Library:
NextAuth.js

Used for:

- admin login
- session management
- role-based access

---

# 8. Media Storage (Images & Videos)

Storage Provider:
Supabase Storage

Reasons:

- extremely low storage cost
- S3 compatible API
- global CDN integration
- ideal for large event galleries

Media usage:

- event portfolio images
- gallery photos
- promotional videos

Database stores **only media URLs**, not files.

---

# 9. CDN and DNS

Provider:
Cloudflare

Features:

- DNS management
- global CDN caching
- DDoS protection
- SSL management

---

# 10. SEO Tools

Libraries:

- next-sitemap
- Next SEO

Used for:

- sitemap.xml generation
- robots.txt
- dynamic meta tags
- structured data

---

# 11. Analytics

Tools:
Google Analytics
Google Search Console

Purpose:

- traffic monitoring
- search performance analysis

---

# 12. Deployment

Hosting Platform:
Vercel

Reasons:

- built specifically for Next.js
- automatic CI/CD
- global edge CDN
- preview deployments
- automatic scaling

---

# 13. Development Tools

Version Control:
Git

Repository Hosting:
GitHub

IDE:
VS Code

---

# 14. Final Production Architecture

Users
↓
Cloudflare DNS + CDN
↓
Vercel (Next.js Application)
↓
Supabase (PostgreSQL Database)
↓
Supabase Storage (Images & Videos)

This architecture provides:

- high performance
- scalable infrastructure
- optimized media delivery
- SEO-friendly rendering

---

# 15. Recommended Folder Structure

app/
components/
lib/
hooks/
types/
services/
admin/
public/
utils/
docs/

---

# 16. Future Scalability Options

Potential future improvements:

- Redis caching layer
- Full-text search (Meilisearch / Algolia)
- Edge caching for portfolio pages
- AI-assisted content generation
- advanced analytics

---
