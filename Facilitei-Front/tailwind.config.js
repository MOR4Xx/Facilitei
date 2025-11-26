// tailwind.config.js

import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#0D9488', 
          hover: '#0F766E',
          soft: '#115E59', 
        },
        accent: {
          DEFAULT: '#A3E635', 
          hover: '#84CC16',
          glow: '#A3E635', 
        },
        dark: {
          background: '#081426',
          surface: '#111E35', // Superfície principal
          surface_hover: '#182946', 
          text: '#E2E8F0',
          subtle: '#94A3B8',
        },
        // Cores semânticas para status
        status: {
          pending: '#F59E0B', // Amarelo/Laranja
          danger: '#EF4444', // Vermelho
          danger_hover: '#DC2626',
        }
      },
      // Efeito de sombra/brilho
      boxShadow: {
        'glow-accent': '0 0 16px 0 rgba(163, 230, 53, 0.3)',
        'glow-primary': '0 0 16px 0 rgba(13, 148, 136, 0.3)',
        'glow-danger': '0 0 16px 0 rgba(239, 68, 68, 0.3)',
      },
      // Animação de pulso mais sutil
      keyframes: {
        subtlePulse: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 0 0 rgba(163, 230, 53, 0.4)' },
          '50%': { opacity: 0.9, boxShadow: '0 0 12px 10px rgba(163, 230, 53, 0)' },
        }
      },
      animation: {
        'subtle-pulse': 'subtlePulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}