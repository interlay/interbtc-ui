/* eslint-disable react/display-name */
import { render, RenderOptions } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React, { FC, ReactElement } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@/store';

const queryClient = new QueryClient();

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  path?: `/${string}`;
}

const ProvidersWrapper: (history: MemoryHistory) => FC<{ children?: React.ReactNode }> = (history) => ({
  children
}) => {
  return (
    <Router history={history}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Route> {children} </Route>
            </PersistGate>
          </Provider>
        </HelmetProvider>
      </QueryClientProvider>
    </Router>
  );
};

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const history = createMemoryHistory();
  if (options?.path) {
    history.push(options.path);
  }

  render(ui, { wrapper: ProvidersWrapper(history), ...options });
};

export * from '@testing-library/react';
export { customRender as render };
