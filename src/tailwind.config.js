// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const plugin = require('tailwindcss/plugin');

const {
  INTERLAY_DENIM,
  INTERLAY_MULBERRY,
  INTERLAY_CONIFER,
  INTERLAY_BRIGHT_TURQUOISE,
  INTERLAY_CALIFORNIA,
  INTERLAY_CINNABAR,
  INTERLAY_PALE_SKY,
  INTERLAY_PURPLE_HEART,
  INTERLAY_DODGER_BLUE,
  INTERLAY_HAITI,
  KINTSUGI_MIDNIGHT,
  KINTSUGI_ALTO,
  KINTSUGI_PAVLOVA,
  KINTSUGI_PRAIRIE_SAND,
  KINTSUGI_VIOLET,
  KINTSUGI_SPINDLE,
  KINTSUGI_DEEP_FIR,
  KINTSUGI_JAMBALAYA,
  KINTSUGI_THUNDERBIRD,
  KINTSUGI_GRENADIER,
  KINTSUGI_SUNDOWN,
  KINTSUGI_SUPERNOVA,
  KINTSUGI_CURIOUS_BLUE,
  KINTSUGI_LAVENDER_PURPLE,
  KINTSUGI_APPLE,
  KINTSUGI_OCHRE,
  INTERLAY_TEXT_PRIMARY_IN_LIGHT_MODE,
  INTERLAY_TEXT_SECONDARY_IN_LIGHT_MODE,
  KINTSUGI_TEXT_PRIMARY_IN_DARK_MODE,
  KINTSUGI_TEXT_SECONDARY_IN_DARK_MODE
} = require('./utils/constants/colors');

