import { CurrencyIdLiteral } from '@interlay/interbtc-api';
import { Price, Prices } from 'common/types/util.types';

// TODO: Add BTC to CurrencyIdLiteral in lib and remove union type
const getTokenPrice = (prices: Prices, tokenIdLiteral: CurrencyIdLiteral | 'BTC'): Price | undefined => {
  switch (tokenIdLiteral) {
    case 'BTC':
      return prices.bitcoin;
    case CurrencyIdLiteral.DOT:
      return prices.polkadot;
    case CurrencyIdLiteral.INTR:
      return prices.interlay;
    case CurrencyIdLiteral.KSM:
      return prices.kusama;
    case CurrencyIdLiteral.KINT:
      return prices.kintsugi;
    case CurrencyIdLiteral.KBTC:
      return prices['kintsugi-btc'];
    default:
      return undefined;
  }
};

export { getTokenPrice };
