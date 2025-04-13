/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary colors - refreshed for younger audience
        ivory: "#F8F9FA", // Cleaner white
        charcoal: "#2D3142", // Modern navy/dark blue
        // Accent colors - more vibrant
        blush: "#FF6B6B", // Vibrant coral instead of light pink
        gold: "#FFD166", // Brighter gold
        "rich-green": "#06D6A0", // Vibrant mint green
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#FFD166", // Match with new gold
        background: "#F8F9FA", // Match with new ivory
        foreground: "#2D3142", // Match with new charcoal
        primary: {
          DEFAULT: "#2D3142", // Match with new charcoal
          foreground: "#F8F9FA", // Match with new ivory
        },
        secondary: {
          DEFAULT: "#FF6B6B", // Match with new blush
          foreground: "#2D3142", // Match with new charcoal
        },
        destructive: {
          DEFAULT: "#EF476F", // More vibrant red
          foreground: "#F8F9FA", // Match with new ivory
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#FFD166", // Match with new gold
          foreground: "#2D3142", // Match with new charcoal
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D3142", // Match with new charcoal
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D3142", // Match with new charcoal
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.8s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 