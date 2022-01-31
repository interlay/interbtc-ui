import {
  BitcoinAmount,
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import {
  CollateralUnit,
  GovernanceUnit
} from '@interlay/interbtc-api';

import {
  IS_POLKA_BTC_LOADED,
  CHANGE_ADDRESS,
  INIT_GENERAL_DATA_ACTION,
  IS_VAULT_CLIENT_LOADED,
  UPDATE_BALANCE_POLKA_BTC,
  UPDATE_WRAPPED_TOKEN_TRANSFERABLE_BALANCE,
  UPDATE_COLLATERAL_TOKEN_BALANCE,
  UPDATE_COLLATERAL_TOKEN_TRANSFERABLE_BALANCE,
  UPDATE_GOVERNANCE_TOKEN_BALANCE,
  UPDATE_GOVERNANCE_TOKEN_TRANSFERABLE_BALANCE,
  SET_INSTALLED_EXTENSION,
  SHOW_ACCOUNT_MODAL,
  UPDATE_OF_PRICES,
  IS_FAUCET_LOADED,
  UPDATE_HEIGHTS,
  UPDATE_TOTALS,
  IsPolkaBtcLoaded,
  ChangeAddress,
  InitGeneralDataAction,
  IsVaultClientLoaded,
  UpdateBalancePolkaBTC,
  UpdateWrappedTokenTransferableBalance,
  UpdateCollateralTokenBalance,
  UpdateCollateralTokenTransferableBalance,
  UpdateGovernanceTokenBalance,
  UpdateGovernanceTokenTransferableBalance,
  SetInstalledExtension,
  ShowAccountModal,
  IsFaucetLoaded,
  UpdateOfPrices,
  UpdateHeights,
  UpdateTotals
} from '../types/actions.types';
import { ParachainStatus, Prices } from '../types/util.types';

export const isPolkaBtcLoaded = (isLoaded = false): IsPolkaBtcLoaded => ({
  type: IS_POLKA_BTC_LOADED,
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

export const updateWrappedTokenTransferableBalanceAction =
  (wrappedTokenTransferableBalance: BitcoinAmount): UpdateWrappedTokenTransferableBalance => ({
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

export const updateGovernanceTokenBalanceAction = (
  governanceTokenBalance: MonetaryAmount<Currency<GovernanceUnit>, GovernanceUnit>
): UpdateGovernanceTokenBalance => ({
  type: UPDATE_GOVERNANCE_TOKEN_BALANCE,
  governanceTokenBalance
});

export const updateGovernanceTokenTransferableBalanceAction = (
  governanceTokenTransferableBalance: MonetaryAmount<Currency<GovernanceUnit>, GovernanceUnit>
): UpdateGovernanceTokenTransferableBalance => ({
  type: UPDATE_GOVERNANCE_TOKEN_TRANSFERABLE_BALANCE,
  governanceTokenTransferableBalance
});

export const updateOfPricesAction = (prices: Prices): UpdateOfPrices => ({
  type: UPDATE_OF_PRICES,
  prices
});

export const initGeneralDataAction = (
  totalWrappedTokenAmount: BitcoinAmount,
  totalLockedCollateralTokenAmount: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>,
  totalGovernanceTokenAmount: MonetaryAmount<Currency<GovernanceUnit>, GovernanceUnit>,
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
