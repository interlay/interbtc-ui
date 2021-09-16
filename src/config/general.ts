
import {
  // KBtc, // on Kusama
  // Kusama, // on Kusama
  // KusamaAmount, // on Kusama
  InterBtc, // on Polkadot
  Polkadot, // on Polkadot
  PolkadotAmount // on Polkadot
} from '@interlay/monetary-js';

const APP_NAME = 'interBTC';

const ACCOUNT_ID_TYPE_NAME = 'AccountId';

// TODO: should be environment variables for easy configuration switch
// TODO: should be programable
const WRAPPED_TOKEN = InterBtc;
const COLLATERAL_CURRENCY = Polkadot;
type CollateralCurrencyAmount = PolkadotAmount;

export type {
  CollateralCurrencyAmount
};

export {
  APP_NAME,
  ACCOUNT_ID_TYPE_NAME,
  WRAPPED_TOKEN,
  COLLATERAL_CURRENCY
};
