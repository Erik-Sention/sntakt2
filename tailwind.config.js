/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'slow-float': 'float 8s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-in': 'slideIn 0.6s ease-out forwards',
        'border-flow': 'borderFlow 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        fadeIn: {
          'from': { opacity: 0 },
          'to': { opacity: 1 },
        },
        slideIn: {
          'from': { transform: 'translateY(20px)', opacity: 0 },
          'to': { transform: 'translateY(0)', opacity: 1 },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        }
      },
      colors: {
        'luxury': {
          'sand': '#F7E6CA',
          'gold': '#E8D59E',
          'rosegold': '#D9BBB0',
          'taupe': '#AD9C8E',
          'dark': '#3A3A3A',
          'mid': '#6A6A6A',
          'light': '#FAFAFA',
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 0V20M0 1H20' stroke='%23FFFFFF' stroke-opacity='0.05'/%3E%3C/svg%3E%0A\")",
        'luxury-gradient': "linear-gradient(to right bottom, rgba(247, 230, 202, 0.2), rgba(173, 156, 142, 0.05))",
        'button-gradient': "linear-gradient(to right, #E8D59E, #D9BBB0)",
      },
      boxShadow: {
        'luxury': '0 4px 16px rgba(0, 0, 0, 0.05), 0 8px 32px rgba(0, 0, 0, 0.05)',
        'luxury-hover': '0 6px 24px rgba(0, 0, 0, 0.08), 0 12px 40px rgba(0, 0, 0, 0.08)',
        'inner-luxury': 'inset 0 0 0 1px rgba(232, 213, 158, 0.4)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionProperty: {
        'border': 'border-color, border-width, border-opacity',
        'height': 'height, max-height',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}; 