import { ReplaceRequest } from "../types/replace.types";
import {
    AddReplaceRequests,
    AddReplaceRequest,
    ADD_REPLACE_REQUESTS,
    ADD_REPLACE_REQUEST,
} from "../types/actions.types";

export const addReplaceRequestsAction = (requests: ReplaceRequest[]): AddReplaceRequests => ({
    type: ADD_REPLACE_REQUESTS,
    requests,
});

export const addReplaceRequestAction = (request: ReplaceRequest): AddReplaceRequest => ({
    type: ADD_REPLACE_REQUEST,
    request,
});
