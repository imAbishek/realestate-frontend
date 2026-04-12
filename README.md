# PropFind — Next.js Frontend

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL to your Spring Boot URL

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

## Pages

| Route                   | Description                        |
|-------------------------|------------------------------------|
| `/`                     | Homepage with search + featured    |
| `/properties`           | Search results with filter sidebar |
| `/properties/[id]`      | Full property detail page          |
| `/auth/login`           | Login form                         |
| `/auth/register`        | Register with role selection       |
| `/post-property`        | Multi-step post a property form    |
| `/dashboard`            | User's own listings management     |
| `/admin`                | Admin panel (ADMIN role only)      |

## Project structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── properties/        # Search + detail pages
│   ├── auth/              # Login + register
│   ├── post-property/     # Post listing form
│   ├── dashboard/         # User dashboard
│   └── admin/             # Admin panel
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── property/          # PropertyCard, InquiryForm
│   └── search/            # SearchBar
├── lib/
│   ├── api.ts             # Axios client + all API calls
│   └── utils.ts           # Price formatting, labels, helpers
├── store/
│   └── authStore.ts       # Zustand auth state (persisted)
└── types/
    └── index.ts           # TypeScript types matching Spring Boot DTOs
```

## Notes

- All API calls are in `src/lib/api.ts` — change `NEXT_PUBLIC_API_URL` to point at Spring Boot
- JWT tokens are stored in `localStorage` via Zustand persist middleware
- The `properties/[id]/page.tsx` is a Server Component — data is fetched server-side for SEO
- Admin page is client-guarded by role check — also protect at middleware level in production
# realestate-frontend
