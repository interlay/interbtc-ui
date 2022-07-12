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

import { CurrencyValues, Currencies } from 'types/currency';

const CURRENCIES: Currencies = [
  {
    currency: Polkadot as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.DOT
  },
  {
    currency: InterBtc as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.INTERBTC
  },
  {
    currency: Interlay as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.INTR
  },
  {
    currency: KBtc as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.KBTC
  },
  {
    currency: Kintsugi as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.KINT
  },
  {
    currency: Kusama as Currency<CurrencyUnit>,
    id: CurrencyIdLiteral.KSM
  }
];

const getCurrency = (idLiteral: CurrencyIdLiteral): CurrencyValues | undefined =>
  CURRENCIES.find((currency) => currency.id === idLiteral);

export { getCurrency };
