import { CurrencyIdLiteral, CurrencyUnit } from '@interlay/interbtc-api';
import {
  Currency,
  InterBtc, // on Polkadot
  Interlay, // On Polkadot
  KBtc, // on Kusama
  Kintsugi, // On Kusama
  Kusama, // on Kusama
  Polkadot // on Polkadot
} from '@interlay/monetary-js';

import { Currencies, CurrencyValues } from '@/types/currency';

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
