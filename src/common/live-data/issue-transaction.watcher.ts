import { stripHexPrefix } from "@interlay/polkabtc";
import { Dispatch } from "redux";
import { updateIssueRequestAction, updateAllIssueRequestsAction } from "../actions/issue.actions";
import { updateBalances, parachainToUIIssueRequest, requestsInStore, computeIssueRequestStatus } from "../utils/utils";
import { StoreState } from "../types/util.types";
import { IssueRequest, IssueRequestStatus } from "../types/issue.types";
import { BlockNumber } from "@polkadot/types/interfaces";

export default async function fetchIssueTransactions(dispatch: Dispatch, store: StoreState): Promise<void> {
    try {
        const { address, balanceDOT, balancePolkaBTC, polkaBtcLoaded } = store.getState().general;
        if (!address || !polkaBtcLoaded) return;

        const storeRequests = store.getState().issue.issueRequests.get(address) || [];

        const accountId = window.polkaBTC.api.createType("AccountId", address);
        const issueRequestMap = await window.polkaBTC.issue.mapForUser(accountId);

        const parachainHeight = await window.polkaBTC.system.getCurrentBlockNumber();
        const issuePeriod = await window.polkaBTC.issue.getIssuePeriod();
        const requiredBtcConfirmations = await window.polkaBTC.btcRelay.getStableBitcoinConfirmations();

        const parachainRequests: IssueRequest[] = [];

        for (const [key, value] of issueRequestMap) {
            parachainRequests.push(
                await parachainToUIIssueRequest(key, value, parachainHeight, issuePeriod, requiredBtcConfirmations)
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

                if (parachainRequest.amountBTC !== storeRequest.amountBTC) {
                    storeRequest.amountBTC = parachainRequest.amountBTC;
                    storeRequest.fee = parachainRequest.fee;
                    const amount = new Big(parachainRequest.amountBTC).add(new Big(parachainRequest.fee));
                    storeRequest.totalAmount = amount.toString();
                    shouldRequestBeUpdated = true;
                }

                if (
                    storeRequest.status !== IssueRequestStatus.Completed &&
                    storeRequest.status !== IssueRequestStatus.Cancelled
                ) {
                    if (!storeRequest.btcTxId) {
                        const btcTxId = await window.polkaBTC.btcCore.getTxIdByRecipientAddress(
                            storeRequest.vaultBTCAddress,
                            storeRequest.amountBTC
                        );
                        storeRequest.btcTxId = btcTxId;
                        shouldRequestBeUpdated = true;
                    }

                    if (
                        parachainRequest.status === IssueRequestStatus.Completed ||
                        parachainRequest.status === IssueRequestStatus.Cancelled
                    ) {
                        storeRequest = {
                            ...storeRequest,
                            status: await getIssueRequestStatus(
                                parachainRequest,
                                parachainHeight,
                                issuePeriod,
                                requiredBtcConfirmations
                            ),
                        };
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
                    if (shouldRequestBeUpdated) {
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

async function getIssueRequestStatus(
    issueRequest: IssueRequest,
    parachainHeight: BlockNumber,
    issuePeriod: BlockNumber,
    requiredBtcConfirmations: number
): Promise<IssueRequestStatus> {
    return await computeIssueRequestStatus(
        issueRequest.status === IssueRequestStatus.Completed,
        issueRequest.status === IssueRequestStatus.Cancelled,
        window.polkaBTC.api.createType("BlockNumber", issueRequest.creation),
        parachainHeight,
        issuePeriod,
        requiredBtcConfirmations,
        issueRequest.btcTxId,
        issueRequest.confirmations
    );
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
