import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
}
export default config
