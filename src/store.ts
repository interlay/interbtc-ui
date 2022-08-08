import { FaucetClient, InterBtcApi } from '@interlay/interbtc-api';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';

import { rootReducer } from './common/reducers/index';

declare global {
  interface Window {
    bridge: InterBtcApi;
    faucet: FaucetClient;
    isFetchingActive: boolean;
  }
}

const storeLogger = createLogger();
const store = createStore(rootReducer, undefined, applyMiddleware(storeLogger));
const persistor = persistStore(store);

export { persistor, store };
