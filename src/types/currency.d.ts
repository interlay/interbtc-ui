
import { CollateralUnit, CurrencyIdLiteral } from '@interlay/interbtc-api';
import {
  Bitcoin,
  BitcoinUnit,
  ExchangeRate,
  Currency
} from '@interlay/monetary-js';

import { CurrencySymbols } from 'componentLibrary';

type BTCToCollateralTokenRate =
  ExchangeRate<
    Bitcoin,
    BitcoinUnit,
    Currency<CollateralUnit>,
    CollateralUnit
  >;

type CurrencyPair = {
  id: CurrencyIdLiteral;
  symbol: CurrencySymbols;
}

type CurrencyPairs = Array<CurrencyPair>;

export type {
  CurrencyPair,
  CurrencyPairs,
  BTCToCollateralTokenRate
};
