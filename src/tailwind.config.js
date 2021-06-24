// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const plugin = require('tailwindcss/plugin');
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
const INTERLAY_MALACHITE = Object.freeze({
  50: '#f6fcf6',
  100: '#edfaed',
  200: '#d2f2d1',
  300: '#b7e9b6',
  400: '#80d97f',
  500: '#4ac948',
  600: '#43b541',
  700: '#389736',
  800: '#2c792b',
  900: '#246223'
});
const INTERLAY_SCARLET = Object.freeze({
  50: '#fef4f3',
  100: '#fee9e7',
  200: '#fcc7c4',
  300: '#faa6a1',
  400: '#f7635a',
  500: '#f32013',
  600: '#db1d11',
  700: '#b6180e',
  800: '#92130b',
  900: '#771009'
});
const INTERLAY_DODGER_BLUE = Object.freeze({
  50: '#f4f9fe',
  100: '#e8f3fd',
  200: '#c6e1fb',
  300: '#a4cff8',
  400: '#60aaf3',
  500: '#1c86ee',
  600: '#1979d6',
  700: '#1565b3',
  800: '#11508f',
  900: '#0e4275'
});
const INTERLAY_POMEGRANATE = Object.freeze({
  50: '#fff6f4',
  100: '#feece9',
  200: '#fdd0c7',
  300: '#fcb4a6',
  400: '#fa7b63',
  500: '#f84320',
  600: '#df3c1d',
  700: '#ba3218',
  800: '#952813',
  900: '#7a2110'
});
const INTERLAY_SILVER_CHALICE = Object.freeze({
  50: '#fbfbfb',
  100: '#f6f6f6',
  200: '#eaeaea',
  300: '#dddddd',
  400: '#c3c3c3',
  500: '#a9a9a9',
  600: '#989898',
  700: '#7f7f7f',
  800: '#656565',
  900: '#535353'
});
const INTERLAY_PURPLE_HEART = Object.freeze({
  50: '#faf6fe',
  100: '#f4eefd',
  200: '#e5d4f9',
  300: '#d5b9f5',
  400: '#b585ee',
  500: '#9551e6',
  600: '#8649cf',
  700: '#703dad',
  800: '#59318a',
  900: '#492871'
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
        interlayTreePoppy: {
          50: INTERLAY_TREE_POPPY[50],
          100: INTERLAY_TREE_POPPY[100],
          200: INTERLAY_TREE_POPPY[200],
          300: INTERLAY_TREE_POPPY[300],
          400: INTERLAY_TREE_POPPY[400],
          DEFAULT: INTERLAY_TREE_POPPY[500],
          600: INTERLAY_TREE_POPPY[600],
          700: INTERLAY_TREE_POPPY[700],
          800: INTERLAY_TREE_POPPY[800],
          900: INTERLAY_TREE_POPPY[900]
        },
        interlayDodgerBlue: {
          50: INTERLAY_DODGER_BLUE[50],
          100: INTERLAY_DODGER_BLUE[100],
          200: INTERLAY_DODGER_BLUE[200],
          300: INTERLAY_DODGER_BLUE[300],
          400: INTERLAY_DODGER_BLUE[400],
          DEFAULT: INTERLAY_DODGER_BLUE[500],
          600: INTERLAY_DODGER_BLUE[600],
          700: INTERLAY_DODGER_BLUE[700],
          800: INTERLAY_DODGER_BLUE[800],
          900: INTERLAY_DODGER_BLUE[900]
        },
        interlayScarlet: {
          50: INTERLAY_SCARLET[50],
          100: INTERLAY_SCARLET[100],
          200: INTERLAY_SCARLET[200],
          300: INTERLAY_SCARLET[300],
          400: INTERLAY_SCARLET[400],
          DEFAULT: INTERLAY_SCARLET[500],
          600: INTERLAY_SCARLET[600],
          700: INTERLAY_SCARLET[700],
          800: INTERLAY_SCARLET[800],
          900: INTERLAY_SCARLET[900]
        },
        interlaySilverChalice: {
          50: INTERLAY_SILVER_CHALICE[50],
          100: INTERLAY_SILVER_CHALICE[100],
          200: INTERLAY_SILVER_CHALICE[200],
          300: INTERLAY_SILVER_CHALICE[300],
          400: INTERLAY_SILVER_CHALICE[400],
          DEFAULT: INTERLAY_SILVER_CHALICE[500],
          600: INTERLAY_SILVER_CHALICE[600],
          700: INTERLAY_SILVER_CHALICE[700],
          800: INTERLAY_SILVER_CHALICE[800],
          900: INTERLAY_SILVER_CHALICE[900]
        },
        interlayRose: {
          50: INTERLAY_ROSE[50],
          100: INTERLAY_ROSE[100],
          200: INTERLAY_ROSE[200],
          300: INTERLAY_ROSE[300],
          400: INTERLAY_ROSE[400],
          DEFAULT: INTERLAY_ROSE[500],
          600: INTERLAY_ROSE[600],
          700: INTERLAY_ROSE[700],
          800: INTERLAY_ROSE[800],
          900: INTERLAY_ROSE[900]
        },
        interlayMalachite: {
          50: INTERLAY_MALACHITE[50],
          100: INTERLAY_MALACHITE[100],
          200: INTERLAY_MALACHITE[200],
          300: INTERLAY_MALACHITE[300],
          400: INTERLAY_MALACHITE[400],
          DEFAULT: INTERLAY_MALACHITE[500],
          600: INTERLAY_MALACHITE[600],
          700: INTERLAY_MALACHITE[700],
          800: INTERLAY_MALACHITE[800],
          900: INTERLAY_MALACHITE[900]
        },
        interlayPomegranate: {
          50: INTERLAY_POMEGRANATE[50],
          100: INTERLAY_POMEGRANATE[100],
          200: INTERLAY_POMEGRANATE[200],
          300: INTERLAY_POMEGRANATE[300],
          400: INTERLAY_POMEGRANATE[400],
          DEFAULT: INTERLAY_POMEGRANATE[500],
          600: INTERLAY_POMEGRANATE[600],
          700: INTERLAY_POMEGRANATE[700],
          800: INTERLAY_POMEGRANATE[800],
          900: INTERLAY_POMEGRANATE[900]
        },
        interlayPurpleHeart: {
          50: INTERLAY_PURPLE_HEART[50],
          100: INTERLAY_PURPLE_HEART[100],
          200: INTERLAY_PURPLE_HEART[200],
          300: INTERLAY_PURPLE_HEART[300],
          400: INTERLAY_PURPLE_HEART[400],
          DEFAULT: INTERLAY_PURPLE_HEART[500],
          600: INTERLAY_PURPLE_HEART[600],
          700: INTERLAY_PURPLE_HEART[700],
          800: INTERLAY_PURPLE_HEART[800],
          900: INTERLAY_PURPLE_HEART[900]
        },
        primary: {
          50: INTERLAY_ROSE[50],
          100: INTERLAY_ROSE[100],
          200: INTERLAY_ROSE[200],
          300: INTERLAY_ROSE[300],
          400: INTERLAY_ROSE[400],
          DEFAULT: INTERLAY_ROSE[500],
          600: INTERLAY_ROSE[600],
          700: INTERLAY_ROSE[700],
          800: INTERLAY_ROSE[800],
          contrastText: colors.white
        },
        secondary: {
          50: INTERLAY_TREE_POPPY[50],
          100: INTERLAY_TREE_POPPY[100],
          200: INTERLAY_TREE_POPPY[200],
          300: INTERLAY_TREE_POPPY[300],
          400: INTERLAY_TREE_POPPY[400],
          DEFAULT: INTERLAY_TREE_POPPY[500],
          600: INTERLAY_TREE_POPPY[600],
          700: INTERLAY_TREE_POPPY[700],
          800: INTERLAY_TREE_POPPY[800],
          contrastText: '#333333'
        }
      },
      textColor: theme => ({
        textPrimary: theme('colors.gray.900'),
        textSecondary: theme('colors.gray.400')
      }),
      backgroundColor: theme => ({
        default: theme('colors.gray.50')
      }),
      // MEMO: inspired by https://material-ui.com/customization/default-theme/
      zIndex: {
        interlayMobileStepper: 1000,
        interlaySpeedDial: 1050,
        interlayAppBar: 1100,
        interlayDrawer: 1200,
        interlayModal: 1300,
        interlaySnackbar: 1400,
        interlayTooltip: 1500
      }
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
    require('@tailwindcss/forms'),
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
