import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ApiPromise } from '@polkadot/api';

type RelayChainApi = ApiPromise;
type RelayChainMonetaryAmount = MonetaryAmount<CollateralCurrencyExt>;

export type { RelayChainApi, RelayChainMonetaryAmount };
