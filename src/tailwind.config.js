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
        // ray test touch <
        // TODO: could be `polkadotPink`
        interlayPink: {
          DEFAULT: '#e6007a'
        },
        // ray test touch >
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
          light: '#ed3855',
          DEFAULT: '#f32013'
        },
        // TODO: could use `Gray` shades from https://tailwindcss.com/docs/customizing-colors
        interlayGrey: {
          light: '#e9ecef', // TODO: could be gray-200 in the default theme
          DEFAULT: '#a9a9a9'
        },
        // ray test touch <
        // TODO: could be `bitcoin`
        interlayBitcoin: {
          DEFAULT: '#ff9900'
        }
        // ray test touch >
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
