import { combineReducers } from 'redux';
import { generalReducer as general } from './general.reducer';
import { redeemReducer as redeem } from './redeem.reducer';
import { issueReducer as issue } from './issue.reducer';
import { vaultReducer as vault } from './vault.reducer';

export const rootReducer = combineReducers({
  general,
  redeem,
  issue,
  vault
});
