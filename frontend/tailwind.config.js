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
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb',    // blue-600
        },
        secondary: {
          DEFAULT: '#a855f7', // purple-500
          dark: '#9333ea',    // purple-600
        },
        accent: {
          DEFAULT: '#10b981', // emerald-500
          dark: '#059669',    // emerald-600
        },
        neutral: {
          DEFAULT: '#64748b', // slate-500
          dark: '#475569',    // slate-600
          light: '#f8fafc',   // slate-50
          darkBg: '#0f172a',  // slate-900
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
