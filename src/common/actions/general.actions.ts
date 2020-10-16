import {
    IS_POLKA_BTC_LOADED,
    IS_STAKED_RELAYER_LOADED,
    CHANGE_ADDRESS,
    INIT_STATE,
    IsPolkaBtcLoaded,
    IsStakedRelayerLoaded,
    ChangeAddress,
    InitState,

} from "../types/actions.types";
import { StoreType } from "../types/util.types";

export const isPolkaBtcLoaded = (isLoaded: boolean = false): IsPolkaBtcLoaded => ({
    type: IS_POLKA_BTC_LOADED,
    isLoaded,
});

export const isStakedRelayerLoaded = (isLoaded: boolean = false): IsStakedRelayerLoaded => ({
    type: IS_STAKED_RELAYER_LOADED,
    isLoaded,
});

export const changeAddressAction = (address: string): ChangeAddress => ({
    type: CHANGE_ADDRESS,
    address,
});

export const initializeState = (state: StoreType): InitState => ({
    type: INIT_STATE,
    state
});
