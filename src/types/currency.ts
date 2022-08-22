import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { Bitcoin, ExchangeRate } from '@interlay/monetary-js';

type BTCToCollateralTokenRate = ExchangeRate<Bitcoin, CollateralCurrencyExt>;

// Note: this may be moved to the lib if used more widely, or removed altogether
// if `CurrencyIdLiteral` is extended to support aUSD
enum ForeignAssetIdLiteral {
  BTC = 'BTC'
}

export type { BTCToCollateralTokenRate };
export { ForeignAssetIdLiteral };
