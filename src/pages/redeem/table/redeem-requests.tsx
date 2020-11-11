import React, { useEffect } from "react";
import { RedeemRequest } from "../../../common/types/redeem.types";
import { Table } from "react-bootstrap";
import { shortAddress, shortTxId, parachainToUIRedeemRequest } from "../../../common/utils/utils";
import { stripHexPrefix } from "@interlay/polkabtc";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { startTransactionWatcherRedeem } from "../../../common/utils/transaction-watcher";
import { RedeemActions } from "../../../common/types/actions.types";
import { Dispatch } from "redux";
import { updateAllRedeemRequestsAction } from "../../../common/actions/redeem.actions";
/**
 * This function adds new redeem requests that are not in the currently stored in this browser's
 * local storage.
 *
 * @param address the current address of the account
 * @param currentRedeemRequest the current redeem requests locally stored
 */
async function updateUserRedeemRequests(
    address: string,
    currentRedeemRequests: RedeemRequest[] = [],
    dispatch: Dispatch<RedeemActions>
): Promise<RedeemRequest[]> {
    const accountId = window.polkaBTC.api.createType("AccountId", address);
    let updatedRedeemRequests = [...currentRedeemRequests]
    const redeemRequestMap = await window.polkaBTC.redeem.mapForUser(accountId);
    let storeNeedsUpdate = false;

    for (const [key, value] of redeemRequestMap) {
        if (!updatedRedeemRequests.find((request) => request.id === key.toString())) {
            const redeemRequest = parachainToUIRedeemRequest(key, value);
            updatedRedeemRequests.push(redeemRequest);
            storeNeedsUpdate = true;
        }
    }

    if(storeNeedsUpdate) {
        dispatch(updateAllRedeemRequestsAction(updatedRedeemRequests));
    }

    return updatedRedeemRequests;
}

export default function RedeemRequests() {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const address = useSelector((state: StoreType) => state.general.address);
    const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address);
    const transactionListeners = useSelector((state: StoreType) => state.redeem.transactionListeners);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            const allRequests = await updateUserRedeemRequests(address, redeemRequests, dispatch);
            
            if (!allRequests) return;
            allRequests.forEach(async (request: RedeemRequest) => {
                // start watcher for new redeem requests
                if (transactionListeners.indexOf(request.id) === -1 && polkaBtcLoaded) {
                    // the tx watcher updates the storage cache every 10s
                    startTransactionWatcherRedeem(request, dispatch);
                }
            });
        };
        fetchData();
    }, [polkaBtcLoaded, redeemRequests, transactionListeners, dispatch, address]);

    return (
        <div>
            <Table hover responsive size={"md"}>
                <thead>
                    <tr>
                        <th>Redeem ID</th>
                        <th>Amount</th>
                        <th>Block Number</th>
                        <th>Vault BTC Address</th>
                        <th>BTC Transaction</th>
                        <th>Confirmations</th>
                        <th>Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {redeemRequests && redeemRequests.map((request) => {
                            return (
                                <tr key={request.id}>
                                    <td>{shortAddress(request.id)}</td>
                                    <td>{request.amountPolkaBTC} BTC</td>
                                    <td>{request.creation}</td>
                                    <td>{shortAddress(stripHexPrefix(request.vaultBTCAddress))}</td>
                                    <td>{shortTxId(request.btcTxId)}</td>
                                    <td>{request.confirmations}</td>
                                    <td>{request.completed ? <FaCheck></FaCheck> : <FaHourglass></FaHourglass>}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
}
