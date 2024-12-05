/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        scbluefrance: '#000091',
        scdarkblue: '#1e2b50',
        sclightpurple: '#e3e3fd',
        sclightpurpledarker: '#cacafb',
        scpurplepop: '#6a6af4',
        desert: {
          // made with https://uicolors.app/create
          50: '#faf6ec',
          100: '#f3e8ce',
          200: '#e9d09f',
          300: '#dbb069',
          400: '#d0943f',
          500: '#c07f32',
          600: '#a76329',
          700: '#854823',
          800: '#6f3c24',
          900: '#5f3324',
          950: '#371911',
        },
      },
    },
  },
  plugins: [],
}
