const { transform } = require('typescript')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        center: true, // ทำให้ container อยู่ตรงกลาง
        padding: '2rem', // เพิ่ม padding รอบๆ container
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1240px',
          '2xl': '1496px', // หรือค่าที่ใหญ่กว่า เช่น '1920px'
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0%',
            transform: 'translateY(0)',
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
      colors: {
        'my-custom-gray': '#666666',
        'my-custom-green': '#056839',
        // 1. สีหลักของเรา
        primary: {
          50: '#f0f8ff',
          100: '#e0f0fe',
          200: '#c2e3fd',
          300: '#a3d5fc',
          400: '#6abef9',
          500: '#3fa6f6', // <-- สีหลักสำหรับปุ่ม
          600: '#258de4', // <-- สีตอน Hover
          700: '#1c71b5',
          800: '#195c92',
          900: '#194e77',
        },
        // 2. สีรองของเรา
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // <-- สีรอง
          600: '#0d9488',
        },
        danger: {
          500: '#ef4444', // <-- สีแดงหลัก
          600: '#dc2626', // <-- สีตอน Hover
        },
      },
    },
  },
  plugins: [],
}
