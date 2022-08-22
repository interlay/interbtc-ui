import { CollateralCurrencyExt, InterbtcPrimitivesVaultId, ReplaceRequestExt } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import { H256 } from '@polkadot/types/interfaces';

export interface VaultState {
  requests: Map<H256, ReplaceRequestExt>;
  collateralization: string | undefined;
  collateral: MonetaryAmount<CollateralCurrencyExt>;
  lockedBTC: BitcoinAmount;
  apy: string;
}

export type VaultApiType = [InterbtcPrimitivesVaultId, BitcoinAmount];
