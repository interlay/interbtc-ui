
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
// import { GlobalStyles } from 'twin.macro';

import App from './App';
import { configureStore } from './store';
import reportWebVitals from './reportWebVitals';
import './index.css';

const store = configureStore();
window.isFetchingActive = false;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        {/* TODO: could avoid vanilla tailwindcss */}
        {/* <GlobalStyles /> */}
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
