const typographyPlugin = require('@tailwindcss/typography');

const typographyStyles = require('./typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      animation: {
        fadeUp: 'fadeUp 0.5s ease-in-out', // Fade in and move up
        fadeOutDown: 'fadeOutDown 0.5s ease-in-out', // Fade out and move down
        fadeInUp: 'fadeInUp 0.5s ease-in-out', // Custom fade in and move up
      },
      keyframes: {
        fadeUp: {
          from: {
            opacity: 0,
            transform: 'translateY(30px)', // Start 30px below
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)', // End at original position
          },
        },
        fadeOutDown: {
          from: {
            opacity: 1,
            transform: 'translateY(0)', // Start at original position
          },
          to: {
            opacity: 0,
            transform: 'translateY(30px)', // Move 30px down
          },
        },
        fadeInUp: {
          from: {
            opacity: 0,
            transform: 'translateY(30px)', // Start 30px below
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)', // End at original position
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