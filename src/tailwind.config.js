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
// TODO: not used for now
const INTERLAY_BRIGHT_TURQUOISE = Object.freeze({
  50: '#f4fdfd',
  100: '#e9fcfb',
  200: '#c7f7f5',
  300: '#a5f3ef',
  400: '#62e9e2',
  500: '#1ee0d6',
  600: '#1bcac1',
  700: '#17a8a1',
  800: '#128680',
  900: '#0f6e69'
});
const INTERLAY_CALIFORNIA = Object.freeze({
  50: '#fffaf2',
  100: '#fff5e6',
  200: '#ffe6bf',
  300: '#ffd699',
  400: '#ffb84d',
  500: '#ff9900',
  600: '#e68a00',
  700: '#bf7300',
  800: '#995c00',
  900: '#7d4b00'
});
// TODO: not from the design team
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
// TODO: not from the design team
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
// TODO: not used for now
const INTERLAY_PURPLE_HEART = Object.freeze({
  50: '#fbf7ff',
  100: '#f6efff',
  200: '#e9d6ff',
  300: '#dbbdff',
  400: '#c18cff',
  500: '#a65aff',
  600: '#9551e6',
  700: '#7d44bf',
  800: '#643699',
  900: '#512c7d'
});
// TODO: not used for now
const INTERLAY_DODGER_BLUE = Object.freeze({
  50: '#f5faff',
  100: '#ecf5ff',
  200: '#cfe5ff',
  300: '#b2d5ff',
  400: '#78b6ff',
  500: '#3e96ff',
  600: '#3887e6',
  700: '#2f71bf',
  800: '#255a99',
  900: '#1e4a7d'
});
const INTERLAY_HAITI = Object.freeze({
  50: '#f4f3f5',
  100: '#e8e7ea',
  200: '#c6c2cb',
  300: '#a39dab',
  400: '#5f546c',
  500: '#1a0a2d',
  600: '#170929',
  700: '#140822',
  800: '#10061b',
  900: '#0d0516'
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
        interlayBrightTurquoise: {
          50: INTERLAY_BRIGHT_TURQUOISE[50],
          100: INTERLAY_BRIGHT_TURQUOISE[100],
          200: INTERLAY_BRIGHT_TURQUOISE[200],
          300: INTERLAY_BRIGHT_TURQUOISE[300],
          400: INTERLAY_BRIGHT_TURQUOISE[400],
          DEFAULT: INTERLAY_BRIGHT_TURQUOISE[500],
          600: INTERLAY_BRIGHT_TURQUOISE[600],
          700: INTERLAY_BRIGHT_TURQUOISE[700],
          800: INTERLAY_BRIGHT_TURQUOISE[800],
          900: INTERLAY_BRIGHT_TURQUOISE[900]
        },
        interlayCalifornia: {
          50: INTERLAY_CALIFORNIA[50],
          100: INTERLAY_CALIFORNIA[100],
          200: INTERLAY_CALIFORNIA[200],
          300: INTERLAY_CALIFORNIA[300],
          400: INTERLAY_CALIFORNIA[400],
          DEFAULT: INTERLAY_CALIFORNIA[500],
          600: INTERLAY_CALIFORNIA[600],
          700: INTERLAY_CALIFORNIA[700],
          800: INTERLAY_CALIFORNIA[800],
          900: INTERLAY_CALIFORNIA[900]
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
        interlayHaiti: {
          50: INTERLAY_HAITI[50],
          100: INTERLAY_HAITI[100],
          200: INTERLAY_HAITI[200],
          300: INTERLAY_HAITI[300],
          400: INTERLAY_HAITI[400],
          DEFAULT: INTERLAY_HAITI[500],
          600: INTERLAY_HAITI[600],
          700: INTERLAY_HAITI[700],
          800: INTERLAY_HAITI[800],
          900: INTERLAY_HAITI[900]
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
        'after',
        'important'
      ],
      borderRadius: [
        'first',
        'last',
        'important'
      ],
      padding: [
        'important'
      ],
      maxWidth: [
        'important'
      ],
      width: [
        'important'
      ],
      fontSize: [
        'important'
      ],
      fontWeight: [
        'important'
      ],
      backdropFilter: [
        'important'
      ],
      backdropBlur: [
        'important'
      ],
      backgroundColor: [
        'important'
      ],
      backgroundOpacity: [
        'important'
      ],
      textColor: [
        'important'
      ],
      wordBreak: [
        'important'
      ],
      zIndex: [
        'important'
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
