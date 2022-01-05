
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  QueryClientProvider,
  QueryClient
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { HelmetProvider } from 'react-helmet-async';

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
          <HelmetProvider>
            <App />
          </HelmetProvider>
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
