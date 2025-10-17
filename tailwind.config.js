// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D9488', 
          hover: '#0F766E',
        },
        accent: {
          DEFAULT: '#A3E635', 
          hover: '#84CC16',
          glow: '#A3E635', // 👈 Adicionada cor para o efeito de brilho
        },
        dark: {
          background: '#081426',
          surface: '#111E35',
          text: '#E2E8F0',
          subtle: '#94A3B8',
        },
      },
      // Efeito de sombra/brilho para o accent
      boxShadow: {
        'glow-accent': '0 0 16px 0 rgba(163, 230, 53, 0.3)',
        'glow-primary': '0 0 16px 0 rgba(13, 148, 136, 0.3)',
      },
    },
  },
  plugins: [],
}