module.exports = {
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      airbnbCereal: [
        'airbnb-cereal',
        'ui-sans-serif'
      ]
    },
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
        kintsugiMidnight: {
          50: KINTSUGI_MIDNIGHT[50],
          100: KINTSUGI_MIDNIGHT[100],
          200: KINTSUGI_MIDNIGHT[200],
          300: KINTSUGI_MIDNIGHT[300],
          400: KINTSUGI_MIDNIGHT[400],
          DEFAULT: KINTSUGI_MIDNIGHT[500],
          600: KINTSUGI_MIDNIGHT[600],
          700: KINTSUGI_MIDNIGHT[700],
          800: KINTSUGI_MIDNIGHT[800],
          900: KINTSUGI_MIDNIGHT[900]
        },
        kintsugiAlto: {
          50: KINTSUGI_ALTO[50],
          100: KINTSUGI_ALTO[100],
          200: KINTSUGI_ALTO[200],
          300: KINTSUGI_ALTO[300],
          400: KINTSUGI_ALTO[400],
          DEFAULT: KINTSUGI_ALTO[500],
          600: KINTSUGI_ALTO[600],
          700: KINTSUGI_ALTO[700],
          800: KINTSUGI_ALTO[800],
          900: KINTSUGI_ALTO[900]
        },
        kintsugiPavlova: {
          50: KINTSUGI_PAVLOVA[50],
          100: KINTSUGI_PAVLOVA[100],
          200: KINTSUGI_PAVLOVA[200],
          300: KINTSUGI_PAVLOVA[300],
          400: KINTSUGI_PAVLOVA[400],
          DEFAULT: KINTSUGI_PAVLOVA[500],
          600: KINTSUGI_PAVLOVA[600],
          700: KINTSUGI_PAVLOVA[700],
          800: KINTSUGI_PAVLOVA[800],
          900: KINTSUGI_PAVLOVA[900]
        },
        kintsugiPrairieSand: {
          50: KINTSUGI_PRAIRIE_SAND[50],
          100: KINTSUGI_PRAIRIE_SAND[100],
          200: KINTSUGI_PRAIRIE_SAND[200],
          300: KINTSUGI_PRAIRIE_SAND[300],
          400: KINTSUGI_PRAIRIE_SAND[400],
          DEFAULT: KINTSUGI_PRAIRIE_SAND[500],
          600: KINTSUGI_PRAIRIE_SAND[600],
          700: KINTSUGI_PRAIRIE_SAND[700],
          800: KINTSUGI_PRAIRIE_SAND[800],
          900: KINTSUGI_PRAIRIE_SAND[900]
        },
        kintsugiViolet: {
          50: KINTSUGI_VIOLET[50],
          100: KINTSUGI_VIOLET[100],
          200: KINTSUGI_VIOLET[200],
          300: KINTSUGI_VIOLET[300],
          400: KINTSUGI_VIOLET[400],
          DEFAULT: KINTSUGI_VIOLET[500],
          600: KINTSUGI_VIOLET[600],
          700: KINTSUGI_VIOLET[700],
          800: KINTSUGI_VIOLET[800],
          900: KINTSUGI_VIOLET[900]
        },
        kintsugiSpindle: {
          50: KINTSUGI_SPINDLE[50],
          100: KINTSUGI_SPINDLE[100],
          200: KINTSUGI_SPINDLE[200],
          300: KINTSUGI_SPINDLE[300],
          400: KINTSUGI_SPINDLE[400],
          DEFAULT: KINTSUGI_SPINDLE[500],
          600: KINTSUGI_SPINDLE[600],
          700: KINTSUGI_SPINDLE[700],
          800: KINTSUGI_SPINDLE[800],
          900: KINTSUGI_SPINDLE[900]
        },
        kintsugiDeepFir: {
          50: KINTSUGI_DEEP_FIR[50],
          100: KINTSUGI_DEEP_FIR[100],
          200: KINTSUGI_DEEP_FIR[200],
          300: KINTSUGI_DEEP_FIR[300],
          400: KINTSUGI_DEEP_FIR[400],
          DEFAULT: KINTSUGI_DEEP_FIR[500],
          600: KINTSUGI_DEEP_FIR[600],
          700: KINTSUGI_DEEP_FIR[700],
          800: KINTSUGI_DEEP_FIR[800],
          900: KINTSUGI_DEEP_FIR[900]
        },
        kintsugiJambalaya: {
          50: KINTSUGI_JAMBALAYA[50],
          100: KINTSUGI_JAMBALAYA[100],
          200: KINTSUGI_JAMBALAYA[200],
          300: KINTSUGI_JAMBALAYA[300],
          400: KINTSUGI_JAMBALAYA[400],
          DEFAULT: KINTSUGI_JAMBALAYA[500],
          600: KINTSUGI_JAMBALAYA[600],
          700: KINTSUGI_JAMBALAYA[700],
          800: KINTSUGI_JAMBALAYA[800],
          900: KINTSUGI_JAMBALAYA[900]
        },
        kintsugiThunderbird: {
          50: KINTSUGI_THUNDERBIRD[50],
          100: KINTSUGI_THUNDERBIRD[100],
          200: KINTSUGI_THUNDERBIRD[200],
          300: KINTSUGI_THUNDERBIRD[300],
          400: KINTSUGI_THUNDERBIRD[400],
          DEFAULT: KINTSUGI_THUNDERBIRD[500],
          600: KINTSUGI_THUNDERBIRD[600],
          700: KINTSUGI_THUNDERBIRD[700],
          800: KINTSUGI_THUNDERBIRD[800],
          900: KINTSUGI_THUNDERBIRD[900]
        },
        kintsugiGrenadier: {
          50: KINTSUGI_GRENADIER[50],
          100: KINTSUGI_GRENADIER[100],
          200: KINTSUGI_GRENADIER[200],
          300: KINTSUGI_GRENADIER[300],
          400: KINTSUGI_GRENADIER[400],
          DEFAULT: KINTSUGI_GRENADIER[500],
          600: KINTSUGI_GRENADIER[600],
          700: KINTSUGI_GRENADIER[700],
          800: KINTSUGI_GRENADIER[800],
          900: KINTSUGI_GRENADIER[900]
        },
        kintsugiSundown: {
          50: KINTSUGI_SUNDOWN[50],
          100: KINTSUGI_SUNDOWN[100],
          200: KINTSUGI_SUNDOWN[200],
          300: KINTSUGI_SUNDOWN[300],
          400: KINTSUGI_SUNDOWN[400],
          DEFAULT: KINTSUGI_SUNDOWN[500],
          600: KINTSUGI_SUNDOWN[600],
          700: KINTSUGI_SUNDOWN[700],
          800: KINTSUGI_SUNDOWN[800],
          900: KINTSUGI_SUNDOWN[900]
        },
        kintsugiSupernova: {
          50: KINTSUGI_SUPERNOVA[50],
          100: KINTSUGI_SUPERNOVA[100],
          200: KINTSUGI_SUPERNOVA[200],
          300: KINTSUGI_SUPERNOVA[300],
          400: KINTSUGI_SUPERNOVA[400],
          DEFAULT: KINTSUGI_SUPERNOVA[500],
          600: KINTSUGI_SUPERNOVA[600],
          700: KINTSUGI_SUPERNOVA[700],
          800: KINTSUGI_SUPERNOVA[800],
          900: KINTSUGI_SUPERNOVA[900]
        },
        kintsugiCuriousBlue: {
          50: KINTSUGI_CURIOUS_BLUE[50],
          100: KINTSUGI_CURIOUS_BLUE[100],
          200: KINTSUGI_CURIOUS_BLUE[200],
          300: KINTSUGI_CURIOUS_BLUE[300],
          400: KINTSUGI_CURIOUS_BLUE[400],
          DEFAULT: KINTSUGI_CURIOUS_BLUE[500],
          600: KINTSUGI_CURIOUS_BLUE[600],
          700: KINTSUGI_CURIOUS_BLUE[700],
          800: KINTSUGI_CURIOUS_BLUE[800],
          900: KINTSUGI_CURIOUS_BLUE[900]
        },
        kintsugiLavenderPurple: {
          50: KINTSUGI_LAVENDER_PURPLE[50],
          100: KINTSUGI_LAVENDER_PURPLE[100],
          200: KINTSUGI_LAVENDER_PURPLE[200],
          300: KINTSUGI_LAVENDER_PURPLE[300],
          400: KINTSUGI_LAVENDER_PURPLE[400],
          DEFAULT: KINTSUGI_LAVENDER_PURPLE[500],
          600: KINTSUGI_LAVENDER_PURPLE[600],
          700: KINTSUGI_LAVENDER_PURPLE[700],
          800: KINTSUGI_LAVENDER_PURPLE[800],
          900: KINTSUGI_LAVENDER_PURPLE[900]
        },
        kintsugiApple: {
          50: KINTSUGI_APPLE[50],
          100: KINTSUGI_APPLE[100],
          200: KINTSUGI_APPLE[200],
          300: KINTSUGI_APPLE[300],
          400: KINTSUGI_APPLE[400],
          DEFAULT: KINTSUGI_APPLE[500],
          600: KINTSUGI_APPLE[600],
          700: KINTSUGI_APPLE[700],
          800: KINTSUGI_APPLE[800],
          900: KINTSUGI_APPLE[900]
        },
        kintsugiOchre: {
          50: KINTSUGI_OCHRE[50],
          100: KINTSUGI_OCHRE[100],
          200: KINTSUGI_OCHRE[200],
          300: KINTSUGI_OCHRE[300],
          400: KINTSUGI_OCHRE[400],
          DEFAULT: KINTSUGI_OCHRE[500],
          600: KINTSUGI_OCHRE[600],
          700: KINTSUGI_OCHRE[700],
          800: KINTSUGI_OCHRE[800],
          900: KINTSUGI_OCHRE[900]
        },
        interlayTextPrimaryInLightMode: INTERLAY_TEXT_PRIMARY_IN_LIGHT_MODE,
        interlayTextSecondaryInLightMode: INTERLAY_TEXT_SECONDARY_IN_LIGHT_MODE,
        kintsugiTextPrimaryInDarkMode: KINTSUGI_TEXT_PRIMARY_IN_DARK_MODE,
        kintsugiTextSecondaryInDarkMode: KINTSUGI_TEXT_SECONDARY_IN_DARK_MODE
      },
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
        'last',
        // ray test touch <<
        'important'
        // ray test touch >>
      ],
      textColor: [
        'important'
      ],
      display: [
        'important'
      ],
      // ray test touch <<
      backgroundColor: [
        'important'
      ],
      boxShadow: [
        'important'
      ],
      padding: [
        'important'
      ]
      // ray test touch >>
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
          fontFamily: theme('fontFamily.airbnbCereal')
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
