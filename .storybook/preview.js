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
};

export {
  parameters
};
