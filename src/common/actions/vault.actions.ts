import { CollateralUnit } from '@interlay/interbtc-api';
import { BitcoinAmount, Currency,MonetaryAmount } from '@interlay/monetary-js';

import {
  UPDATE_APY,
  UPDATE_COLLATERAL,
  UPDATE_COLLATERALIZATION,
  UPDATE_LOCKED_BTC,
  UpdateAPY,
  UpdateCollateral,
  UpdateCollateralization,
  UpdateLockedBTC} from '../types/actions.types';

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
