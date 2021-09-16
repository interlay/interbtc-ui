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

export type Vault = {
  vaultId: string;
  btcAddress: string;
  lockedDOT: string;
  lockedBTC: string;
  pendingBTC: string;
  status: string;
  unsettledCollateralization: string | undefined;
  settledCollateralization: string | undefined;
};

export interface VaultState {
  requests: Map<H256, ReplaceRequestExt>;
  collateralization: string | undefined;
  collateral: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  lockedBTC: BitcoinAmount;
  apy: string;
}
