/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          900: '#1a1f2e',
          800: '#2d3142',
        },
        gold: {
          600: '#aa8c2c',
          500: '#d4af37',
        },
        teal: {
          700: '#0f4c5c',
          600: '#1a6b7f',
        },
        copper: {
          600: '#b87333',
          500: '#d4894e',
        },
        'off-white': '#f5f1e8',
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['Courier Prime', 'Menlo', 'Monaco', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '10px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  plugins: [],
}
