import {
    IS_POLKA_BTC_LOADED,
    IS_STAKED_RELAYER_LOADED,
    CHANGE_ADDRESS,
    INIT_STATE,
    SET_TOTAL_ISSUED_AND_TOTAL_LOCKED,
    IS_VAULT_CLIENT_LOADED,
    UPDATE_BALANCE_POLKA_BTC,
    UPDATE_BALANCE_DOT,
    IsPolkaBtcLoaded,
    IsStakedRelayerLoaded,
    ChangeAddress,
    InitState,
    SetTotalIssuedAndTotalLocked,
    IsVaultClientLoaded,
    UpdateBalancePolkaBTC,
    UpdateBalanceDOT,
    HasFeedbackModalBeenDisplayed,
    HAS_FEEDBACK_BEEN_DISPLAYED,
} from "../types/actions.types";
import { StoreType } from "../types/util.types";

export const isPolkaBtcLoaded = (isLoaded = false): IsPolkaBtcLoaded => ({
    type: IS_POLKA_BTC_LOADED,
    isLoaded,
});

export const isStakedRelayerLoaded = (isLoaded = false): IsStakedRelayerLoaded => ({
    type: IS_STAKED_RELAYER_LOADED,
    isLoaded,
});

export const isVaultClientLoaded = (isLoaded = false): IsVaultClientLoaded => ({
    type: IS_VAULT_CLIENT_LOADED,
    isLoaded,
});

export const hasFeedbackModalBeenDisplayedAction = (hasBeenDisplayed = false): HasFeedbackModalBeenDisplayed => ({
    type: HAS_FEEDBACK_BEEN_DISPLAYED,
    hasBeenDisplayed,
});

export const changeAddressAction = (address: string): ChangeAddress => ({
    type: CHANGE_ADDRESS,
    address,
});

export const initializeState = (state: StoreType): InitState => ({
    type: INIT_STATE,
    state,
});

export const updateBalancePolkaBTCAction = (balancePolkaBTC: string): UpdateBalancePolkaBTC => ({
    type: UPDATE_BALANCE_POLKA_BTC,
    balancePolkaBTC,
});

export const updateBalanceDOTAction = (balanceDOT: string): UpdateBalanceDOT => ({
    type: UPDATE_BALANCE_DOT,
    balanceDOT,
});

export const setTotalIssuedAndTotalLockedAction = (
    totalPolkaBTC: string,
    totalLockedDOT: string
): SetTotalIssuedAndTotalLocked => ({
    type: SET_TOTAL_ISSUED_AND_TOTAL_LOCKED,
    totalPolkaBTC,
    totalLockedDOT,
});
