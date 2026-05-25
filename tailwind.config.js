/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ¡Importante para que funcione tu clase "dark" en el html!
  content: [
    "./index.html",
    "./*.js",
    "./src/**/*.{html,js}" // Ajusta según donde guardes tus vistas dinamicas
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", 'serif'],
        sans: ["'Outfit'", 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      colors: {
        ula: {
          50: '#eef2ff',
          100: '#dbe3ff',
          300: '#6f8bff',
          500: '#2f55e0',
          600: '#1e3a8a',
          700: '#0A2A6E',
          800: '#0a1f54',
          900: '#06133a'
        }
      },
      boxShadow: {
        soft: '0 8px 30px rgba(2,6,23,0.06)',
        glow: '0 0 0 1px rgba(59,130,246,0.18), 0 20px 60px -20px rgba(59,130,246,0.45)'
      },
      animation: {
        'fade-up': 'fadeUp .55s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fadeIn .5s ease both',
        'pop': 'pop .35s cubic-bezier(.2,.9,.3,1.2) both',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        pop: { '0%': { transform: 'scale(.96)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}