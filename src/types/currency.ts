import { CollateralUnit, CurrencyIdLiteral, CurrencyUnit } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinUnit, ExchangeRate, Currency } from '@interlay/monetary-js';

type BTCToCollateralTokenRate = ExchangeRate<Bitcoin, BitcoinUnit, Currency<CollateralUnit>, CollateralUnit>;

type CurrencyValues = {
  currency: Currency<CurrencyUnit>;
  id: CurrencyIdLiteral;
};

// Note: this may be moved to the lib if used more widely.
enum ForeignAssetIdLiteral {
  BTC = 'BTC'
}

type Currencies = Array<CurrencyValues>;

export type { CurrencyValues, Currencies, BTCToCollateralTokenRate };
export { ForeignAssetIdLiteral };
