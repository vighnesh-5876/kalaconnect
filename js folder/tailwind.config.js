/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0806',
          900: '#110e0a',
          800: '#1a1510',
          700: '#251e17',
          600: '#31271e',
          500: '#3e3228',
        },
        gold: {
          300: '#f5d896',
          400: '#e8c46a',
          500: '#d4a843',
          600: '#b88a2a',
          700: '#8f6a1e',
        },
        parchment: {
          50:  '#fdf8ef',
          100: '#f7eed8',
          200: '#eedcb4',
          300: '#e0c480',
        },
        rust: {
          400: '#c9624a',
          500: '#b04a34',
        },
        sage: {
          400: '#7a9e7e',
          500: '#5f8263',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lora"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in-right': 'slideInRight 0.35s ease forwards',
        'shimmer': 'shimmer 1.8s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 168, 67, 0.15)',
        'gold-lg': '0 0 40px rgba(212, 168, 67, 0.2)',
        'ink': '0 8px 32px rgba(10, 8, 6, 0.6)',
        'card': '0 4px 24px rgba(10, 8, 6, 0.4)',
      },
    },
  },
  plugins: [],
};
