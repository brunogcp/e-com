/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      blue_light: '#b9e2fc',
      blue: '#2D3753',
      black: '#000000',
      black_light: '#242424',
      white: '#ffffff',
      grey_light: '#edeaeb',
      grey_dark: '#515151',
      red: '#c92a0e',
      green: '#3ba336',
      gold : '#f1c40f'
		},
    extend: {
      boxShadow: {
        'custom': '0 0px 3px 1px rgba(0, 0, 0, 0.08)',
      }
    }
  },
  plugins: [],
}
