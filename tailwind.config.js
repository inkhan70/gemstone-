/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefdf0',
          100: '#fdf9d3',
          200: '#fbf2a8',
          300: '#f7e570',
          400: '#f2d030',
          500: '#e8b800',
          600: '#c99500',
          700: '#a07100',
          800: '#855a00',
          900: '#6e4a00',
          950: '#402a00',
        },
        dark: {
          50: '#f6f6f5',
          100: '#e7e7e4',
          200: '#d0d0ca',
          300: '#b3b3aa',
          400: '#8c8c82',
          500: '#737369',
          600: '#5c5c54',
          700: '#4d4d46',
          800: '#434340',
          900: '#3b3b38',
          950: '#1a1a18',
        },
        luxury: {
          black: '#0d0d0b',
          dark: '#1a1a16',
          charcoal: '#2a2a24',
          gold: '#c9a84c',
          'gold-light': '#e8c96c',
          'gold-dark': '#9a7a2c',
          cream: '#f5f0e8',
          ivory: '#faf8f3',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'countdown': 'countdown 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(201, 168, 76, 0)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9a84c 0%, #e8c96c 50%, #9a7a2c 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0d0d0b 0%, #1a1a16 100%)',
        'hero-pattern': "url('/hero-bg.jpg')",
      }
    },
  },
  plugins: [],
}
