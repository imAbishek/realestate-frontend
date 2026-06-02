# PropFind — Regression Log

## Progress

- [x] Area 1: Auth flows (register, login, logout, OTP, password reset)
- [x] Area 2: Property listing creation (post-property form)
- [x] Area 3: Property detail page
- [x] Area 4: Search & filters
- [x] Area 5: Dashboard (my listings)
- [x] Area 6: Edit listing
- [x] Area 7: Inquiry form
- [x] Area 8: Admin — listings moderation
- [x] Area 9: Admin — users management
- [x] Area 10: Admin — analytics
- [x] Area 11: Email flows
- [x] Area 12: Navigation / general UX

---

## Bug Log

| # | Area | Description | Severity | Status | Files |
|---|------|-------------|----------|--------|-------|
| 1 | Auth | Register: duplicate email shows 500 instead of "Email already registered" | HIGH | ✅ FIXED | GlobalExceptionHandler.java |
| 2 | Auth | OTP input accepts non-numeric input without client validation | LOW | ✅ FIXED | reset-password/page.tsx |
| 3 | Auth | JWT refresh: 401 loop when refresh token itself is expired | HIGH | ✅ FIXED | api.ts (interceptor) |
| 4 | Property | Post-property: image upload silently fails when file > 5 MB (no user feedback) | MEDIUM | ✅ FIXED | post-property/page.tsx |
| 5 | Property | Edit listing: primary image loses "primary" flag after re-upload | MEDIUM | ✅ FIXED | PropertyService.java |
| 6 | Property | Detail page: view count increments on every hard-refresh (no dedup) | LOW | ✅ FIXED | PropertyService.java |
| 7 | Search | Price range filter: max < min still submits and returns empty results | MEDIUM | ✅ FIXED | properties/page.tsx |
| 8 | Auth | Login case-sensitive: "User@Example.com" fails if stored as "user@example.com" | HIGH | ✅ FIXED | AuthService.java |
| 9 | Property | Inquiry form: `sendInquiry` called `getById` — inflated view count on inquiry | MEDIUM | ✅ FIXED | PropertyService.java, PropertyController.java |
| 10 | Search | Filter chip clear buttons don't reset page to 0 — stale paginated results | MEDIUM | ✅ FIXED | properties/page.tsx |
| 11 | Inquiry | Inquiry email notification wired to service but never called from controller | HIGH | ✅ FIXED | PropertyService.java, PropertyController.java |
| 12 | Admin | Admin pagination: Next button uses client-side `filtered.length < 20` — breaks when search active | MEDIUM | ✅ FIXED | admin/listings/page.tsx, admin/users/page.tsx |
| 13 | Navigation | Footer + register page link to /about, /contact, /privacy, /terms — pages don't exist, show generic 404 | LOW | ✅ FIXED | app/about/page.tsx, app/contact/page.tsx, app/privacy/page.tsx, app/terms/page.tsx |
| 14 | Admin | View button on pending listings → 404 (public endpoint rejects non-ACTIVE status) | HIGH | ✅ FIXED | AdminController.java, PropertyService.java, admin/listings/[id]/page.tsx, api.ts |
| 15 | Admin | Property thumbnail broken in admin listings — stored URL missing `/api` context path prefix | MEDIUM | ✅ FIXED | application-dev.properties (base-url corrected to include /api) |
| 16 | Images | Property images broken on search + detail pages — `next/image` blocks localhost (private IP SSRF protection); HEAD requests also returned 401 | HIGH | ✅ FIXED | PropertyCard.tsx, properties/[id]/page.tsx, SecurityConfig.java (removed HttpMethod.GET restriction on /uploads/**) |
| 17 | Navigation | Navbar Buy/Rent/PG links don't update search results when already on /properties — `useState` only reads `searchParams` on mount, ignores URL changes | MEDIUM | ✅ FIXED | properties/page.tsx (added useEffect to sync state on searchParams change) |
| 18 | Search | Compact search bar on /properties always resets listingType to SALE when navigating — `tab` state in SearchBar defaults to SALE, ignores current URL param | HIGH | ✅ FIXED | SearchBar.tsx (reads listingType from useSearchParams in compact mode) |
| 19 | Search | Homepage "View all featured →" link goes to ?featuredOnly=true but properties page never read/passed featuredOnly to the API — showed all SALE results instead | HIGH | ✅ FIXED | properties/page.tsx (added featuredOnly state read from URL + passed to API) |
| 20 | Display | formatPrice: PER_SQFT unit showed same as TOTAL price — no "/sqft" suffix was appended | LOW | ✅ FIXED | utils.ts |
| 21 | Navigation | Navbar user dropdown didn't close on outside click — required a second click on the avatar button | LOW | ✅ FIXED | Navbar.tsx (useRef + mousedown event listener) |
