/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
 ],
 theme: {
    extend: {
      colors: {
        'blue-gray': '#90A4AE', // Add your custom color here
        // You can add more custom colors as needed
      },
    },
 },
 plugins: [],
}
