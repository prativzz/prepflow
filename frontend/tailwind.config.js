/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F8CFF', // Blue Accent
          dark: '#3b82f6',
          light: '#60a5fa',
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Purple Accent
          dark: '#7c3aed',
        },
        success: { DEFAULT: '#22C55E' },
        warning: { DEFAULT: '#F59E0B' },
        danger: { DEFAULT: '#EF4444' },
        accent: {
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        neutral: {
          // Dark Mode specific background layers
          darkBg: '#09090b',
          darkCard: '#18181b',
          darkCardSecondary: '#27272a',
          darkInput: '#27272a',
          darkHover: '#3f3f46',
          darkBorder: 'rgba(255,255,255,0.08)',
          // Typography
          textPrimary: '#F8FAFC',
          textSecondary: '#CBD5E1',
          textMuted: '#94A3B8',
          textPlaceholder: '#64748B',
          // Light Mode fallbacks
          DEFAULT: '#64748b',
          dark: '#475569',
          light: '#f8fafc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px -5px rgba(79, 140, 255, 0.4)',
        'glow-secondary': '0 0 20px -5px rgba(139, 92, 246, 0.4)',
        'ambient': '0 4px 40px -10px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.1)',
        'ambient-hover': '0 10px 50px -10px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  plugins: [],
}
