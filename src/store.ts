import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { InterBtcApi, FaucetClient } from '@interlay/interbtc-api';

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

export { store, persistor };
