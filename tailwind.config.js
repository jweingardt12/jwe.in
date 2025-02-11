const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle at center, currentColor 1px, transparent 1px)',
        'dot-black': 'radial-gradient(rgba(0, 0, 0, 0.3) 1px, transparent 1px)',
        'dot-white': 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'dot-pattern': '24px 24px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        'zoom-in': {
          '0%': { transform: 'scale(0.95) translate(-50%, -100%) translateY(-8px)', opacity: '0' },
          '100%': { transform: 'scale(1) translate(-50%, -100%) translateY(-8px)', opacity: '1' }
        },
        "shooting-star": {
          "0%": {
            transform: "rotate(215deg) translateX(0)",
            opacity: 1,
          },
          "70%": {
            opacity: 1,
          },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: 0,
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shine: {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
      },
      animation: {
        'zoom-in': 'zoom-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        "shooting-star": "shooting-star linear infinite",
        shimmer: 'shimmer 2s infinite',
        shine: "shine var(--duration) infinite linear",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'sheet-in': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        'sheet-out': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' }
        },
        'overlay-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'overlay-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'success-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.7s cubic-bezier(0.33, 0.85, 0.4, 0.96)',
        'sheet-in': 'sheet-in 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        'sheet-out': 'sheet-out 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
        'overlay-in': 'overlay-in 0.3s ease-out',
        'overlay-out': 'overlay-out 0.2s ease-in',
        'spin': 'spin 0.6s linear infinite',
        'success-in': 'success-in 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')({
      theme: {
        css: {
          '--tw-prose-body': 'rgb(82 82 91)', // zinc-600
          '--tw-prose-headings': 'rgb(24 24 27)', // zinc-900
          '--tw-prose-links': 'rgb(14 165 233)', // sky-500
          '--tw-prose-invert-body': 'rgb(161 161 170)', // zinc-400
          '--tw-prose-invert-headings': 'rgb(244 244 245)', // zinc-100
          '--tw-prose-invert-links': 'rgb(14 165 233)', // sky-500
          img: {
            borderRadius: '1rem'
          }
        }
      }
    }),
    require('tailwindcss-motion'),
    addVariablesForColors,
  ],
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}
