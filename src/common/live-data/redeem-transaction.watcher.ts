import { stripHexPrefix } from "@interlay/polkabtc";
import { Dispatch } from "redux";
import { RedeemRequest, RedeemRequestStatus } from "../types/redeem.types";
import { StoreState } from "../types/util.types";
import { updateRedeemRequestAction, updateAllRedeemRequestsAction } from "../actions/redeem.actions";
import {
    updateBalances,
    parachainToUIRedeemRequest,
    requestsInStore,
    computeRedeemRequestStatus,
} from "../utils/utils";
import { BlockNumber } from "@polkadot/types/interfaces";

export default async function fetchRedeemTransactions(dispatch: Dispatch, store: StoreState): Promise<void> {
    try {
        const { address, balanceDOT, balancePolkaBTC, polkaBtcLoaded } = store.getState().general;
        if (!address || !polkaBtcLoaded) return;

        const storeRequests = store.getState().redeem.redeemRequests.get(address) || [];

        const accountId = window.polkaBTC.api.createType("AccountId", address);
        const redeemRequestMap = await window.polkaBTC.redeem.mapForUser(accountId);
        const parachainRequests: RedeemRequest[] = [];

        const parachainHeight = await window.polkaBTC.system.getCurrentBlockNumber();
        const redeemPeriod = await window.polkaBTC.redeem.getRedeemPeriod();
        const requiredBtcConfirmations = await window.polkaBTC.btcRelay.getStableBitcoinConfirmations();

        for (const [key, value] of redeemRequestMap) {
            parachainRequests.push(
                await parachainToUIRedeemRequest(key, value, parachainHeight, redeemPeriod, requiredBtcConfirmations)
            );
        }

        if (!parachainRequests.length) return;

        if (!requestsInStore(storeRequests, parachainRequests)) {
            updateAllRequests(parachainRequests, dispatch);
            return;
        }

        storeRequests.forEach(async (storeRequest) => {
            try {
                let shouldRequestBeUpdated = false;
                const parachainRequest = parachainRequests.filter((request) => request.id === storeRequest.id)[0];

                if (
                    storeRequest.status !== RedeemRequestStatus.Completed &&
                    storeRequest.status !== RedeemRequestStatus.Cancelled
                ) {
                    if (storeRequest.creation === "0") {
                        storeRequest.creation = parachainRequest.creation;
                        shouldRequestBeUpdated = true;
                    }
                    if (!storeRequest.btcTxId) {
                        const btcTxId = await window.polkaBTC.btcCore.getTxIdByOpReturn(
                            storeRequest.id,
                            storeRequest.btcAddress,
                            storeRequest.amountPolkaBTC
                        );
                        storeRequest.btcTxId = btcTxId;
                        shouldRequestBeUpdated = true;
                    }
                    if (
                        parachainRequest.status !== RedeemRequestStatus.Reimbursed &&
                        storeRequest.status === RedeemRequestStatus.Reimbursed
                    ) {
                        shouldRequestBeUpdated = true;
                    }
                    if (
                        parachainRequest.status === RedeemRequestStatus.Completed ||
                        parachainRequest.status === RedeemRequestStatus.Cancelled
                    ) {
                        updateBalances(dispatch, address, balanceDOT, balancePolkaBTC);
                        shouldRequestBeUpdated = true;
                    }
                }
                if (storeRequest.btcTxId) {
                    const txStatus = await window.polkaBTC.btcCore.getTransactionStatus(
                        stripHexPrefix(storeRequest.btcTxId)
                    );
                    if (storeRequest.confirmations !== txStatus.confirmations) {
                        storeRequest.confirmations = txStatus.confirmations;
                        shouldRequestBeUpdated = true;
                    }
                }
                if (shouldRequestBeUpdated) {
                    storeRequest = {
                        ...storeRequest,
                        status: await getRedeemRequestStatus(
                            parachainRequest,
                            parachainHeight,
                            redeemPeriod,
                            requiredBtcConfirmations
                        ),
                    };
                    dispatch(updateRedeemRequestAction(storeRequest));
                }
            } catch (error) {
                console.log(error.toString());
            }
        });
    } catch (error) {
        console.log(error.toString());
    }
}

async function getRedeemRequestStatus(
    redeemRequest: RedeemRequest,
    parachainHeight: BlockNumber,
    issuePeriod: BlockNumber,
    requiredBtcConfirmations: number
): Promise<RedeemRequestStatus> {
    return await computeRedeemRequestStatus(
        redeemRequest.status === RedeemRequestStatus.Completed,
        redeemRequest.status === RedeemRequestStatus.Cancelled,
        redeemRequest.status === RedeemRequestStatus.Reimbursed,
        window.polkaBTC.api.createType("BlockNumber", redeemRequest.creation),
        parachainHeight,
        issuePeriod,
        requiredBtcConfirmations,
        redeemRequest.btcTxId,
        redeemRequest.confirmations
    );
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
