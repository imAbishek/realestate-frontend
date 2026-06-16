// Sentry — browser (client) runtime init.
// Inert unless NEXT_PUBLIC_SENTRY_DSN is set AND we're in production.
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV || 'production',
    enabled: process.env.NODE_ENV === 'production',
    tracesSampleRate: 0,
    // Session Replay off by default (privacy + free-tier quota); opt in later.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  })
}

// Required by Sentry for App Router navigation instrumentation.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
