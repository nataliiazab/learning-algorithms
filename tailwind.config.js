/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // A warm, natural, non-corporate palette - think garden, not boardroom.
        cream: {
          50: "#FFFDF9",
          100: "#FBF6EC",
          200: "#F3E9D7",
          300: "#E9D9BE",
        },
        sage: {
          50: "#F4F7F1",
          100: "#E6EDDF",
          200: "#CBDBBD",
          300: "#AFC89C",
          400: "#96B77E",
          500: "#7EA363",
          600: "#668650",
          700: "#4F6A3D",
          800: "#3A4F2D",
        },
        terracotta: {
          50: "#FDF2EE",
          100: "#FBE0D5",
          200: "#F5BFA8",
          300: "#EF9E7C",
          400: "#E67F55",
          500: "#D96A3F",
          600: "#B5552F",
          700: "#8C4224",
          800: "#632F19",
        },
        blush: {
          50: "#FDF3F2",
          100: "#FAE1DE",
          200: "#F3C0BA",
          300: "#EC9F96",
          400: "#E58074",
          500: "#DC6456",
          600: "#BE4F42",
        },
        lavender: {
          50: "#F6F4FB",
          100: "#E9E3F5",
          200: "#D2C5EA",
          300: "#BBA7DF",
          400: "#A78ED2",
          500: "#9377C4",
          600: "#7A5FAA",
        },
        honey: {
          50: "#FEF8ED",
          100: "#FCEBC8",
          200: "#F8D68D",
          300: "#F3C158",
          400: "#EEA92E",
          500: "#DE9019",
        },
        ink: {
          50: "#F7F4F2",
          300: "#B5A399",
          500: "#8A7768",
          700: "#5B4A40",
          900: "#3B2F2A",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        blob: "60% 40% 30% 70% / 60% 30% 70% 40%",
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(59, 47, 42, 0.18)",
        softer: "0 4px 14px -4px rgba(59, 47, 42, 0.12)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        bob: "bob 2.4s ease-in-out infinite",
        wiggle: "wiggle 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
