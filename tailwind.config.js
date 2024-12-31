const typographyPlugin = require('@tailwindcss/typography');
const typographyStyles = require('./typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
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
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-delayed': 'fadeIn 1s ease-out 3s forwards',
        'slide-up-1': 'slideUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 3.2s forwards',
        'slide-up-2': 'slideUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 3.6s forwards',
        'slide-up-3': 'slideUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.0s forwards',
        'slide-up-4': 'slideUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.4s forwards',
        'slide-up-5': 'slideUp 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 4.8s forwards',
        // Add toast animations
        'toast-hide': 'toast-hide 100ms ease-in forwards',
        'toast-slide-in-right': 'toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-slide-in-bottom': 'toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-swipe-out': 'toast-swipe-out 100ms ease-out forwards',
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
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        fadeUp: {
          from: { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        // ... your existing keyframes ...
        // Add toast keyframes
        'toast-hide': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        'toast-slide-in-right': {
          '0%': { transform: 'translateX(calc(100% + 1rem))' },
          '100%': { transform: 'translateX(0)' },
        },
        'toast-slide-in-bottom': {
          '0%': { transform: 'translateY(calc(100% + 1rem))' },
          '100%': { transform: 'translateY(0)' },
        },
        'toast-swipe-out': {
          '0%': { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          '100%': { transform: 'translateX(calc(100% + 1rem))' },
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