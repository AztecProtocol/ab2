/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      {
        darktheme: {
          primary: "#F0B90B", // Golden yellow
          secondary: "#1E2026", // Dark blue-gray
          tertiary: "#F0B90B", // Golden yellow (same as primary for consistency)
          accent: "#F0B90B", // Golden yellow (for consistency)
          neutral: "#0B0E11", // Very dark blue-gray, almost black
          "base-content": "#FFFFFF", // White text
          "base-100": "#1E2026", // Dark blue-gray background
          info: "#3C90F8", // Bright blue
          success: "#02C076", // Green
          warning: "#F0B90B", // Golden yellow (same as primary)
          error: "#CF304A", // Red
          "--rounded-box": "0.75rem",
          "--rounded-btn": "6.25rem",
          "--rounded-badge": "6.25rem",
          // '--tab-radius': '0.5rem'
        },
      },
    ],
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1240px",
      },
    },
    fontFamily: {
      "work-sans": ["Work Sans", "sans-serif"],
    },
    extend: {
      colors: {
        golden: "#F0B90B", // Golden yellow
        "bg-dark": "#0B0E11", // Very dark blue-gray, almost black
        "bg-light": "#1E2026", // Dark blue-gray
      },
      backgroundImage: {
        "secret-sauce":
          "linear-gradient(180deg, #1E2026 0%, #181A20 50%, #0B0E11 100%)",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-animate")],
}