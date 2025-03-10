/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-to-b": "linear-gradient(180deg, #A9D4FF 0%, #73B7FA 100%)",
        "gradient-to-c": "linear-gradient(180deg, #FDFFA9 0%, #FCFF58 100%)",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
        pyeongchang: ["PyeongChangPeace", "sans-serif"],
        code: [
          "source-code-pro",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Courier New"',
          "monospace",
        ],
      },
      boxShadow: {
        "custom-light": "0px 4px 4px rgba(59, 130, 246, 0.12)",
        "custom-heavy": "0px 0px 10px #A9D4FF",
        "custom-medium": "0px 0px 10px rgb(0, 140, 255);",
        "custom-yellow": "0px 0px 10px #F2F53C",
        "custom-gray": "0px 4px 20px rgba(158, 158, 158, 0.25)",
      },
      fontWeight: {
        100: "100",
        200: "200",
        300: "300",
        400: "400",
        500: "500",
        600: "600",
        700: "700",
        800: "800",
        900: "900",
      },
    },
    plugins: [require("tailwind-scrollbar-hide")],
  },
};
