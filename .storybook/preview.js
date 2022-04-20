
import { themes } from '@storybook/theming';
import clsx from 'clsx';

import { CLASS_NAMES } from '../src/utils/constants/styles';
import {
  POLKADOT,
  KUSAMA
} from '../src/utils/constants/relay-chain-names';
import '../src/index.css';
import '../src/componentLibrary/theme/theme.base.css';
import '../src/componentLibrary/theme/theme.interlay.css';
import '../src/componentLibrary/theme/theme.kintsugi.css';

const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      date: /Date$/
    }
  },
  themes: {
    default: 'kintsugi',
    list: [
      { name: 'kintsugi', class: 'theme-kintsugi' },
      { name: 'interlay', class: 'theme-interlay' },
    ],
  },
  darkMode: {
    stylePreview: true,
    current: CLASS_NAMES.LIGHT,
    // Override the default dark theme
    dark: { ...themes.dark },
    // Override the default light theme
    light: { ...themes.normal },
    darkClass: CLASS_NAMES.DARK,
    lightClass: CLASS_NAMES.LIGHT,
    classTarget: 'html'
  }
};

const decorators = [
  Story => (
    <div
      className={clsx(
        { 'text-interlayTextPrimaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'bg-interlayHaiti-50': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:bg-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'h-screen',
        'p-4'
      )}>
      <Story />
    </div>
  )
];

export {
  parameters,
  decorators
};
