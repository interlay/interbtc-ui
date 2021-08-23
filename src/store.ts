import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
// ray test touch <<
import {
  InterBtc
} from '@interlay/interbtc';
import { FaucetClient } from '@interlay/interbtc-api';
// ray test touch >>

import { rootReducer } from './common/reducers/index';
import { StoreState } from './common/types/util.types';

declare global {
  interface Window {
    // ray test touch <<
    polkaBTC: InterBtc;
    // ray test touch >>
    faucet: FaucetClient;
    isFetchingActive: boolean;
  }
}

export const configureStore = (): StoreState => {
  const storeLogger = createLogger();
  const store = createStore(rootReducer, undefined, applyMiddleware(storeLogger));

  return store;
};
