
import {
  Currency,
  // KBtc, // on Kusama
  // Kusama, // on Kusama
  // KusamaAmount, // on Kusama
  InterBtc, // on Polkadot
  Polkadot, // on Polkadot
  InterBtcAmount // on Polkadot
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

const ACCOUNT_ID_TYPE_NAME = 'AccountId';

// ray test touch <<<
const APP_NAME = 'interBTC';
// TODO: should be environment variables for easy configuration switch
// TODO: should be programable
const WRAPPED_TOKEN = InterBtc;
const COLLATERAL_TOKEN = Polkadot as Currency<CollateralUnit>;
type WrappedTokenAmount = InterBtcAmount;

export type {
  WrappedTokenAmount
};
// ray test touch >>>

export {
  APP_NAME,
  ACCOUNT_ID_TYPE_NAME,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN
};
