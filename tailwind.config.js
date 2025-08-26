
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'milk-pink': '#F8E1E9',
        'jelly-purple': '#D4A5D6',
        'bright-yellow': '#FFD700',
        'mint-green': '#98FB98',
        'sakura-white': '#FFF8F2',
        'deep-pink': '#FFD1DC', // 悬停渐变用
      },
      fontFamily: {
        noto: ['Noto Sans JP', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem', // 确保 rounded-3xl
      },
      rotate: {
        '3': '3deg', // 悬停倾斜
      },
    },
  },
  plugins: [],
}