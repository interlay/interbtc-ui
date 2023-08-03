import { InterBtcApi } from '@interlay/interbtc-api';
import { createStore } from 'redux';

import { rootReducer } from './common/reducers/index';

declare global {
  interface Window {
    bridge: InterBtcApi;
    isFetchingActive: boolean;
  }
}

const store = createStore(rootReducer, undefined);

export { store };
