import { CurrencyExt, CurrencyIdLiteral } from '@interlay/interbtc-api';
import {
  InterBtc, // on Polkadot
  Interlay, // On Polkadot
  KBtc, // on Kusama
  Kintsugi, // On Kusama
  Kusama, // on Kusama
  Polkadot // on Polkadot
} from '@interlay/monetary-js';

const CURRENCIES: Array<CurrencyExt> = [Polkadot, InterBtc, Interlay, KBtc, Kintsugi, Kusama];

const getCurrency = (idLiteral: CurrencyIdLiteral): CurrencyExt => {
  const targetCurrency = CURRENCIES.find((currency) => currency.ticker === idLiteral);

  if (targetCurrency === undefined) {
    throw new Error('Something went wrong!');
  }

  return targetCurrency;
};

export { getCurrency };
