import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import { FaucetClient, InterBTCAPI } from '@interlay/interbtc';

import { rootReducer } from './common/reducers/index';
import { StoreState } from './common/types/util.types';

declare global {
  interface Window {
    polkaBTC: InterBTCAPI;
    faucet: FaucetClient;
    isFetchingActive: boolean;
  }
}

export const configureStore = (): StoreState => {
  const storeLogger = createLogger();
  const store = createStore(rootReducer, undefined, applyMiddleware(storeLogger));

  return store;
};
