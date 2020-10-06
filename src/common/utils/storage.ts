import { Dispatch } from "redux";
import { setIssueRequestsAction } from "../actions/issue.actions";
import { setRedeemRequestsAction } from "../actions/redeem.actions";
import { changeStorageAddress } from "../actions/storage.actions";
import Storage from "../controllers/storage";
import { IssueActions, RedeemActions, StorageActions } from "../types/actions.types";

export function setUser(
    address: string,
    storage: Storage,
    dispatch: Dispatch<IssueActions | RedeemActions | StorageActions>
): void {
    dispatch(changeStorageAddress(address));
    const [issues, redeems] = storage.loadRequests();
    dispatch(setIssueRequestsAction(issues));
    dispatch(setRedeemRequestsAction(redeems));
}
