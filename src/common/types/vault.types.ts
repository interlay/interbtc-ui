import { CollateralUnit, InterbtcPrimitivesVaultId, ReplaceRequestExt } from '@interlay/interbtc-api';
import { BitcoinAmount, Currency, MonetaryAmount } from '@interlay/monetary-js';
import { H256 } from '@polkadot/types/interfaces';

export interface VaultState {
  requests: Map<H256, ReplaceRequestExt>;
  collateralization: string | undefined;
  collateral: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  lockedBTC: BitcoinAmount;
  apy: string;
}

export type VaultApiType = [InterbtcPrimitivesVaultId, BitcoinAmount];
