import { CollateralIdLiteral, CurrencyIdLiteral } from '@interlay/interbtc-api';
import { Price, Prices } from 'common/types/util.types';

const getCollateralPrice = (prices: Prices, tokenIdLiteral: CollateralIdLiteral): Price | undefined => {
  switch (tokenIdLiteral) {
    case CurrencyIdLiteral.DOT:
      return prices.polkadot;
    case CurrencyIdLiteral.INTR:
      return prices.interlay;
    case CurrencyIdLiteral.KSM:
      return prices.kusama;
    case CurrencyIdLiteral.KINT:
      return prices.kintsugi;
    default:
      return undefined;
  }
};

export { getCollateralPrice };
