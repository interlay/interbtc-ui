// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const plugin = require('tailwindcss/plugin');

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
const INTERLAY_FRENCH_GRAY = Object.freeze({
  50: '#fcfcfc',
  100: '#f9f8f9',
  200: '#f0eff0',
  300: '#e7e5e7',
  400: '#d6d1d6',
  500: '#c4bdc4',
  600: '#b0aab0',
  700: '#938e93',
  800: '#767176',
  900: '#605d60'
});
const INTERLAY_OUTRAGEOUS_ORANGE = Object.freeze({
  50: '#fff7f5',
  100: '#feeeeb',
  200: '#fed5cd',
  300: '#fdbcaf',
  400: '#fb8974',
  500: '#f95738',
  600: '#e04e32',
  700: '#bb412a',
  800: '#953422',
  900: '#7a2b1b'
});
// ray test touch <<
const INTERLAY_DENIM = Object.freeze({
  50: '#f3f7fc',
  100: '#e6eff8',
  200: '#c1d6ee',
  300: '#9cbde4',
  400: '#518cd0',
  500: '#075abc',
  600: '#0651a9',
  700: '#05448d',
  800: '#043671',
  900: '#032c5c'
});
const INTERLAY_MULBERRY = Object.freeze({
  50: '#fdf7fb',
  100: '#fbeff7',
  200: '#f6d6eb',
  300: '#f1bdde',
  400: '#e68cc6',
  500: '#db5aad',
  600: '#c5519c',
  700: '#a44482',
  800: '#833668',
  900: '#6b2c55'
});
const INTERLAY_CONIFER = Object.freeze({
  50: '#fafef7',
  100: '#f6fdef',
  200: '#e8f9d7',
  300: '#daf5bf',
  400: '#beee8e',
  500: '#a2e75e',
  600: '#92d055',
  700: '#7aad47',
  800: '#618b38',
  900: '#4f712e'
});
const INTERLAY_MOUNTAIN_MEADOW = Object.freeze({
  50: '#f3fcf9',
  100: '#e7f8f2',
  200: '#c3eee0',
  300: '#9fe3cd',
  400: '#58cea7',
  500: '#10b981',
  600: '#0ea774',
  700: '#0c8b61',
  800: '#0a6f4d',
  900: '#085b3f'
});
const INTERLAY_ORANGE_PEEL = Object.freeze({
  50: '#fffaf3',
  100: '#fef5e7',
  200: '#fde7c2',
  300: '#fbd89d',
  400: '#f8bb54',
  500: '#f59e0b',
  600: '#dd8e0a',
  700: '#b87708',
  800: '#935f07',
  900: '#784d05'
});
const INTERLAY_CINNABAR = Object.freeze({
  50: '#fef6f6',
  100: '#fdecec',
  200: '#fbd0d0',
  300: '#f9b4b4',
  400: '#f47c7c',
  500: '#ef4444',
  600: '#d73d3d',
  700: '#b33333',
  800: '#8f2929',
  900: '#752121'
});
const INTERLAY_PALE_SKY = Object.freeze({
  50: '#f8f8f9',
  100: '#f0f1f2',
  200: '#dadcdf',
  300: '#c4c7cc',
  400: '#979ca6',
  500: '#6b7280',
  600: '#606773',
  700: '#505660',
  800: '#40444d',
  900: '#34383f'
});
// ray test touch >>

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
        interlayFrenchGray: {
          50: INTERLAY_FRENCH_GRAY[50],
          100: INTERLAY_FRENCH_GRAY[100],
          200: INTERLAY_FRENCH_GRAY[200],
          300: INTERLAY_FRENCH_GRAY[300],
          400: INTERLAY_FRENCH_GRAY[400],
          DEFAULT: INTERLAY_FRENCH_GRAY[500],
          600: INTERLAY_FRENCH_GRAY[600],
          700: INTERLAY_FRENCH_GRAY[700],
          800: INTERLAY_FRENCH_GRAY[800],
          900: INTERLAY_FRENCH_GRAY[900]
        },
        interlayOutrageousOrange: {
          50: INTERLAY_OUTRAGEOUS_ORANGE[50],
          100: INTERLAY_OUTRAGEOUS_ORANGE[100],
          200: INTERLAY_OUTRAGEOUS_ORANGE[200],
          300: INTERLAY_OUTRAGEOUS_ORANGE[300],
          400: INTERLAY_OUTRAGEOUS_ORANGE[400],
          DEFAULT: INTERLAY_OUTRAGEOUS_ORANGE[500],
          600: INTERLAY_OUTRAGEOUS_ORANGE[600],
          700: INTERLAY_OUTRAGEOUS_ORANGE[700],
          800: INTERLAY_OUTRAGEOUS_ORANGE[800],
          900: INTERLAY_OUTRAGEOUS_ORANGE[900]
        },
        // ray test touch <<
        interlayDenim: {
          50: INTERLAY_DENIM[50],
          100: INTERLAY_DENIM[100],
          200: INTERLAY_DENIM[200],
          300: INTERLAY_DENIM[300],
          400: INTERLAY_DENIM[400],
          DEFAULT: INTERLAY_DENIM[500],
          600: INTERLAY_DENIM[600],
          700: INTERLAY_DENIM[700],
          800: INTERLAY_DENIM[800],
          900: INTERLAY_DENIM[900]
        },
        interlayMulberry: {
          50: INTERLAY_MULBERRY[50],
          100: INTERLAY_MULBERRY[100],
          200: INTERLAY_MULBERRY[200],
          300: INTERLAY_MULBERRY[300],
          400: INTERLAY_MULBERRY[400],
          DEFAULT: INTERLAY_MULBERRY[500],
          600: INTERLAY_MULBERRY[600],
          700: INTERLAY_MULBERRY[700],
          800: INTERLAY_MULBERRY[800],
          900: INTERLAY_MULBERRY[900]
        },
        interlayConifer: {
          50: INTERLAY_CONIFER[50],
          100: INTERLAY_CONIFER[100],
          200: INTERLAY_CONIFER[200],
          300: INTERLAY_CONIFER[300],
          400: INTERLAY_CONIFER[400],
          DEFAULT: INTERLAY_CONIFER[500],
          600: INTERLAY_CONIFER[600],
          700: INTERLAY_CONIFER[700],
          800: INTERLAY_CONIFER[800],
          900: INTERLAY_CONIFER[900]
        },
        interlayMountainMeadow: {
          50: INTERLAY_MOUNTAIN_MEADOW[50],
          100: INTERLAY_MOUNTAIN_MEADOW[100],
          200: INTERLAY_MOUNTAIN_MEADOW[200],
          300: INTERLAY_MOUNTAIN_MEADOW[300],
          400: INTERLAY_MOUNTAIN_MEADOW[400],
          DEFAULT: INTERLAY_MOUNTAIN_MEADOW[500],
          600: INTERLAY_MOUNTAIN_MEADOW[600],
          700: INTERLAY_MOUNTAIN_MEADOW[700],
          800: INTERLAY_MOUNTAIN_MEADOW[800],
          900: INTERLAY_MOUNTAIN_MEADOW[900]
        },
        interlayOrangePeel: {
          50: INTERLAY_ORANGE_PEEL[50],
          100: INTERLAY_ORANGE_PEEL[100],
          200: INTERLAY_ORANGE_PEEL[200],
          300: INTERLAY_ORANGE_PEEL[300],
          400: INTERLAY_ORANGE_PEEL[400],
          DEFAULT: INTERLAY_ORANGE_PEEL[500],
          600: INTERLAY_ORANGE_PEEL[600],
          700: INTERLAY_ORANGE_PEEL[700],
          800: INTERLAY_ORANGE_PEEL[800],
          900: INTERLAY_ORANGE_PEEL[900]
        },
        interlayCinnabar: {
          50: INTERLAY_CINNABAR[50],
          100: INTERLAY_CINNABAR[100],
          200: INTERLAY_CINNABAR[200],
          300: INTERLAY_CINNABAR[300],
          400: INTERLAY_CINNABAR[400],
          DEFAULT: INTERLAY_CINNABAR[500],
          600: INTERLAY_CINNABAR[600],
          700: INTERLAY_CINNABAR[700],
          800: INTERLAY_CINNABAR[800],
          900: INTERLAY_CINNABAR[900]
        },
        interlayPaleSky: {
          50: INTERLAY_PALE_SKY[50],
          100: INTERLAY_PALE_SKY[100],
          200: INTERLAY_PALE_SKY[200],
          300: INTERLAY_PALE_SKY[300],
          400: INTERLAY_PALE_SKY[400],
          DEFAULT: INTERLAY_PALE_SKY[500],
          600: INTERLAY_PALE_SKY[600],
          700: INTERLAY_PALE_SKY[700],
          800: INTERLAY_PALE_SKY[800],
          900: INTERLAY_PALE_SKY[900]
        },
        primary: {
          50: INTERLAY_DENIM[50],
          100: INTERLAY_DENIM[100],
          200: INTERLAY_DENIM[200],
          300: INTERLAY_DENIM[300],
          400: INTERLAY_DENIM[400],
          DEFAULT: INTERLAY_DENIM[500],
          600: INTERLAY_DENIM[600],
          700: INTERLAY_DENIM[700],
          800: INTERLAY_DENIM[800],
          900: INTERLAY_DENIM[900]
        },
        secondary: {
          50: INTERLAY_MULBERRY[50],
          100: INTERLAY_MULBERRY[100],
          200: INTERLAY_MULBERRY[200],
          300: INTERLAY_MULBERRY[300],
          400: INTERLAY_MULBERRY[400],
          DEFAULT: INTERLAY_MULBERRY[500],
          600: INTERLAY_MULBERRY[600],
          700: INTERLAY_MULBERRY[700],
          800: INTERLAY_MULBERRY[800],
          900: INTERLAY_MULBERRY[900]
        }
        // ray test touch >>
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
