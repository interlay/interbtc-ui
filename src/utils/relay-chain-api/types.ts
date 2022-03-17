import {
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

type RelayChainMonetaryAmount = MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>

export type { RelayChainMonetaryAmount };
