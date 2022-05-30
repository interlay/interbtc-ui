import '../src/componentLibrary/theme/theme.interlay.css';
import '../src/componentLibrary/theme/theme.kintsugi.css';
import './sb-preview.css';
import { addDecorator } from '@storybook/react';
import { withThemes } from 'storybook-addon-themes/react';

addDecorator(withThemes);

const parameters = {
  backgrounds: { disable: true },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      date: /Date$/
    }
  },
  themes: {
    default: 'kintsugi',
    clearable: false,
    list: [
      { name: 'kintsugi', class: ['theme-kintsugi', 'sb-preview', 'sb-kintsugi'], color: '#020919' },
      { name: 'interlay', class: ['theme-interlay', 'sb-preview', 'sb-interlay'], color: '#f4f3f5' }
    ],
  },
};

export {
  parameters
};
