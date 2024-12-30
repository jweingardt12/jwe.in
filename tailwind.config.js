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
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-delayed': 'fadeIn 1s ease-out 3s forwards',
        'slide-up-1': 'slideUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 3.2s forwards',
        'slide-up-2': 'slideUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 3.6s forwards',
        'slide-up-3': 'slideUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.0s forwards',
        'slide-up-4': 'slideUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.4s forwards',
        'slide-up-5': 'slideUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.8s forwards',
      },
      animationDelay: {
        500: '500ms',
        3000: '3000ms',
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(100px)'
          },
          '70%': {
            opacity: '0.7',
            transform: 'translateY(-20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
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