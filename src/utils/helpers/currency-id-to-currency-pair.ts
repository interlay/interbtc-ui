import { CurrencyIdLiteral } from '@interlay/interbtc-api';
import { CurrencySymbols } from 'componentLibrary';

type CurrencyPair = {
  id: CurrencyIdLiteral;
  symbol: CurrencySymbols;
}

const CURRENCY_PAIRS: Array<CurrencyPair> = [
  {
    id: CurrencyIdLiteral.DOT,
    symbol: 'DOT'
  },
  {
    id: CurrencyIdLiteral.INTERBTC,
    symbol: 'interBTC'
  },
  {
    id: CurrencyIdLiteral.INTR,
    symbol: 'INTR'
  },
  {
    id: CurrencyIdLiteral.KBTC,
    symbol: 'kBTC'
  },
  {
    id: CurrencyIdLiteral.KINT,
    symbol: 'KINT'
  },
  {
    id: CurrencyIdLiteral.KSM,
    symbol: 'KSM'
  }
];

const currencyIdToCurrencyPair = (idLiteral: CurrencyIdLiteral): CurrencyPair | undefined =>
  CURRENCY_PAIRS.find(pair => pair.id === idLiteral);

export { currencyIdToCurrencyPair };

export type { CurrencyPair, CurrencySymbols };
