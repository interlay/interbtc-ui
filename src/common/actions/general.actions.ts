import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';

import { GovernanceTokenMonetaryAmount } from '@/config/relay-chains';

import {
  INIT_GENERAL_DATA_ACTION,
  InitGeneralDataAction,
  IS_BRIDGE_LOADED,
  IS_FAUCET_LOADED,
  IS_VAULT_CLIENT_LOADED,
  IsBridgeLoaded,
  IsFaucetLoaded,
  IsVaultClientLoaded,
  SHOW_ACCOUNT_MODAL,
  SHOW_BUY_MODAL,
  ShowAccountModal,
  ShowBuyModal,
  UPDATE_HEIGHTS,
  UPDATE_TOTALS,
  UpdateHeights,
  UpdateTotals
} from '../types/actions.types';
import { ParachainStatus } from '../types/util.types';

export const isBridgeLoaded = (isLoaded = false): IsBridgeLoaded => ({
  type: IS_BRIDGE_LOADED,
  isLoaded
});

export const isFaucetLoaded = (isLoaded = false): IsFaucetLoaded => ({
  type: IS_FAUCET_LOADED,
  isLoaded
});

export const isVaultClientLoaded = (isLoaded = false): IsVaultClientLoaded => ({
  type: IS_VAULT_CLIENT_LOADED,
  isLoaded
});

export const initGeneralDataAction = (
  totalWrappedTokenAmount: BitcoinAmount,
  totalLockedCollateralTokenAmount: MonetaryAmount<CollateralCurrencyExt>,
  totalGovernanceTokenAmount: GovernanceTokenMonetaryAmount,
  btcRelayHeight: number,
  bitcoinHeight: number,
  parachainStatus: ParachainStatus
): InitGeneralDataAction => ({
  type: INIT_GENERAL_DATA_ACTION,
  btcRelayHeight,
  bitcoinHeight,
  totalWrappedTokenAmount,
  totalLockedCollateralTokenAmount,
  totalGovernanceTokenAmount,
  parachainStatus
});

export const showAccountModalAction = (showAccountModal: boolean): ShowAccountModal => ({
  type: SHOW_ACCOUNT_MODAL,
  showAccountModal
});

export const showBuyModal = (isBuyModalOpen: boolean): ShowBuyModal => ({
  type: SHOW_BUY_MODAL,
  isBuyModalOpen
});

export const updateHeightsAction = (btcRelayHeight: number, bitcoinHeight: number): UpdateHeights => ({
  type: UPDATE_HEIGHTS,
  btcRelayHeight,
  bitcoinHeight
});

export const updateTotalsAction = (
  totalLockedCollateralTokenAmount: MonetaryAmount<CollateralCurrencyExt>,
  totalWrappedTokenAmount: BitcoinAmount
): UpdateTotals => ({
  type: UPDATE_TOTALS,
  totalLockedCollateralTokenAmount,
  totalWrappedTokenAmount
});
