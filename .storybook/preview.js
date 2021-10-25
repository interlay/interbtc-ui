
import { themes } from '@storybook/theming';
import clsx from 'clsx';

import '../src/index.css';
import { CLASS_NAMES } from '../src/utils/constants/styles';
import {
  POLKADOT,
  KUSAMA
} from '../src/utils/constants/relay-chain-names';

const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      date: /Date$/
    }
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
        { 'text-interlayPrimaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'dark:text-kintsugiPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'bg-interlayHaiti-50': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
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
