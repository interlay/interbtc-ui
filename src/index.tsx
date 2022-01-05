
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClientProvider,
  QueryClient
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
  Helmet,
  HelmetProvider
} from 'react-helmet-async';

import App from './App';
import { configureStore } from './store';
import reportWebVitals from './reportWebVitals';
import './index.css';

const store = configureStore();
window.isFetchingActive = false;

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <QueryClientProvider client={queryClient}>
          {/* ray test touch << */}
          <HelmetProvider>
            <Helmet>
              <link
                rel='apple-touch-icon'
                sizes='180x180'
                href='/interlay/apple-touch-icon.png' />
              <link
                rel='icon'
                type='image/png'
                sizes='32x32'
                href='/interlay/favicon-32x32.png' />
              <link
                rel='icon'
                type='image/png'
                sizes='16x16'
                href='/interlay/favicon-16x16.png' />
              {/*
                manifest.json provides metadata used when your web app is installed on a
                user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
              */}
              <link
                rel='mask-icon'
                href='/interlay/safari-pinned-tab.svg'
                color='#5bbad5' />
              <link
                rel='shortcut icon'
                href='/interlay/favicon.ico' />
              <meta
                name='msapplication-config'
                content='/interlay/browserconfig.xml' />
              <link
                rel='manifest'
                href='/interlay/site.webmanifest' />
              <title>interBTC</title>
              {/* Primary Meta Tags */}
              <meta
                name='title'
                content='interBTC' />
              <meta
                name='description'
                content='interBTC: Trustless and open DeFi access for your Bitcoin' />
              {/* Open Graph / Facebook */}
              <meta
                property='og:type'
                content='website' />
              <meta
                property='og:url'
                content='https://bridge.interlay.io' />
              <meta
                property='og:title'
                content='interBTC' />
              <meta
                property='og:description'
                content='interBTC: Trustless and open DeFi access for your Bitcoin' />
              <meta
                property='og:image'
                content='https://bridge.interlay.io/interlay/interbtc-meta-image.jpg' />
              <meta
                property='og:image:width'
                content='1200' />
              <meta
                property='og:image:height'
                content='598' />
              {/* Twitter */}
              <meta
                property='twitter:card'
                content='summary_large_image' />
              <meta
                property='twitter:url'
                content='https://bridge.interlay.io' />
              <meta
                property='twitter:title'
                content='interBTC' />
              <meta
                property='twitter:description'
                content='interBTC: Trustless and open DeFi access for your Bitcoin' />
              <meta
                property='twitter:image'
                content='https://bridge.interlay.io/interlay/interbtc-meta-image.jpg' />
            </Helmet>
            <App />
          </HelmetProvider>
          {/* ray test touch >> */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
