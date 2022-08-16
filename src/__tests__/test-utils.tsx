/* eslint-disable react/display-name */
import { render, RenderOptions } from '@testing-library/react';
import React, { FC, ReactElement } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@/store';
const queryClient = new QueryClient();

const ProvidersWrapper: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
          </Provider>
        </HelmetProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: ProvidersWrapper, ...options });

export * from '@testing-library/react';
export { customRender as render };
