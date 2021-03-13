module.exports = {
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        interlayYellow: {
          DEFAULT: '#f7931a'
        },
        interlayPink: {
          DEFAULT: '#e6007a'
        },
        interlayBlue: {
          DEFAULT: '#1c86ee'
        },
        interlayOrange: {
          DEFAULT: '#f95738'
        },
        interlayGreen: {
          DEFAULT: '#4ac948'
        },
        interlayRed: {
          DEFAULT: '#f32013'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
