/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f5f0ff',
          100: '#ede5ff',
          200: '#d4c5ff',
          300: '#b8a9ff',
          400: '#9b8aee',
          500: '#7c5cbf',
          600: '#6b4fbb',
          700: '#3d1f8a',
          800: '#2d1566',
          900: '#1a0a40',
        },
        sky: {
          100: '#f2fdff',
          200: '#d4eeff',
          300: '#a8d8ff',
          400: '#7bbbff',
          500: '#4a9eff',
          600: '#2a7fd4',
        },
        surface: {
          white: '#ffffff',
          ice:   '#f2fdff',
          lavender: '#f5f0ff',
          card:  '#fafeff',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
        sans:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up':        'fadeUp 0.5s ease forwards',
        'fade-in':        'fadeIn 0.4s ease forwards',
        'slide-in-right': 'slideInRight 0.35s ease forwards',
        'shimmer':        'shimmer 1.8s infinite',
        'float':          'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:       { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:       { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideInRight: { '0%': { opacity: 0, transform: 'translateX(30px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        shimmer:      { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        float:        { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      boxShadow: {
        'blue':    '0 0 20px rgba(123,187,255,0.25)',
        'purple':  '0 0 20px rgba(184,169,255,0.3)',
        'card':    '0 4px 24px rgba(61,31,138,0.08)',
        'card-lg': '0 8px 40px rgba(61,31,138,0.12)',
        'button':  '0 4px 15px rgba(123,187,255,0.4)',
      },
    },
  },
  plugins: [],
};