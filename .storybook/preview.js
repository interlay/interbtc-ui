
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
    lightClass: CLASS_NAMES.LIGHT
  }
};

const decorators = [
  Story => (
    <div
      className={clsx(
        { 'text-interlayPrimaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:text-kintsugiPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
      )}>
      <Story />
    </div>
  )
];

export {
  parameters,
  decorators
};
