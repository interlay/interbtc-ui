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
let WRAPPED_TOKEN_SYMBOL: string;
let WRAPPED_TOKEN: Currency<BitcoinUnit>;
let COLLATERAL_TOKEN: Currency<CollateralUnit>;
let PRICES_URL: string;
let RELAY_CHAIN_NAME: string;
let COLLATERAL_TOKEN_SYMBOL: string;

type WrappedTokenAmount =
  InterBtcAmount |
  KBtcAmount;

switch (process.env.REACT_APP_RELAY_CHAIN_NAME) {
case POLKADOT: {
  APP_NAME = 'interBTC';
  WRAPPED_TOKEN_SYMBOL = 'interBTC';
  WRAPPED_TOKEN = InterBtc;
  COLLATERAL_TOKEN = Polkadot as Currency<CollateralUnit>;
  RELAY_CHAIN_NAME = 'polkadot';
  PRICES_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,${RELAY_CHAIN_NAME}&vs_currencies=usd`;
  COLLATERAL_TOKEN_SYMBOL = 'DOT';
  break;
}
case KUSAMA: {
  APP_NAME = 'kBTC';
  WRAPPED_TOKEN_SYMBOL = 'kBTC';
  WRAPPED_TOKEN = KBtc;
  COLLATERAL_TOKEN = Kusama as Currency<CollateralUnit>;
  RELAY_CHAIN_NAME = 'kusama';
  PRICES_URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,${RELAY_CHAIN_NAME}&vs_currencies=usd`;
  COLLATERAL_TOKEN_SYMBOL = 'KSM';
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
  WRAPPED_TOKEN_SYMBOL,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN,
  PRICES_URL,
  RELAY_CHAIN_NAME,
  COLLATERAL_TOKEN_SYMBOL
};
