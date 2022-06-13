import { ApiPromise } from '@polkadot/api';
import { MonetaryAmount, Currency } from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

type RelayChainApi = ApiPromise;
type RelayChainMonetaryAmount = MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;

export type { RelayChainApi, RelayChainMonetaryAmount };
