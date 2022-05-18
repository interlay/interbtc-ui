import { CurrencyIdLiteral } from '@interlay/interbtc-api';
import { CurrencySymbols } from 'componentLibrary';

type CurrencyPair = {
  id: CurrencyIdLiteral;
  symbol: CurrencySymbols;
}

const CURRENCY_PAIRS: Array<CurrencyPair> = [
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

export { currencyIdToCurrencyPair };

export type { CurrencyPair, CurrencySymbols };
