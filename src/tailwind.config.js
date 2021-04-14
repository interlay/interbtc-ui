// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

// MEMO: inspired by https://javisperez.github.io/tailwindcolorshades
const INTERLAY_ROSE = Object.freeze({
  50: '#fef2f8',
  100: '#fde6f2',
  200: '#f9bfde',
  300: '#f599ca',
  400: '#ee4da2',
  500: '#e6007a', // MEMO: polkadot's branding pink
  600: '#cf006e',
  700: '#ad005c',
  800: '#8a0049',
  900: '#71003c'
});
const INTERLAY_TREE_POPPY = Object.freeze({
  50: '#fffaf4',
  100: '#fef4e8',
  200: '#fde4c6',
  300: '#fcd4a3',
  400: '#f9b35f',
  500: '#f7931a', // MEMO: bitcoin color
  600: '#de8417',
  700: '#b96e14',
  800: '#945810',
  900: '#79480d'
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
          DEFAULT: INTERLAY_ROSE[500]
        },
        interlayYellow: {
          light: '#ff9900',
          DEFAULT: INTERLAY_TREE_POPPY[500]
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
          lightest: INTERLAY_ROSE[200],
          lighter: INTERLAY_ROSE[300],
          light: INTERLAY_ROSE[400],
          DEFAULT: INTERLAY_ROSE[500],
          dark: INTERLAY_ROSE[600],
          darker: INTERLAY_ROSE[700],
          darkest: INTERLAY_ROSE[800],
          contrastText: colors.white
        },
        secondary: {
          lightest: INTERLAY_TREE_POPPY[200],
          lighter: INTERLAY_TREE_POPPY[300],
          light: INTERLAY_TREE_POPPY[400],
          DEFAULT: INTERLAY_TREE_POPPY[500],
          dark: INTERLAY_TREE_POPPY[600],
          darker: INTERLAY_TREE_POPPY[700],
          darkest: INTERLAY_TREE_POPPY[800],
          contrastText: '#333333'
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
