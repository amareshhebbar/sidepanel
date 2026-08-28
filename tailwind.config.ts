import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0a0a0c',
          900: '#111114',
          800: '#1a1a1f',
          700: '#26262d',
          600: '#38383f',
          400: '#8a8a94',
          200: '#d4d4da',
          50: '#f7f7f9'
        },
        signal: {
          DEFAULT: '#c9ff3a',
          dim: '#a8d92e',
          soft: '#e8ffb0'
        },
        flag: {
          DEFAULT: '#ff5d5d',
          soft: '#ffb0b0'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace']
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
}

export default config