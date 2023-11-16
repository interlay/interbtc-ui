import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import {
  Bitcoin,
  InterBtc, // on Polkadot
  Interlay, // On Polkadot
  KBtc, // on Kusama
  Kintsugi, // On Kusama
  Kusama, // on Kusama
  Polkadot // on Polkadot
} from '@interlay/monetary-js';

import { GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';

import { COINGECKO_IDS } from './api';
import { POLKADOT } from './relay-chain-names';

const ZERO_VOTE_GOVERNANCE_TOKEN_AMOUNT = newMonetaryAmount(0, VOTE_GOVERNANCE_TOKEN, true);
const ZERO_GOVERNANCE_TOKEN_AMOUNT = newMonetaryAmount(0, GOVERNANCE_TOKEN, true);

const isPolkadotChain = process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT;

// TODO: Pull values in from lib, as we do with vault collaterals
const NATIVE_CURRENCIES: Array<CurrencyExt> = isPolkadotChain
  ? [Polkadot, InterBtc, Interlay]
  : [KBtc, Kintsugi, Kusama];

const FEE_TICKERS = [...NATIVE_CURRENCIES.map(({ ticker }) => ticker), 'USDT'];

const BIFROST_RELAY_CHAIN_NATIVE_TOKEN = isPolkadotChain ? 'VDOT' : 'VKSM';

const COINGECKO_ID_BY_CURRENCY_TICKER: Record<string, typeof COINGECKO_IDS[number]> = Object.freeze({
  [Bitcoin.ticker]: 'bitcoin',
  [Kintsugi.ticker]: 'kintsugi',
  [KBtc.ticker]: 'bitcoin',
  [Kusama.ticker]: 'kusama',
  [Polkadot.ticker]: 'polkadot',
  [Interlay.ticker]: 'interlay',
  [InterBtc.ticker]: 'bitcoin'
});

export {
  BIFROST_RELAY_CHAIN_NATIVE_TOKEN,
  COINGECKO_ID_BY_CURRENCY_TICKER,
  FEE_TICKERS,
  NATIVE_CURRENCIES,
  ZERO_GOVERNANCE_TOKEN_AMOUNT,
  ZERO_VOTE_GOVERNANCE_TOKEN_AMOUNT
};
