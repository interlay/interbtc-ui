import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { generalReducer } from './general.reducer';
import { redeemReducer as redeem } from './redeem.reducer';
import { vaultReducer as vault } from './vault.reducer';

const generalPersistConfig = {
  key: 'general',
  storage: storage,
  whitelist: ['address']
};

const rootReducer = combineReducers({
  general: persistReducer(generalPersistConfig, generalReducer),
  redeem,
  vault
});

export { rootReducer };
