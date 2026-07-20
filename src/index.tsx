import './index.css';
// TODO: import only one theme
import '@/component-library/theme/theme.interlay.css';
import '@/component-library/theme/theme.kintsugi.css';

import { configGlobalBig } from '@interlay/monetary-js';
import ReactDOM from 'react-dom';

import ThemeWrapper from '@/legacy-components/ThemeWrapper';

import ServiceHalted from './pages/ServiceHalted';
import reportWebVitals from './reportWebVitals';

configGlobalBig();

window.isFetchingActive = false;

// MEMO: The apps are halted. All routes and chain connections are bypassed; only the
// branded Service Halted page is rendered. Restore the full provider/router tree to re-enable.
ReactDOM.render(
  <ThemeWrapper>
    <ServiceHalted />
  </ThemeWrapper>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
