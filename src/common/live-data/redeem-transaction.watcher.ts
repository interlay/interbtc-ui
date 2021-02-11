import { stripHexPrefix } from "@interlay/polkabtc";
import { Dispatch } from "redux";
import { RedeemRequest } from "../types/redeem.types";
import { StoreState } from "../types/util.types";
import { updateRedeemRequestAction, updateAllRedeemRequestsAction } from "../actions/redeem.actions";
import { updateBalances, parachainToUIRedeemRequest, requestsInStore } from "../utils/utils";

export default async function fetchRedeemTransactions(dispatch: Dispatch, store: StoreState): Promise<void> {
    try {
        const { address, balanceDOT, balancePolkaBTC, polkaBtcLoaded } = store.getState().general;
        if (!address || !polkaBtcLoaded) return;

        const storeRequests = store.getState().redeem.redeemRequests.get(address) || [];

        const accountId = window.polkaBTC.api.createType("AccountId", address);
        const redeemRequestMap = await window.polkaBTC.redeem.mapForUser(accountId);
        const parachainRequests: RedeemRequest[] = [];

        for (const [key, value] of redeemRequestMap) {
            parachainRequests.push(parachainToUIRedeemRequest(key, value));
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

                if (!storeRequest.completed && !storeRequest.cancelled) {
                    if (storeRequest.creation === "0") {
                        storeRequest.creation = parachainRequest.creation;
                        shouldRequestBeUpdate = true;
                    }
                    if (!storeRequest.btcTxId) {
                        const btcTxId = await window.polkaBTC.btcCore.getTxIdByOpReturn(
                            storeRequest.id,
                            storeRequest.btcAddress,
                            storeRequest.amountPolkaBTC
                        );
                        storeRequest.btcTxId = btcTxId;
                        shouldRequestBeUpdate = true;
                    }
                    if (parachainRequest.reimbursed !== storeRequest.reimbursed) {
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
                        dispatch(updateRedeemRequestAction(storeRequest));
                    }
                }
            } catch (error) {
                console.log(error.toString());
            }
        });
    } catch (error) {
        console.log(error.toString());
    }
}

async function updateAllRequests(newRequests: RedeemRequest[], dispatch: Dispatch) {
    await Promise.all(
        newRequests.map(async (request) => {
            try {
                request.btcTxId = await window.polkaBTC.btcCore.getTxIdByOpReturn(
                    request.id,
                    request.btcAddress,
                    request.amountPolkaBTC
                );
            } catch (err) {
                console.log("Redeem Id: " + request.id + " " + err);
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

    dispatch(updateAllRedeemRequestsAction(newRequests));
}
