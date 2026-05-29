// Flat ESLint config for Next 16.
// `next lint` was removed in Next 16 — we run the ESLint CLI directly (see package.json `lint` script).
// eslint-config-next 16 ships flat-config arrays, so we spread them straight in.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

const config = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'],
  },
]

export default config
