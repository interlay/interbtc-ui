import {
  BitcoinAmount,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

import {
  UpdateCollateralization,
  UpdateCollateral,
  UpdateLockedBTC,
  UpdateAPY,
  UPDATE_COLLATERALIZATION,
  UPDATE_COLLATERAL,
  UPDATE_LOCKED_BTC,
  UPDATE_APY
} from '../types/actions.types';

export const updateCollateralizationAction = (collateralization: string | undefined): UpdateCollateralization => ({
  type: UPDATE_COLLATERALIZATION,
  collateralization
});

export const updateCollateralAction = (
  collateral: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>
): UpdateCollateral => ({
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
