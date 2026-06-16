// Sentry — Node.js (server) runtime init.
// Inert unless NEXT_PUBLIC_SENTRY_DSN is set AND we're in production,
// so local dev and preview builds stay silent.
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV || 'production',
    enabled: process.env.NODE_ENV === 'production',
    tracesSampleRate: 0, // performance tracing off — stay within free tier
  })
}
