/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        dashboard: ["Instrument Sans", "sans-serif"],
      },

      colors: {
        primary: "#2563EB",   // blue-600
        surface: "#F5F7FA",   // dashboard background
        border: "#E5E7EB",
        muted: "#6B7280",
      },

      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.04)",
      },

      borderRadius: {
        xl2: "14px",
      },
    },
  },

  plugins: [],
};
