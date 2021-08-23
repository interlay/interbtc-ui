import {
  BTCAmount,
  PolkadotAmount
} from '@interlay/monetary-js';
// ray test touch <<
import { ReplaceRequestExt } from '@interlay/interbtc-api';
// ray test touch >>
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
  collateral: PolkadotAmount;
  lockedBTC: BTCAmount;
  sla: string;
  apy: string;
}
