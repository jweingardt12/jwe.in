
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,mdx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      animation: {
        fadeUp: 'fadeUp 0.5s ease-in-out',
        fadeOutDown: 'fadeOutDown 0.5s ease-in-out',
        fadeInUp: 'fadeInUp 0.5s ease-in-out',
        highlight: 'highlight 1.2s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOutDown: {
          from: { opacity: 1, transform: 'translateY(0)' },
          to: { opacity: 0, transform: 'translateY(30px)' },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        highlight: {
          '0%': { width: '0%', opacity: '1' },
          '100%': { width: '100%', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
