import { CollateralUnit } from '@interlay/interbtc-api';
import { BitcoinAmount, Currency, MonetaryAmount } from '@interlay/monetary-js';

import { GovernanceTokenMonetaryAmount } from '@/config/relay-chains';

import {
  CHANGE_ADDRESS,
  ChangeAddress,
  INIT_GENERAL_DATA_ACTION,
  InitGeneralDataAction,
  IS_BRIDGE_LOADED,
  IS_FAUCET_LOADED,
  IS_VAULT_CLIENT_LOADED,
  IsBridgeLoaded,
  IsFaucetLoaded,
  IsVaultClientLoaded,
  SET_INSTALLED_EXTENSION,
  SetInstalledExtension,
  SHOW_ACCOUNT_MODAL,
  ShowAccountModal,
  UPDATE_BALANCE_POLKA_BTC,
  UPDATE_COLLATERAL_TOKEN_BALANCE,
  UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE,
  UPDATE_HEIGHTS,
  UPDATE_TOTALS,
  UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE,
  UpdateBalancePolkaBTC,
  UpdateCollateralTokenBalance,
  UpdateCollateralTokenTransferableBalance,
  UpdateHeights,
  UpdateTotals,
  UpdateWrappedTokenTransferableBalance
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

export const changeAddressAction = (address: string): ChangeAddress => ({
  type: CHANGE_ADDRESS,
  address
});

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

export const updateCollateralTokenBalanceAction = (
  collateralTokenBalance: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>
): UpdateCollateralTokenBalance => ({
  type: UPDATE_COLLATERAL_TOKEN_BALANCE,
  collateralTokenBalance
});

export const updateCollateralTokenTransferableBalanceAction = (
  collateralTokenTransferableBalance: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>
): UpdateCollateralTokenTransferableBalance => ({
  type: UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE,
  collateralTokenTransferableBalance
});

export const initGeneralDataAction = (
  totalWrappedTokenAmount: BitcoinAmount,
  totalLockedCollateralTokenAmount: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>,
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

export const setInstalledExtensionAction = (extensions: string[]): SetInstalledExtension => ({
  type: SET_INSTALLED_EXTENSION,
  extensions
});

export const updateHeightsAction = (btcRelayHeight: number, bitcoinHeight: number): UpdateHeights => ({
  type: UPDATE_HEIGHTS,
  btcRelayHeight,
  bitcoinHeight
});

export const updateTotalsAction = (
  totalLockedCollateralTokenAmount: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>,
  totalWrappedTokenAmount: BitcoinAmount
): UpdateTotals => ({
  type: UPDATE_TOTALS,
  totalLockedCollateralTokenAmount,
  totalWrappedTokenAmount
});
