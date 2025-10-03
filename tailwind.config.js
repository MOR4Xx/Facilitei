/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "Energia e Ação" - Refinada
        'primary': {
          DEFAULT: '#1E3A8A', // Azul Marinho Principal
          dark: '#1e3a8a',    // Um tom mais escuro para hover, etc.
        },
        'accent': {
          DEFAULT: '#F97316', // Laranja Vibrante
          hover: '#EA580C',   // Laranja mais escuro para hover
        },
        'light': {
          DEFAULT: '#FFFFFF', // Branco
          'subtle': '#F8FAFC' // Branco com um tom de cinza, para fundos
        },
        'dark': {
          'background': '#18181B', // Fundo Escuro (cinza "carvão")
          'surface': '#27272A',  // Cor para cards e superfícies
          'text': '#E4E4E7',      // Texto principal em fundos escuros
          'subtle': '#A1A1AA',   // Texto secundário, mais apagado
        },
      }
    },
  },
  plugins: [],
}