import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';

import {
  UPDATE_APY,
  UPDATE_COLLATERAL,
  UPDATE_COLLATERALIZATION,
  UPDATE_LOCKED_BTC,
  UpdateAPY,
  UpdateCollateral,
  UpdateCollateralization,
  UpdateLockedBTC
} from '../types/actions.types';

export const updateCollateralizationAction = (collateralization: string | undefined): UpdateCollateralization => ({
  type: UPDATE_COLLATERALIZATION,
  collateralization
});

export const updateCollateralAction = (collateral: MonetaryAmount<CollateralCurrencyExt>): UpdateCollateral => ({
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
