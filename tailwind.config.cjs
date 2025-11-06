/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 🟢 การตั้งค่า Container
      container: {
        center: true,
        padding: '2rem',
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1240px',
          '2xl': '1496px',
        },
      },
      // 🟢 การตั้งค่า Animation
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0%',
            // 💡 แก้ไข: ถ้าต้องการให้มันเลื่อนขึ้น ต้องใช้ translateY ที่มีค่า
            // opacity: '0%',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
      },
      // 🟢 การตั้งค่า Custom Colors
      colors: {
        'my-custom-gray': '#666666',
        'my-custom-green': '#056839',
        primary: {
          50: '#f0f8ff',
          100: '#e0f0fe',
          200: '#c2e3fd',
          300: '#a3d5fc',
          400: '#6abef9',
          500: '#3fa6f6',
          600: '#258de4',
          700: '#1c71b5',
          800: '#195c92',
          900: '#194e77',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
