
import {
  Currency,
  // KBtc, // on Kusama
  // Kusama, // on Kusama
  // KusamaAmount, // on Kusama
  InterBtc, // on Polkadot
  Polkadot // on Polkadot
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

const APP_NAME = 'interBTC';

const ACCOUNT_ID_TYPE_NAME = 'AccountId';

// TODO: should be environment variables for easy configuration switch
// TODO: should be programable
const WRAPPED_TOKEN = InterBtc;
const COLLATERAL_CURRENCY = Polkadot as Currency<CollateralUnit>;

export {
  APP_NAME,
  ACCOUNT_ID_TYPE_NAME,
  WRAPPED_TOKEN,
  COLLATERAL_CURRENCY
};
