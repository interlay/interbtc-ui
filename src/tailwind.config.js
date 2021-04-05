// TODO: should type properly
// @ts-nocheck

const plugin = require('tailwindcss/plugin');

const colors = require('tailwindcss/colors');

const BASE_COLORS = Object.freeze({
  polkadotPink: '#e6007a', // MEMO: polkadot's branding pink
  bitcoinColor: '#f7931a' // MEMO: bitcoin color
});

module.exports = {
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        interlayPink: {
          DEFAULT: BASE_COLORS.polkadotPink
        },
        interlayYellow: {
          light: '#ff9900',
          DEFAULT: BASE_COLORS.bitcoinColor
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
          light: '#ed3855',
          DEFAULT: '#f32013'
        },
        // TODO: could use `Gray` shades from https://tailwindcss.com/docs/customizing-colors
        interlayGrey: {
          light: '#e9ecef', // TODO: could be gray-200 in the default theme
          DEFAULT: '#a9a9a9'
        },
        primary: {
          lightest: '#ff70bc',
          lighter: '#ff47a9',
          light: '#ff1f96',
          DEFAULT: BASE_COLORS.polkadotPink,
          dark: '#cc006d',
          darker: '#a30057',
          darkest: '#7a0041',
          contrastText: colors.white
        },
        secondary: {
          lightest: '#fbd19d',
          lighter: '#fabe75',
          light: '#f9ac4e',
          DEFAULT: BASE_COLORS.bitcoinColor,
          dark: '#ec8609',
          darker: '#c56f07',
          darkest: '#9d5906',
          contrastText: colors.white
        }
      },
      textColor: theme => ({
        textPrimary: theme('colors.gray.900'),
        textSecondary: theme('colors.gray.400')
      }),
      backgroundColor: theme => ({
        paper: theme('colors.white'),
        default: theme('colors.gray.50')
      })
    }
  },
  variants: {
    extend: {
      borderColor: [
        'before',
        'after'
      ]
    }
  },
  plugins: [
    require('tailwindcss-pseudo-elements'),
    plugin(function ({ addUtilities }) {
      addUtilities(
        {
          '.empty-content': {
            content: '""'
          }
        },
        [
          'before',
          'after'
        ]
      );
    })
  ]
};
