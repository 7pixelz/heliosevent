# Project Architecture – Helios Event Website

This document defines the folder structure and coding conventions for the project.

All generated code must follow this architecture.

---

PROJECT STRUCTURE

app/
layout.tsx
page.tsx

(public)/
services/
portfolio/
blog/

(admin)/
dashboard/
services/
portfolio/
blog/

components/
ui/
layout/
home/
services/
portfolio/
blog/

lib/
prisma.ts
auth.ts

services/
services.service.ts
portfolio.service.ts
blog.service.ts

types/
service.types.ts
portfolio.types.ts

utils/
helpers.ts

---

COMPONENT RULES

Reusable components must be placed in:

components/ui/

Page-specific components should be placed in:

components/home/
components/services/
components/portfolio/

---

DATABASE ACCESS

All database queries must be handled through:

services/

Example:

services/portfolio.service.ts

Do not access Prisma directly inside page components.

---

MEDIA STORAGE

All images and videos must be stored in Supabase Storage.

Database should store only media URLs.

---

STYLING

Use TailwindCSS only.

Follow brand guidelines:

Primary: #ADC905
CTA: #FF6A00

---

PERFORMANCE RULES

Use Next.js Image component for all images.

Prefer server components when possible.

Avoid unnecessary client components.

---

SEO

All pages must support:

dynamic metadata
OpenGraph tags
structured data
