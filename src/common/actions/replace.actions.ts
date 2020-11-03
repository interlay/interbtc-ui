import { VaultReplaceRequest } from "../types/replace.types";
import {
    AddReplaceRequests,
    AddReplaceRequest,
    RequestReplacmentPending,
    ADD_REPLACE_REQUESTS,
    ADD_REPLACE_REQUEST,
    REQUEST_REPLACMENT_PENDING,
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
