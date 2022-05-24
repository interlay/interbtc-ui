import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { CurrencyPair, CurrencyPairs, CurrencySymbols } from 'types/currency';

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

const getCurrencyPair = (idLiteral: CurrencyIdLiteral): CurrencyPair | undefined =>
  CURRENCY_PAIRS.find(pair => pair.id === idLiteral);

const getCurrencySymbol = (idLiteral: CurrencyIdLiteral): CurrencySymbols => {
  const currencyPair = getCurrencyPair(idLiteral);

  return currencyPair ? currencyPair.symbol : CurrencySymbols.UNDEFINED;
};

export { getCurrencyPair, getCurrencySymbol };

export type { CurrencyPair, CurrencySymbols };
