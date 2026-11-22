/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#102A43',
          'navy-dark': '#0B1F33',
          'navy-light': '#1D3B58',
          gold: '#C5A55A',
          'gold-light': '#DDC07E',
          'gold-dark': '#A5873D',
        },
        surface: {
          bg: '#F6F8FB',
          card: '#FFFFFF',
          muted: '#F1F5F9',
          border: '#E2E8F0',
        },
        ink: {
          primary: '#172B4D',
          secondary: '#64748B',
          muted: '#94A3B8',
          inverted: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 42, 67, 0.05), 0 1px 2px -1px rgba(16, 42, 67, 0.05)',
        'elevated': '0 4px 6px -1px rgba(16, 42, 67, 0.07), 0 2px 4px -2px rgba(16, 42, 67, 0.05)',
        'floating': '0 10px 25px -3px rgba(16, 42, 67, 0.1), 0 4px 6px -4px rgba(16, 42, 67, 0.05)',
        'gold-glow': '0 0 15px rgba(197, 165, 90, 0.25)',
      }
    },
  },
  plugins: [],
}
