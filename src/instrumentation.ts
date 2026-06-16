// Next.js instrumentation entrypoint — loads the right Sentry config per runtime.
// The Sentry inits are themselves DSN-gated, so this is a no-op without a DSN.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Captures errors thrown in nested React Server Components.
export { captureRequestError as onRequestError } from '@sentry/nextjs'
