import { CollateralUnit, CurrencyIdLiteral, CurrencyUnit } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinUnit, Currency, ExchangeRate } from '@interlay/monetary-js';

enum CurrencySymbols {
  DOT = 'DOT',
  INTERBTC = 'interBTC',
  INTR = 'INTR',
  KBTC = 'KBTC',
  KINT = 'KINT',
  KSM = 'KSM',
  // This allows us to avoid returning undefined from Array.find
  UNDEFINED = 'UNDEFINED'
}

type BTCToCollateralTokenRate = ExchangeRate<Bitcoin, BitcoinUnit, Currency<CollateralUnit>, CollateralUnit>;

type CurrencyValues = {
  currency: Currency<CurrencyUnit>;
  id: CurrencyIdLiteral;
  symbol: CurrencySymbols;
};

type Currencies = Array<CurrencyValues>;

export { CurrencySymbols };

export type { BTCToCollateralTokenRate, Currencies, CurrencyValues };
