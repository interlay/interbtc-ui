import { VaultReplaceRequest } from "../types/replace.types";
import {
    AddReplaceRequests,
    AddReplaceRequest,
    ADD_REPLACE_REQUESTS,
    ADD_REPLACE_REQUEST,
} from "../types/actions.types";

export const addReplaceRequestsAction = (requests: VaultReplaceRequest[]): AddReplaceRequests => ({
    type: ADD_REPLACE_REQUESTS,
    requests,
});

export const addReplaceRequestAction = (request: VaultReplaceRequest): AddReplaceRequest => ({
    type: ADD_REPLACE_REQUEST,
    request,
});
