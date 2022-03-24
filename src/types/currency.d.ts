
import { CollateralUnit } from '@interlay/interbtc-api';
import {
  Bitcoin,
  BitcoinUnit,
  ExchangeRate,
  Currency
} from '@interlay/monetary-js';

type BTCToCollateralTokenRate =
  ExchangeRate<
    Bitcoin,
    BitcoinUnit,
    Currency<CollateralUnit>,
    CollateralUnit
  >;

export type {
  BTCToCollateralTokenRate
};
