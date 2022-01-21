import { createLogger } from 'redux-logger';
import {
  applyMiddleware,
  createStore
} from 'redux';
import { persistStore } from 'redux-persist';
import { InterBtc } from '@interlay/interbtc';
import { FaucetClient } from '@interlay/interbtc-api';

import { rootReducer } from './common/reducers/index';

declare global {
  interface Window {
    bridge: InterBtc;
    faucet: FaucetClient;
    isFetchingActive: boolean;
  }
}

const storeLogger = createLogger();
const store = createStore(rootReducer, undefined, applyMiddleware(storeLogger));
const persistor = persistStore(store);

export {
  store,
  persistor
};
