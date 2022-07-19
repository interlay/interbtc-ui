import { CollateralUnit, CurrencyIdLiteral, CurrencyUnit } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinUnit, Currency, ExchangeRate } from '@interlay/monetary-js';

type BTCToCollateralTokenRate = ExchangeRate<Bitcoin, BitcoinUnit, Currency<CollateralUnit>, CollateralUnit>;

type CurrencyValues = {
  currency: Currency<CurrencyUnit>;
  id: CurrencyIdLiteral;
};

// Note: this may be moved to the lib if used more widely, or removed altogether
// if `CurrencyIdLiteral` is extended to support aUSD
enum ForeignAssetIdLiteral {
  BTC = 'BTC'
}

type Currencies = Array<CurrencyValues>;

export type { BTCToCollateralTokenRate, Currencies, CurrencyValues };
export { ForeignAssetIdLiteral };
