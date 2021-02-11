import { stripHexPrefix } from "@interlay/polkabtc";
import { Dispatch } from "redux";
import { updateIssueRequestAction, updateAllIssueRequestsAction } from "../actions/issue.actions";
import { updateBalances, parachainToUIIssueRequest, requestsInStore } from "../utils/utils";
import { StoreState } from "../types/util.types";
import { IssueRequest } from "../types/issue.types";

export default async function fetchIssueTransactions(dispatch: Dispatch, store: StoreState): Promise<void> {
    try {
        const { address, balanceDOT, balancePolkaBTC, polkaBtcLoaded } = store.getState().general;
        if (!address || !polkaBtcLoaded) return;

        const storeRequests = store.getState().issue.issueRequests.get(address) || [];

        const accountId = window.polkaBTC.api.createType("AccountId", address);
        const issueRequestMap = await window.polkaBTC.issue.mapForUser(accountId);
        const parachainRequests: IssueRequest[] = [];

        for (const [key, value] of issueRequestMap) {
            parachainRequests.push(parachainToUIIssueRequest(key, value));
        }

        if (!parachainRequests.length) return;

        if (!requestsInStore(storeRequests, parachainRequests)) {
            updateAllRequests(parachainRequests, dispatch);
            return;
        }

        storeRequests.forEach(async (storeRequest) => {
            try {
                let shouldRequestBeUpdate = false;
                const parachainRequest = parachainRequests.filter((request) => request.id === storeRequest.id)[0];

                if (parachainRequest.amountBTC !== storeRequest.amountBTC) {
                    storeRequest.amountBTC = parachainRequest.amountBTC;
                    storeRequest.fee = parachainRequest.fee;
                    const amount = new Big(parachainRequest.amountBTC).add(new Big(parachainRequest.fee));
                    storeRequest.totalAmount = amount.toString();
                    shouldRequestBeUpdate = true;
                }

                if (!storeRequest.completed && !storeRequest.cancelled) {
                    if (!storeRequest.btcTxId) {
                        const btcTxId = await window.polkaBTC.btcCore.getTxIdByRecipientAddress(
                            storeRequest.vaultBTCAddress,
                            storeRequest.amountBTC
                        );
                        storeRequest.btcTxId = btcTxId;
                        shouldRequestBeUpdate = true;
                    }

                    if (parachainRequest.completed || parachainRequest.cancelled) {
                        storeRequest = {
                            ...storeRequest,
                            completed: parachainRequest.completed,
                            cancelled: parachainRequest.cancelled,
                        };
                        updateBalances(dispatch, address, balanceDOT, balancePolkaBTC);
                        shouldRequestBeUpdate = true;
                    }
                }
                if (storeRequest.btcTxId) {
                    const txStatus = await window.polkaBTC.btcCore.getTransactionStatus(
                        stripHexPrefix(storeRequest.btcTxId)
                    );
                    if (storeRequest.confirmations !== txStatus.confirmations) {
                        storeRequest.confirmations = txStatus.confirmations;
                        shouldRequestBeUpdate = true;
                    }
                    if (shouldRequestBeUpdate) {
                        dispatch(updateIssueRequestAction(storeRequest));
                    }
                }
            } catch (error) {
                console.log(error.toString());
            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function updateAllRequests(newRequests: IssueRequest[], dispatch: Dispatch) {
    await Promise.all(
        newRequests.map(async (request) => {
            try {
                request.btcTxId = await window.polkaBTC.btcCore.getTxIdByRecipientAddress(
                    request.vaultBTCAddress,
                    request.amountBTC
                );
            } catch (err) {
                console.log("Issue Id: " + request.id + " " + err);
            }
        })
    );
    await Promise.all(
        newRequests.map(async (request) => {
            try {
                if (request.btcTxId) {
                    request.confirmations = (
                        await window.polkaBTC.btcCore.getTransactionStatus(request.btcTxId)
                    ).confirmations;
                }
            } catch (err) {
                console.log(err);
            }
        })
    );

    dispatch(updateAllIssueRequestsAction(newRequests));
}
