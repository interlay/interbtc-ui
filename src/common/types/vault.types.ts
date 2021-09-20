import {
  BitcoinAmount,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import {
  ReplaceRequestExt,
  CollateralUnit
} from '@interlay/interbtc-api';
import { H256 } from '@polkadot/types/interfaces';

export interface VaultState {
  requests: Map<H256, ReplaceRequestExt>;
  collateralization: string | undefined;
  collateral: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  lockedBTC: BitcoinAmount;
  apy: string;
}
