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
  ShowAccountModal,
  // ray test touch <
  UPDATE_BALANCE_POLKA_BTC,
  // ray test touch >
  UPDATE_COLLATERAL_TOKEN_BALANCE,
  UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE,
  UPDATE_HEIGHTS,
  UPDATE_TOTALS,
  // ray test touch <
  UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE,
  UpdateBalancePolkaBTC,
  // ray test touch >
  UpdateCollateralTokenBalance,
  UpdateCollateralTokenTransferableBalance,
  UpdateHeights,
  UpdateTotals,
  // ray test touch <
  UpdateWrappedTokenTransferableBalance
  // ray test touch >
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

// ray test touch <
export const updateWrappedTokenBalanceAction = (wrappedTokenBalance: BitcoinAmount): UpdateBalancePolkaBTC => ({
  type: UPDATE_BALANCE_POLKA_BTC,
  wrappedTokenBalance
});

export const updateWrappedTokenTransferableBalanceAction = (
  wrappedTokenTransferableBalance: BitcoinAmount
): UpdateWrappedTokenTransferableBalance => ({
  type: UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE,
  wrappedTokenTransferableBalance
});
// ray test touch >

export const updateCollateralTokenBalanceAction = (
  collateralTokenBalance: MonetaryAmount<CollateralCurrencyExt>
): UpdateCollateralTokenBalance => ({
  type: UPDATE_COLLATERAL_TOKEN_BALANCE,
  collateralTokenBalance
});

export const updateCollateralTokenTransferableBalanceAction = (
  collateralTokenTransferableBalance: MonetaryAmount<CollateralCurrencyExt>
): UpdateCollateralTokenTransferableBalance => ({
  type: UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE,
  collateralTokenTransferableBalance
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
