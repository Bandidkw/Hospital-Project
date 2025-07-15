const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true, // ทำให้ container อยู่ตรงกลาง
        padding: '2rem', // เพิ่ม padding รอบๆ container
        // กำหนด max-width เองสำหรับแต่ละ breakpoint
        screens: {
          'sm': '600px',
          'md': '728px',
          'lg': '984px',
          'xl': '1240px',
          '2xl': '1496px', // หรือค่าที่ใหญ่กว่า เช่น '1920px'
        },
      },
      keyframes: {
        'fade-in-up':{
          '0%':{
            opacity:'0%',
            transform:'translateY(0)'
          },
          '100%':{
            opacity:'1',
            transform:'translateY(0)'
          }
        }
      },
      animation:{
        'fade-in-up':'fade-in-up 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};
