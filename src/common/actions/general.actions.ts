import {
    IS_POLKA_BTC_LOADED,
    IS_STAKED_RELAYER_LOADED,
    CHANGE_ADDRESS,
    INIT_STATE,
    SET_TOTAL_ISSUED_AND_TOTAL_LOCKED,
    UPDATE_BTC_ADDRESS,
    UPDATE_COLLATERAL,
    IsPolkaBtcLoaded,
    IsStakedRelayerLoaded,
    ChangeAddress,
    InitState,
    SetTotalIssuedAndTotalLocked,
    UpdateBTCAddress,
    UpdateCollateral
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

export const changeAddressAction = (address: string): ChangeAddress => ({
    type: CHANGE_ADDRESS,
    address,
});

export const initializeState = (state: StoreType): InitState => ({
    type: INIT_STATE,
    state,
});

export const updateBTCAddressAction = (btcAddress: string): UpdateBTCAddress => ({
    type: UPDATE_BTC_ADDRESS,
    btcAddress,
});

export const updateCollateralAction = (collateral: number): UpdateCollateral => ({
    type: UPDATE_COLLATERAL,
    collateral,
});

export const setTotalIssuedAndTotalLockedAction = (
    totalPolkaBTC: string,
    totalLockedDOT: string
): SetTotalIssuedAndTotalLocked => ({
    type: SET_TOTAL_ISSUED_AND_TOTAL_LOCKED,
    totalPolkaBTC,
    totalLockedDOT,
});
