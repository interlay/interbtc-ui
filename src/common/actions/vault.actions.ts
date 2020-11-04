import { VaultReplaceRequest } from "../types/vault.types";
import {
    AddReplaceRequests,
    AddReplaceRequest,
    RequestReplacmentPending,
    UpdateBTCAddress,
    UpdateCollateralization,
    UpdateCollateral,
    UpdateLockedBTC,
    ADD_REPLACE_REQUESTS,
    ADD_REPLACE_REQUEST,
    UPDATE_BTC_ADDRESS,
    UPDATE_COLLATERALIZATION,
    REQUEST_REPLACMENT_PENDING,
    UPDATE_COLLATERAL,
    UPDATE_LOCKED_BTC,
} from "../types/actions.types";

export const addReplaceRequestsAction = (requests: VaultReplaceRequest[]): AddReplaceRequests => ({
    type: ADD_REPLACE_REQUESTS,
    requests,
});

export const addReplaceRequestAction = (request: VaultReplaceRequest): AddReplaceRequest => ({
    type: ADD_REPLACE_REQUEST,
    request,
});

export const requestReplacmentPendingAction = (isReplacmentPending: boolean): RequestReplacmentPending => ({
    type: REQUEST_REPLACMENT_PENDING,
    isReplacmentPending,
});

export const updateBTCAddressAction = (btcAddress: string): UpdateBTCAddress => ({
    type: UPDATE_BTC_ADDRESS,
    btcAddress,
});

export const updateCollateralizationAction = (collateralization: number): UpdateCollateralization => ({
    type: UPDATE_COLLATERALIZATION,
    collateralization,
});

export const updateCollateralAction = (collateral: string): UpdateCollateral => ({
    type: UPDATE_COLLATERAL,
    collateral,
});

export const updateLockedBTCAction = (lockedBTC: string): UpdateLockedBTC => ({
    type: UPDATE_LOCKED_BTC,
    lockedBTC,
});
