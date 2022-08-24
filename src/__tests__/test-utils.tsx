/* eslint-disable react/display-name */
import { render, RenderOptions } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React, { FC, ReactElement } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { createStore } from 'redux';

import { rootReducer } from '../common/reducers';

const queryClient = new QueryClient();

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  path?: `/${string}`;
}

const testStore = createStore(rootReducer);

const ProvidersWrapper: (history: MemoryHistory) => FC<{ children?: React.ReactNode }> = (history) => ({
  children
}) => {
  return (
    <Router history={history}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Provider store={testStore}>
            <Route> {children} </Route>
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

  return render(ui, { wrapper: ProvidersWrapper(history), ...options });
};

export * from '@testing-library/react';
export { customRender as render };
