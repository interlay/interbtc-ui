import { ReplaceRequest } from "../types/replace.types";
import { AddReplaceRequests, ADD_REPLACE_REQUESTS } from "../types/actions.types";

export const addReplaceRequestsAction = (requests: ReplaceRequest[]): AddReplaceRequests => ({
    type: ADD_REPLACE_REQUESTS,
    requests,
});
