
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./aim.html", "./luya.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'milk-pink': '#F8E1E9',
        'jelly-purple': '#D4A5D6',
        'bright-yellow': '#FFD700',
        'mint-green': '#98FB98',
        'sakura-white': '#FFF8F2',
        'deep-pink': '#FFD1DC', // 悬停渐变用
        // aim.html specific colors
        primary: '#6366f1',
        dark: '#0f172a',
        surface: '#1e293b',
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
      animation: {
        'pop-in': 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    },
  },
  plugins: [],
}