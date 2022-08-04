import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { Price, Prices } from '@/common/types/util.types';
import { ForeignAssetIdLiteral } from '@/types/currency';

const getTokenPrice = (
  prices: Prices | undefined,
  tokenIdLiteral: CurrencyIdLiteral | ForeignAssetIdLiteral
): Price | undefined => {
  if (!prices) return;

  switch (tokenIdLiteral) {
    case ForeignAssetIdLiteral.BTC:
      return prices.bitcoin;
    case CurrencyIdLiteral.DOT:
      return prices.polkadot;
    case CurrencyIdLiteral.INTR:
      return prices.interlay;
    case CurrencyIdLiteral.INTERBTC:
      return prices['interlay-btc'];
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
