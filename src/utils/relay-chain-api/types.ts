import { CollateralUnit } from '@interlay/interbtc-api';
import { Currency,MonetaryAmount } from '@interlay/monetary-js';
import { ApiPromise } from '@polkadot/api';

type RelayChainApi = ApiPromise;
type RelayChainMonetaryAmount = MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;

export type { RelayChainApi, RelayChainMonetaryAmount };
