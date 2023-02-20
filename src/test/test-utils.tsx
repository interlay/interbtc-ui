/* eslint-disable react/display-name */
import { act, render, RenderOptions } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React, { FC, ReactElement } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { createStore } from 'redux';

import { SubstrateLoadingAndErrorHandlingWrapper, SubstrateProvider } from '@/lib/substrate';

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
            <Route>
              <SubstrateProvider>
                <SubstrateLoadingAndErrorHandlingWrapper>{children}</SubstrateLoadingAndErrorHandlingWrapper>
              </SubstrateProvider>
            </Route>
          </Provider>
        </HelmetProvider>
      </QueryClientProvider>
    </Router>
  );
};

const customRender = async (ui: ReactElement, options?: CustomRenderOptions): Promise<ReturnType<typeof render>> => {
  const history = createMemoryHistory();
  if (options?.path) {
    history.push(options.path);
  }

  let _render;

  // Wrapped in act so async updates are awaited.
  await act(async () => {
    _render = render(ui, { wrapper: ProvidersWrapper(history), ...options });
  });

  return _render as any;
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
