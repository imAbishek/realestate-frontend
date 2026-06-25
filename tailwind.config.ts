import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#e6f1fb',
          100: '#b5d4f4',
          200: '#85b7eb',
          400: '#378add',
          600: '#185fa5',
          800: '#0c447c',
          900: '#042c53',
        },
        accent: {
          50:  '#faece7',
          100: '#f5c4b3',
          400: '#d85a30',
          600: '#993c1d',
          800: '#712b13',
        },
      },
      boxShadow: {
        // Soft elevation matching the mobile cards (slate-900 @ low opacity)
        soft: '0 6px 16px rgba(15,23,42,0.06)',
        card: '0 10px 30px rgba(15,23,42,0.08)',
      },
      backgroundImage: {
        // Hero gradient — lighter brand at top deepening toward brand-900 (mirrors mobile HERO_GRADIENT)
        'hero-gradient': 'linear-gradient(180deg, #185fa5 0%, #15589c 45%, #0e447a 100%)',
      },
    },
  },
  plugins: [],
}
export default config
