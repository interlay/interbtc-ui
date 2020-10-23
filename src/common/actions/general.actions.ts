import {
    IS_POLKA_BTC_LOADED,
    IS_STAKED_RELAYER_LOADED,
    CHANGE_ADDRESS,
    INIT_STATE,
    SET_TOTAL_ISSUED_AND_TOTAL_LOCKED,
    IsPolkaBtcLoaded,
    IsStakedRelayerLoaded,
    ChangeAddress,
    InitState,
    SetTotalIssuedAndTotalLocked,
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

export const setTotalIssuedAndTotalLockedAction = (
    totalPolkaBTC: string,
    totalLockedDOT: string
): SetTotalIssuedAndTotalLocked => ({
    type: SET_TOTAL_ISSUED_AND_TOTAL_LOCKED,
    totalPolkaBTC,
    totalLockedDOT,
});
