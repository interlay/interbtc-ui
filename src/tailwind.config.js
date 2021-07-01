// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const plugin = require('tailwindcss/plugin');

// MEMO: inspired by https://javisperez.github.io/tailwindcolorshades
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

module.exports = {
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
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
      ],
      borderRadius: [
        'first',
        'last'
      ]
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-pseudo-elements'),
    plugin(function ({
      addBase,
      theme,
      addVariant,
      addUtilities
    }) {
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

      // MEMO: inspired by https://tailwindcss.com/docs/adding-base-styles#using-a-plugin
      addBase({
        body: {
          color: theme('textColor.textPrimary'),
          backgroundColor: theme('backgroundColor.default')
        }
      });

      // MEMO: inspired by https://github.com/tailwindlabs/tailwindcss/issues/493#issuecomment-610907147
      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`;
          rule.walkDecls(decl => {
            decl.important = true;
          });
        });
      });
    })
  ]
};
