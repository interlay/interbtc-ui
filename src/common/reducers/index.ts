import { combineReducers } from 'redux';

import { generalReducer as general } from './general.reducer';
import { redeemReducer as redeem } from './redeem.reducer';
import { vaultReducer as vault } from './vault.reducer';

const rootReducer = combineReducers({
  general,
  redeem,
  vault
});

export { rootReducer };
