/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1E3A8A',      // Azul Marinho Principal
        'accent': {
          DEFAULT: '#F97316', // Laranja Vibrante
          hover: '#EA580C',   // Laranja mais escuro para hover
        },
        'light': '#FFFFFF',         // Branco puro
        'dark': {
          background: '#18181B', // Fundo Escuro (cinza "carvão")
          text: '#E4E4E7',      // Texto Claro (cinza bem claro)
        },
        'text-dark': '#09090B',    // Preto suave
      }
    },
  },
  plugins: [],
}