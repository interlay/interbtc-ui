import {
  BitcoinAmount,
  PolkadotAmount
} from '@interlay/monetary-js';

import {
  AddReplaceRequests,
  UpdateCollateralization,
  UpdateCollateral,
  UpdateLockedBTC,
  UpdateAPY,
  ADD_REPLACE_REQUESTS,
  UPDATE_COLLATERALIZATION,
  UPDATE_COLLATERAL,
  UPDATE_LOCKED_BTC,
  UPDATE_APY
} from '../types/actions.types';
import { ReplaceRequestExt } from '@interlay/interbtc-api';
import { H256 } from '@polkadot/types/interfaces';

export const addReplaceRequestsAction = (requests: Map<H256, ReplaceRequestExt>): AddReplaceRequests => ({
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

export const updateLockedBTCAction = (lockedBTC: BitcoinAmount): UpdateLockedBTC => ({
  type: UPDATE_LOCKED_BTC,
  lockedBTC
});

export const updateAPYAction = (apy: string): UpdateAPY => ({
  type: UPDATE_APY,
  apy
});
