/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Main color palette
        primary: {
          DEFAULT: '#3b82f6', // Blue-500
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Secondary and accent colors
        secondary: {
          DEFAULT: '#64748b', // Slate-500
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e0',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          DEFAULT: '#10b981', // Green-500
          lighter: '#d1fae5',
          light: '#34d399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#f59e0b', // Amber-500
          lighter: '#fef3c7',
          light: '#fbbf24',
          dark: '#d97706',
        },
        error: {
          DEFAULT: '#ef4444', // Red-500
          lighter: '#fee2e2',
          light: '#f87171',
          dark: '#b91c1c',
        },
        // UI colors
        background: {
          light: '#ffffff',
          dark: '#1a202c',
          DEFAULT: '#ffffff',
        },
        surface: {
          light: '#f8fafc',
          dark: '#0f172a',
          DEFAULT: '#f8fafc',
        },
        text: {
          DEFAULT: '#1e293b', // Slate-800
          light: '#64748b', // Slate-500
          dark: '#0f172a',  // Slate-900
          white: '#ffffff',
          black: '#000000',
        },
      },
      // Typography scale
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      // Spacing and sizing
      spacing: {
        // Existing Tailwind spacing is maintained
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
      // Add box shadows
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
} 