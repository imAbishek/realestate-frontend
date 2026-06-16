<div align="center">

# 🏡 PropFind — Web

**The Next.js web client for PropFind, a full-stack real estate listing platform.**

Find a home, list a property, manage your listings, and (for admins) moderate the marketplace — a fast, SEO-friendly web experience built on the App Router.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-utility--first-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/state-Zustand-443e38)](https://zustand-demo.pmnd.rs/)
[![Vercel](https://img.shields.io/badge/deployed-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![CodeQL](https://img.shields.io/badge/SAST-CodeQL-blueviolet?logo=github)](.github/workflows/codeql.yml)
[![Sentry](https://img.shields.io/badge/observability-Sentry-362D59?logo=sentry&logoColor=white)](https://sentry.io/)

</div>

---

## 🔗 Live demo

### 👉 https://realestate-frontend-ten-lyart.vercel.app

> Backed by a Spring Boot API on Render's free tier — first load after idle may take ~30s while the API cold-starts. Create a free account to post a listing, save favourites, and book a site visit.

## ✨ Features

- 🔎 **Search & filter** — type, price, location, bedrooms, amenities and more, with a results page + filter sidebar.
- 🏠 **Property detail** — SEO-optimised, server-rendered pages with an image gallery, EMI calculator, and Call / WhatsApp / Book-Visit actions.
- 📝 **Post a property** — guided multi-step wizard (role → listing type → category → details) with drag-and-drop image upload.
- 👤 **Account dashboard** — manage your own listings, incoming visit bookings, and saved properties.
- 🛡️ **Admin panel** — approve/reject listings, feature toggles, ban/reinstate users, analytics & KPIs, verification-document review (dark sidebar shell).
- 🔐 **Auth** — login with email or Indian mobile, JWT session, email-OTP password reset.

## 🛠️ Tech stack

| Area | Choice |
|---|---|
| Framework | **Next.js 16** (App Router), React 18, TypeScript (strict) |
| Styling | Tailwind CSS, custom design system (`ui/*`), brand palette |
| State | Zustand (persisted auth store) |
| Data | One typed Axios client (`src/lib/api.ts`) with JWT interceptor |
| Forms | React Hook Form + Zod, react-dropzone |
| Observability | Sentry (`@sentry/nextjs`), HTTP security headers |
| Hosting | Vercel |

## 🧱 Architecture notes

- **All API calls flow through `src/lib/api.ts`** — no inline `fetch`/`axios` in components.
- **All types live in `src/types/index.ts`** and mirror the backend DTOs exactly (single source of truth).
- **`properties/[id]/page.tsx` is a Server Component** — data fetched server-side for SEO; most other pages are client components.
- **`ConditionalShell`** swaps the public Navbar/Footer for the admin sidebar on `/admin/*`.
- **Security headers** (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) configured in `next.config.js`.

```
src/
├── app/                 # App Router pages (home, properties, auth, post, dashboard, admin)
├── components/          # layout/ · property/ · search/ · ui/ (design system)
├── lib/                 # api.ts (all HTTP) · utils.ts (formatters, labels)
├── store/               # authStore.ts (Zustand, persisted)
├── types/               # index.ts — TS types mirroring backend DTOs
└── instrumentation*.ts  # Sentry init (DSN-gated, prod-only)
```

## 🚀 Getting started

> **Full per-OS setup (Windows / Linux / macOS): see [`SETUP.md`](SETUP.md).**

```bash
# 1. Install dependencies
npm install

# 2. Configure env
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL to your Spring Boot URL (e.g. http://localhost:8080/api)

# 3. Run
npm run dev          # → http://localhost:3000
```

### Validation

```bash
npx tsc --noEmit     # type check (must be clean)
npm run lint         # ESLint 9 (flat config)
```

## 🗺️ Pages

| Route | Description |
|---|---|
| `/` | Homepage — search + featured listings |
| `/properties` | Search results + filter sidebar |
| `/properties/[id]` | Full property detail (Server Component) |
| `/post-property` | Multi-step post-a-listing wizard |
| `/dashboard` | Your listings, bookings & favourites |
| `/admin/*` | Admin panel (ADMIN role only) |
| `/auth/*` | Login / register / forgot + reset password |

## 🧩 Part of PropFind

| Repo | Description |
|---|---|
| **realestate-frontend** (this) | Next.js 16 web app |
| [realestate-backend](https://github.com/imAbishek/realestate-backend) | Spring Boot REST API |
| [realestate-mobile](https://github.com/imAbishek/realestate-mobile) | React Native + Expo app |

---

<div align="center">
Built by <a href="https://github.com/imAbishek">Abishek</a> · Next.js · TypeScript
</div>
