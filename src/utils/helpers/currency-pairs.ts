import { CurrencyIdLiteral, CurrencyUnit } from '@interlay/interbtc-api';
import {
  Currency,
  KBtc, // on Kusama
  Kusama, // on Kusama
  Kintsugi, // On Kusama
  InterBtc, // on Polkadot
  Polkadot, // on Polkadot
  Interlay // On Polkadot
} from '@interlay/monetary-js';

import { CurrencyValues, Currencies, CurrencySymbols } from 'types/currency';

const CURRENCIES: Currencies = [
  {
    currency: Polkadot as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.DOT,
    symbol: CurrencySymbols.DOT
  },
  {
    currency: InterBtc as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.INTERBTC,
    symbol: CurrencySymbols.INTERBTC
  },
  {
    currency: Interlay as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.INTR,
    symbol: CurrencySymbols.INTR
  },
  {
    currency: KBtc as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.KBTC,
    symbol: CurrencySymbols.KBTC
  },
  {
    currency: Kintsugi as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.KINT,
    symbol: CurrencySymbols.KINT
  },
  {
    currency: Kusama as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.KSM,
    symbol: CurrencySymbols.KSM
  }
];

const getCurrencyPair = (idLiteral: CurrencyIdLiteral): CurrencyValues | undefined =>
  CURRENCIES.find(currency => currency.id === idLiteral);

const getCurrencySymbol = (idLiteral: CurrencyIdLiteral): CurrencySymbols => {
  const currencyPair = getCurrencyPair(idLiteral);

  return currencyPair ? currencyPair.symbol : CurrencySymbols.UNDEFINED;
};

export { getCurrencyPair, getCurrencySymbol };

export type { CurrencySymbols };
