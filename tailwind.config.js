/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",              // HTML-Dateien im Root-Verzeichnis
    "./scripts/**/*.js",     // Alle JavaScript-Dateien im scripts-Ordner
    "./styles/**/*.css",     // Alle CSS-Dateien im styles-Ordner
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}