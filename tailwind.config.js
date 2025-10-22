/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm artisan palette
        background: "#FAF7F2",   // cream
        foreground: "#1F2937",   // charcoal
        surface: "#FFFFFF",      // card
        border: "#E5E7EB",       // light line
        primary: "#B66A2A",      // copper CTA
        primaryHover: "#95531F", // darker copper
        brand: "#1F5C3E",        // deep green (logo match)
        muted: "#6B7280"         // subtle text
      },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: { soft: "0 10px 30px rgba(17,24,39,0.06)" }
    }
  },
  plugins: []
}
