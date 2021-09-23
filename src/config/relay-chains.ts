import {
  Currency,
  BitcoinUnit,
  KBtc, // on Kusama
  Kusama, // on Kusama
  KBtcAmount, // on Kusama
  InterBtc, // on Polkadot
  Polkadot, // on Polkadot
  InterBtcAmount // on Polkadot
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

if (!process.env.REACT_APP_RELAY_CHAIN_NAME) {
  throw new Error('Undefined relay chain name environment variable!');
}

let APP_NAME: string;
let WRAPPED_TOKEN: Currency<BitcoinUnit>;
let COLLATERAL_TOKEN: Currency<CollateralUnit>;
let PRICES_URL: string;
let COLLATERAL_TOKEN_SYMBOL: string;
let ORACLE_CURRENCY_KEY: string;

type WrappedTokenAmount =
  InterBtcAmount |
  KBtcAmount;

switch (process.env.REACT_APP_RELAY_CHAIN_NAME) {
case POLKADOT: {
  APP_NAME = 'interBTC';
  WRAPPED_TOKEN = InterBtc;
  COLLATERAL_TOKEN = Polkadot as Currency<CollateralUnit>;
  COLLATERAL_TOKEN_SYMBOL = 'polkadot';
  PRICES_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,${COLLATERAL_TOKEN_SYMBOL}&vs_currencies=usd`;
  ORACLE_CURRENCY_KEY = 'DOT';
  break;
}
case KUSAMA: {
  APP_NAME = 'kBTC';
  WRAPPED_TOKEN = KBtc;
  COLLATERAL_TOKEN = Kusama as Currency<CollateralUnit>;
  COLLATERAL_TOKEN_SYMBOL = 'kusama';
  PRICES_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,${COLLATERAL_TOKEN_SYMBOL}&vs_currencies=usd`;
  ORACLE_CURRENCY_KEY = 'KSM';
  break;
}
default: {
  throw new Error('Invalid relay chain name!');
}
}

export type {
  WrappedTokenAmount
};

export {
  APP_NAME,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN,
  PRICES_URL,
  COLLATERAL_TOKEN_SYMBOL,
  ORACLE_CURRENCY_KEY
};
