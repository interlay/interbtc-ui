import {
  IS_POLKA_BTC_LOADED,
  CHANGE_ADDRESS,
  INIT_STATE,
  INIT_GENERAL_DATA_ACTION,
  IS_VAULT_CLIENT_LOADED,
  UPDATE_BALANCE_POLKA_BTC,
  UPDATE_BALANCE_DOT,
  SET_INSTALLED_EXTENSION,
  SHOW_ACCOUNT_MODAL,
  UPDATE_OF_PRICES,
  IS_FAUCET_LOADED,
  UPDATE_HEIGHTS,
  UPDATE_TOTALS,
  IsPolkaBtcLoaded,
  ChangeAddress,
  InitState,
  InitGeneralDataAction,
  IsVaultClientLoaded,
  UpdateBalancePolkaBTC,
  UpdateBalanceDOT,
  SetInstalledExtension,
  ShowAccountModal,
  IsFaucetLoaded,
  UpdateOfPrices,
  UpdateHeights,
  UpdateTotals
} from '../types/actions.types';
import { StoreType, ParachainStatus, Prices } from '../types/util.types';

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

export const initializeState = (state: StoreType): InitState => ({
  type: INIT_STATE,
  state
});

export const updateBalancePolkaBTCAction = (balancePolkaBTC: string): UpdateBalancePolkaBTC => ({
  type: UPDATE_BALANCE_POLKA_BTC,
  balancePolkaBTC
});

export const updateBalanceDOTAction = (balanceDOT: string): UpdateBalanceDOT => ({
  type: UPDATE_BALANCE_DOT,
  balanceDOT
});

export const updateOfPricesAction = (prices: Prices): UpdateOfPrices => ({
  type: UPDATE_OF_PRICES,
  prices
});

export const initGeneralDataAction = (
  totalPolkaBTC: string,
  totalLockedDOT: string,
  btcRelayHeight: number,
  bitcoinHeight: number,
  parachainStatus: ParachainStatus
): InitGeneralDataAction => ({
  type: INIT_GENERAL_DATA_ACTION,
  btcRelayHeight,
  bitcoinHeight,
  totalPolkaBTC,
  totalLockedDOT,
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

export const updateTotalsAction = (totalLockedDOT: string, totalPolkaBTC: string): UpdateTotals => ({
  type: UPDATE_TOTALS,
  totalLockedDOT,
  totalPolkaBTC
});
