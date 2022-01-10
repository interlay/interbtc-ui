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

const KINTSUGI_MIDNIGHT = Object.freeze({
  50: '#f2f3f5',
  100: '#e6e7eb',
  200: '#c0c4cc',
  300: '#9ba1ad',
  400: '#4f5a70',
  500: '#041333',
  600: '#04112e',
  700: '#030e26',
  800: '#020b1f',
  900: '#020919'
});
const KINTSUGI_ALTO = Object.freeze({
  50: '#fdfdfd',
  100: '#fbfbfb',
  200: '#f6f6f6',
  300: '#f0f0f0',
  400: '#e5e5e5',
  500: '#dadada',
  600: '#c4c4c4',
  700: '#a4a4a4',
  800: '#838383',
  900: '#6b6b6b'
});
const KINTSUGI_PAVLOVA = Object.freeze({
  50: '#fdfcfa',
  100: '#fcfaf6',
  200: '#f7f2e8',
  300: '#f3ebda',
  400: '#e9dbbf',
  500: '#e0cca3',
  600: '#cab893',
  700: '#a8997a',
  800: '#867a62',
  900: '#6e6450'
});
const KINTSUGI_PRAIRIE_SAND = Object.freeze({
  50: '#faf5f4',
  100: '#f5ebe9',
  200: '#e6cdc7',
  300: '#d7aea6',
  400: '#ba7263',
  500: '#9c3520',
  600: '#8c301d',
  700: '#752818',
  800: '#5e2013',
  900: '#4c1a10'
});
const KINTSUGI_VIOLET = Object.freeze({
  50: '#f4f2f5',
  100: '#e9e6eb',
  200: '#c8c0cc',
  300: '#a79bad',
  400: '#664f70',
  500: '#240433',
  600: '#20042e',
  700: '#1b0326',
  800: '#16021f',
  900: '#120219'
});
const KINTSUGI_SPINDLE = Object.freeze({
  50: '#fbfdfd',
  100: '#f8fafc',
  200: '#edf3f7',
  300: '#e1ecf3',
  400: '#cbdde9',
  500: '#b5cfe0',
  600: '#a3baca',
  700: '#889ba8',
  800: '#6d7c86',
  900: '#59656e'
});
const KINTSUGI_DEEP_FIR = Object.freeze({
  50: '#f2f5f3',
  100: '#e6ebe7',
  200: '#c0ccc3',
  300: '#9bad9e',
  400: '#4f7056',
  500: '#04330d',
  600: '#042e0c',
  700: '#03260a',
  800: '#021f08',
  900: '#021906'
});
const KINTSUGI_JAMBALAYA = Object.freeze({
  50: '#f7f5f3',
  100: '#efebe7',
  200: '#d7ccc4',
  300: '#bfada0',
  400: '#907058',
  500: '#603211',
  600: '#562d0f',
  700: '#48260d',
  800: '#3a1e0a',
  900: '#2f1908'
});
const KINTSUGI_THUNDERBIRD = Object.freeze({
  50: '#fbf5f3',
  100: '#f8ebe8',
  200: '#edccc5',
  300: '#e1aea3',
  400: '#cb715d',
  500: '#b53418',
  600: '#a32f16',
  700: '#882712',
  800: '#6d1f0e',
  900: '#59190c'
});
const KINTSUGI_GRENADIER = Object.freeze({
  50: '#fdf6f4',
  100: '#fbede8',
  200: '#f5d2c6',
  300: '#efb7a3',
  400: '#e4805f',
  500: '#d84a1a',
  600: '#c24317',
  700: '#a23814',
  800: '#822c10',
  900: '#6a240d'
});
const KINTSUGI_SUNDOWN = Object.freeze({
  50: '#fffbfc',
  100: '#fef7f8',
  200: '#fdebee',
  300: '#fbdee3',
  400: '#f9c6ce',
  500: '#f6adb9',
  600: '#dd9ca7',
  700: '#b9828b',
  800: '#94686f',
  900: '#79555b'
});
const KINTSUGI_SUPERNOVA = Object.freeze({
  50: '#fffcf2',
  100: '#fffae6',
  200: '#fff2bf',
  300: '#ffea99',
  400: '#ffdb4d',
  500: '#ffcb00',
  600: '#e6b700',
  700: '#bf9800',
  800: '#997a00',
  900: '#7d6300'
});
const KINTSUGI_CURIOUS_BLUE = Object.freeze({
  50: '#f2fafd',
  100: '#e6f5fc',
  200: '#bfe7f7',
  300: '#99d8f3',
  400: '#4dbae9',
  500: '#009de0',
  600: '#008dca',
  700: '#0076a8',
  800: '#005e86',
  900: '#004d6e'
});
const KINTSUGI_LAVENDER_PURPLE = Object.freeze({
  50: '#fbf9fb',
  100: '#f7f2f8',
  200: '#eadfed',
  300: '#ddcbe2',
  400: '#c4a5cd',
  500: '#aa7eb7',
  600: '#9971a5',
  700: '#805f89',
  800: '#664c6e',
  900: '#533e5a'
});
const KINTSUGI_APPLE = Object.freeze({
  50: '#f2faf2',
  100: '#e6f6e6',
  200: '#bfe8c0',
  300: '#99da99',
  400: '#4dbe4d',
  500: '#00a201',
  600: '#009201',
  700: '#007a01',
  800: '#006101',
  900: '#004f00'
});

// GOLDEN COLORS/ORANGE
const KINTSUGI_OCHRE = Object.freeze({
  50: '#fdf9f4',
  100: '#fcf2e9',
  200: '#f6dfc9',
  300: '#f1cba9',
  400: '#e7a468',
  500: '#dc7d27',
  600: '#c67123',
  700: '#a55e1d',
  800: '#844b17',
  900: '#6c3d13'
});

const INTERLAY_TEXT_PRIMARY_IN_LIGHT_MODE = INTERLAY_HAITI[500];
const INTERLAY_TEXT_SECONDARY_IN_LIGHT_MODE = INTERLAY_HAITI[300];
const KINTSUGI_TEXT_PRIMARY_IN_DARK_MODE = KINTSUGI_ALTO[50];
const KINTSUGI_TEXT_SECONDARY_IN_DARK_MODE = KINTSUGI_ALTO[500];
const INTERLAY_GRID_LINE_COLOR = 'rgba(0, 0, 0, 0.1)';
const INTERLAY_ZERO_LINE_COLOR = 'rgba(0, 0, 0, 0.25)';
const KINTSUGI_GRID_LINE_COLOR = 'rgba(255, 255, 255, 0.1)';
const KINTSUGI_ZERO_LINE_COLOR = 'rgba(255, 255, 255, 0.25)';

module.exports = {
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
  KINTSUGI_TEXT_SECONDARY_IN_DARK_MODE,

  INTERLAY_GRID_LINE_COLOR,
  INTERLAY_ZERO_LINE_COLOR,
  KINTSUGI_GRID_LINE_COLOR,
  KINTSUGI_ZERO_LINE_COLOR
};
