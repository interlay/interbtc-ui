import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { CurrencySymbols } from 'componentLibrary';
import { CurrencyPair, CurrencyPairs } from 'types/currency';

const CURRENCY_PAIRS: CurrencyPairs = [
  {
    id: CurrencyIdLiteral.DOT,
    symbol: CurrencySymbols.DOT
  },
  {
    id: CurrencyIdLiteral.INTERBTC,
    symbol: CurrencySymbols.INTERBTC
  },
  {
    id: CurrencyIdLiteral.INTR,
    symbol: CurrencySymbols.INTR
  },
  {
    id: CurrencyIdLiteral.KBTC,
    symbol: CurrencySymbols.KBTC
  },
  {
    id: CurrencyIdLiteral.KINT,
    symbol: CurrencySymbols.KINT
  },
  {
    id: CurrencyIdLiteral.KSM,
    symbol: CurrencySymbols.KSM
  }
];

const currencyIdToCurrencyPair = (idLiteral: CurrencyIdLiteral): CurrencyPair | undefined =>
  CURRENCY_PAIRS.find(pair => pair.id === idLiteral);

const getCurrencySymbol = (idLiteral: CurrencyIdLiteral): CurrencySymbols | undefined =>
  currencyIdToCurrencyPair(idLiteral)?.symbol;

export { currencyIdToCurrencyPair, getCurrencySymbol };

export type { CurrencyPair, CurrencySymbols };
