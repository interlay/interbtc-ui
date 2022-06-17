import { CollateralUnit, CurrencyIdLiteral, CurrencyUnit } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinUnit, ExchangeRate, Currency } from '@interlay/monetary-js';

// ray test touch <
// TODO: duplicated with `CurrencyIdLiteral`
enum CurrencySymbols {
  BTC = 'BTC',
  DOT = 'DOT',
  INTERBTC = 'interBTC',
  INTR = 'INTR',
  KBTC = 'KBTC',
  KINT = 'KINT',
  KSM = 'KSM',
  // This allows us to avoid returning undefined from Array.find
  UNDEFINED = 'UNDEFINED'
}
// ray test touch >

type BTCToCollateralTokenRate = ExchangeRate<Bitcoin, BitcoinUnit, Currency<CollateralUnit>, CollateralUnit>;

type CurrencyValues = {
  currency: Currency<CurrencyUnit>;
  id: CurrencyIdLiteral;
  symbol: CurrencySymbols;
};

type Currencies = Array<CurrencyValues>;

export { CurrencySymbols };

export type { CurrencyValues, Currencies, BTCToCollateralTokenRate };
