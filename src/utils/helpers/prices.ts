import { CurrencyIdLiteral } from '@interlay/interbtc-api';

import { ForeignAssetIdLiteral } from '@/types/currency';

import { Price, Prices } from '../hooks/api/use-get-prices';

const getTokenPrice = (
  prices: Prices | undefined,
  tokenIdLiteral: CurrencyIdLiteral | ForeignAssetIdLiteral | string
): Price | undefined => prices?.[tokenIdLiteral];

export { getTokenPrice };
