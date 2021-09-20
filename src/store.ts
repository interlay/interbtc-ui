import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import { InterBtc } from '@interlay/interbtc';
import { FaucetClient } from '@interlay/interbtc-api';

import { rootReducer } from './common/reducers/index';
import { StoreState } from './common/types/util.types';

declare global {
  interface Window {
    bridge: InterBtc;
    faucet: FaucetClient;
    isFetchingActive: boolean;
  }
}

export const configureStore = (): StoreState => {
  const storeLogger = createLogger();
  const store = createStore(rootReducer, undefined, applyMiddleware(storeLogger));

  return store;
};
