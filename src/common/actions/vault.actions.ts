import {
  BTCAmount,
  PolkadotAmount
} from '@interlay/monetary-js';

import {
  AddReplaceRequests,
  UpdateCollateralization,
  UpdateCollateral,
  UpdateLockedBTC,
  // ray test touch <<
  // UpdateSLA,
  // ray test touch >>
  UpdateAPY,
  ADD_REPLACE_REQUESTS,
  UPDATE_COLLATERALIZATION,
  UPDATE_COLLATERAL,
  UPDATE_LOCKED_BTC,
  // ray test touch <<
  // UPDATE_SLA,
  // ray test touch >>
  UPDATE_APY
} from '../types/actions.types';
// ray test touch <<
import { ReplaceRequestExt } from '@interlay/interbtc-api';
// ray test touch >>
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

export const updateLockedBTCAction = (lockedBTC: BTCAmount): UpdateLockedBTC => ({
  type: UPDATE_LOCKED_BTC,
  lockedBTC
});

// ray test touch <<
// export const updateSLAAction = (sla: string): UpdateSLA => ({
//   type: UPDATE_SLA,
//   sla
// });
// ray test touch >>

export const updateAPYAction = (apy: string): UpdateAPY => ({
  type: UPDATE_APY,
  apy
});
