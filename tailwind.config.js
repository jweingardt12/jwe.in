const typographyPlugin = require('@tailwindcss/typography');
const typographyStyles = require('./typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      animation: {
        gradient: 'gradient 3s ease infinite',
        'gradient-slow': 'gradient 8s ease infinite',
        'gradient-slower': 'gradient 15s ease infinite',
        fadeUp: 'fadeUp 0.5s ease-in-out',
        fadeOutDown: 'fadeOutDown 0.5s ease-in-out',
        fadeInUp: 'fadeInUp 0.5s ease-in-out',
        highlight: 'highlight 1.2s ease-out forwards',
      },
      animationDelay: {
        500: '500ms',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '500% 50%' }
        },
        fadeUp: {
          from: {
            opacity: 0,
            transform: 'translateY(30px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        fadeOutDown: {
          from: {
            opacity: 1,
            transform: 'translateY(0)',
          },
          to: {
            opacity: 0,
            transform: 'translateY(30px)',
          },
        },
        fadeInUp: {
          from: {
            opacity: 0,
            transform: 'translateY(30px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        highlight: {
          '0%': {
            width: '0%',
            opacity: '1',
          },
          '100%': {
            width: '100%',
            opacity: '1',
          },
        },
      },
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.5rem' }],
        sm: ['0.875rem', { lineHeight: '1.5rem' }],
        base: ['1rem', { lineHeight: '1.75rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '2rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      typography: typographyStyles,
    },
  },
  plugins: [typographyPlugin],
};