import '../src/componentLibrary/theme/theme.interlay.css';
import '../src/componentLibrary/theme/theme.kintsugi.css';
import './sb-preview.css';
import { withThemes } from 'storybook-addon-themes/react';
import { addDecorator } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";

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
    // Needed to be specified here in order to apply styles to components rendered in portal.
    Decorator: withThemes 
  },
};

addDecorator(story => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>);

export {
  parameters
};
