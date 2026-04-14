# Frontend — Next.js App

## Tech stack
- Next.js 16 (App Router — NOT pages router)
- TypeScript strict mode
- Tailwind CSS (custom brand colours in tailwind.config.ts)
- Zustand with persist (auth state → localStorage key: 'propfind-auth')
- React Hook Form + Zod (all form validation)
- Axios with interceptors (JWT attach + auto-refresh on 401)

## Exact file structure (as of current codebase)
```
src/
├── app/
│   ├── layout.tsx                          # Root layout — uses ConditionalShell
│   ├── globals.css
│   ├── page.tsx                            # Homepage (Server Component)
│   ├── not-found.tsx                       # 404 page
│   ├── properties/
│   │   ├── page.tsx                        # Search results (Client Component)
│   │   └── [id]/page.tsx                   # Property detail (Server Component)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx        # Sends OTP to email
│   │   └── reset-password/page.tsx         # Accepts email + OTP + new password
│   ├── post-property/
│   │   ├── page.tsx                        # Create listing (4-step form)
│   │   └── edit/[id]/page.tsx              # Edit existing listing
│   ├── dashboard/page.tsx                  # User's own listings (Client)
│   └── admin/
│       ├── layout.tsx                      # Dark sidebar — hides Navbar/Footer
│       ├── page.tsx                        # Overview KPIs
│       ├── listings/page.tsx               # Approve/reject/feature
│       ├── users/page.tsx                  # Ban/reinstate users
│       └── analytics/page.tsx             # Charts and metrics
├── components/
│   ├── layout/
│   │   ├── ConditionalShell.tsx            # Hides Navbar+Footer on /admin/* routes
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   └── InquiryForm.tsx
│   └── search/
│       └── SearchBar.tsx
├── lib/
│   ├── api.ts                              # ALL API calls — authApi, propertyApi,
│   │                                         searchApi, adminApi
│   └── utils.ts                            # formatPrice, bedroomLabel, timeAgo,
│                                             LISTING_TYPE_LABELS, listingTypeBadgeClass
├── store/
│   └── authStore.ts                        # Zustand — user, tokens, _hasHydrated
└── types/
    └── index.ts                            # All TypeScript types — mirrors backend DTOs
```

## Important architecture notes
- ConditionalShell wraps all pages — hides Navbar/Footer on /admin/* automatically
- Admin layout.tsx provides the dark sidebar shell for all /admin/* pages
- Axios baseURL: browser → '/api' (proxied by Next.js), server → full URL
- authStore has _hasHydrated flag — check before showing auth-dependent UI
- Inquiry endpoint: POST /properties/{id}/inquiries (not /inquiries)
- Reset password: requires email + otp + newPassword (three fields)
- `LoginRequest` uses `identifier` (not `email`) — accepts email or 10-digit Indian mobile number
- `RegisterRequest` has no `role` field — backend defaults all new users to BUYER
- `next.config.js` reads `NEXT_PUBLIC_MINIO_HOST` / `NEXT_PUBLIC_MINIO_PROTOCOL` / `NEXT_PUBLIC_MINIO_PORT` to whitelist the prod image CDN hostname for `next/image`

## Auth guard pattern (use in every protected page)
```tsx
const { isLoggedIn, user } = useAuthStore()
useEffect(() => {
  if (!isLoggedIn) router.push('/auth/login')
}, [isLoggedIn, router])
if (!isLoggedIn) return null
```

## Brand colours — use these ONLY, never invent new ones
```
brand-50:   #e6f1fb    brand-600: #185FA5    brand-800: #0c447c
accent-400: #D85A30    accent-600: #993c1d
```

## API rules
- NEVER write inline axios calls in components
- NEVER hardcode http://localhost:8080 anywhere — use api.ts functions
- NEVER use TypeScript `any` — use types from src/types/index.ts
- ALL new endpoints go into api.ts first, then use in components
- For multipart/form-data (image upload), api.ts handles the Content-Type header

## Form rules
- ALL forms use React Hook Form with a Zod schema
- Show loading state (disabled button + text change) during submission
- Show toast on success AND error
- Reset form after successful submission

## Validation command
```bash
npx tsc --noEmit
```
Must show zero TypeScript errors. Fix all before saying done.
