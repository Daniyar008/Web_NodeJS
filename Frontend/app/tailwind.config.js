/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2267E3',
        primaryDark: '#163D9A',
        sidebar: '#0E1B3D',
        surface: '#FFFFFF',
        bg: '#F5F7FB',
      },
      boxShadow: {
        card: '0 10px 30px rgba(16, 24, 40, 0.08)',
      },
      borderRadius: {
        xl: '18px',
        '2xl': '22px',
        '3xl': '28px',
      },
    },
  },
  plugins: [],
}

