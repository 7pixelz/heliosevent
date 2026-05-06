# AI Development Context – Helios Event Website

This project uses AI-assisted development.
Before implementing any feature, always read the documentation inside the /docs directory.

Source of Truth Documents

- project_BRD.md → Defines business requirements and project scope
- project_FRD.md → Defines functional requirements and system behavior
- tech_stack.md → Defines technology architecture and tools
- brand_guidelines.md → Defines UI design rules, colors, and typography
- database_schema.md → Defines database entities and relationships
- system_prompt.md → Defines development rules for the AI agent

Always use these documents as the source of truth.

---

PROJECT OVERVIEW

Helios Event Productions is an event management company offering services such as:

- Corporate Events
- Entertainment Events
- Exhibitions
- Government Protocol Events
- Trade Body Association Events
- MICE Events
- Sports Events
- Wedding and Social Events
- Digital Marketing

The website will include:

- Homepage landing page
- Services pages
- Event portfolio
- Blog system
- Career opportunities
- Vendor registration
- Contact inquiries
- SEO landing pages for city locations

---

TECHNOLOGY STACK

Frontend
Next.js (App Router)
TypeScript
TailwindCSS
shadcn/ui components

Animations
Framer Motion

Forms
React Hook Form
Zod validation

Backend
Next.js Server Actions / API Routes

Database
Supabase PostgreSQL

ORM
Prisma

Authentication
NextAuth (Admin Panel)

Media Storage
Supabase Storage (Images and Videos)

Hosting
Vercel

CDN
Cloudflare

---

DESIGN SYSTEM

Primary Color
#ADC905

CTA Color
#FF6A00

CTA Hover
#E55F00

Dark Background
#0F0F0F

Light Background
#FAFAFA

Fonts

Headings → Poppins  
Body → Inter

Design Style

- modern
- premium
- cinematic
- image-driven
- spacious layout
- strong visual storytelling

---

MEDIA RULES

All images and videos must be stored in Supabase Storage.

Database should store only media URLs.

Images should support:

- original image
- optimized webp version
- thumbnail version

---

SEO REQUIREMENTS

Follow SEO requirements defined in the BRD.

Requirements include:

- clean URL structure
- dynamic meta titles
- Open Graph tags
- structured data
- XML sitemap

---

WORKFLOW

When implementing features:

1. Check project_BRD.md for business scope
2. Check project_FRD.md for functionality
3. Follow tech_stack.md for architecture
4. Follow brand_guidelines.md for UI
5. Follow database_schema.md for database design

Always maintain consistency with the documentation.
