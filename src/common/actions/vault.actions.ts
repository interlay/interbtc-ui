import { VaultReplaceRequest } from '../types/vault.types';

import {
  AddReplaceRequests,
  UpdateCollateralization,
  UpdateCollateral,
  UpdateLockedBTC,
  UpdateSLA,
  UpdateAPY,
  ADD_REPLACE_REQUESTS,
  UPDATE_COLLATERALIZATION,
  UPDATE_COLLATERAL,
  UPDATE_LOCKED_BTC,
  UPDATE_SLA,
  UPDATE_APY
} from '../types/actions.types';
import { BTCAmount, PolkadotAmount } from '@interlay/monetary-js';

export const addReplaceRequestsAction = (requests: VaultReplaceRequest[]): AddReplaceRequests => ({
  type: ADD_REPLACE_REQUESTS,
  requests
});

export const updateCollateralizationAction = (collateralization: string | undefined): UpdateCollateralization => ({
  type: UPDATE_COLLATERALIZATION,
  collateralization
});

export const updateCollateralAction = (collateral: PolkadotAmount): UpdateCollateral => ({
  type: UPDATE_COLLATERAL,
  collateral
});

export const updateLockedBTCAction = (lockedBTC: BTCAmount): UpdateLockedBTC => ({
  type: UPDATE_LOCKED_BTC,
  lockedBTC
});

export const updateSLAAction = (sla: string): UpdateSLA => ({
  type: UPDATE_SLA,
  sla
});

export const updateAPYAction = (apy: string): UpdateAPY => ({
  type: UPDATE_APY,
  apy
});
