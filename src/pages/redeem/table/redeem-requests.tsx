import React, { useEffect, useRef } from "react";
import { RedeemRequest } from "../../../common/types/redeem.types";
import { Table } from "react-bootstrap";
import { 
    formatDateTime,
    remove0x,
    shortAddress,
    shortTxId,
    parachainToUIRedeemRequest
} from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { startTransactionWatcherRedeem } from '../../../common/utils/transaction-watcher';

/**
 * This function adds new redeem requests that are not in the currently stored in this browser's
 * local storage.
 * 
 * @param address the current address of the account
 * @param currentRedeemRequest the current redeem requests locally stored
 */
async function updateUserRedeemRequests(address: string, currentRedeemRequests: RedeemRequest[] | undefined): Promise<RedeemRequest[]> {
    const accountId = window.polkaBTC.api.createType("AccountId", address);
    // use current issue requests, otherwise init empty array
    let updatedRedeemRequests: RedeemRequest[] = currentRedeemRequests? currentRedeemRequests : [];
    const redeemRequestMap = await window.polkaBTC.redeem.mapForUser(accountId);
    
    // FIXME: this implementation is somewhat inefficient since we need to search in the array
    // instead of in the mapping.
    for (const [key, value] of redeemRequestMap) {
        // only add redeem requests that are not yet in the local storage
        // TODO: integrate the automatic BTC tx monitoring. The parachain
        // does not store the BTC tx. With the current version,
        // and in case a user switches browsers,
        // the user has to manually update the BTC tx id.
        if (updatedRedeemRequests.find(request => request.id !== key.toString())) {
            const redeemRequest = parachainToUIRedeemRequest(key, value);
            updatedRedeemRequests.push(redeemRequest);
        }
    }
    return updatedRedeemRequests;
}

export default function RedeemRequests() {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const address = useSelector((state: StoreType) => state.general.address);
    const cachedRedeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address);

    // store `cachedRedeemRequests` in useRef hook, so changes from the useEffect preserve across renders
    const redeemRequests = useRef(cachedRedeemRequests);
    const transactionListeners = useSelector((state: StoreType) => state.redeem.transactionListeners);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            redeemRequests.current = await updateUserRedeemRequests(address, redeemRequests.current);
            if (!redeemRequests) return;
            redeemRequests.current.forEach(async (request: RedeemRequest) => {
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
                        <th>Creation</th>
                        <th>Vault BTC Address</th>
                        <th>BTC Transaction</th>
                        <th>Confirmations</th>
                        <th>Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {redeemRequests.current &&
                        redeemRequests.current.map((request) => {
                            return (
                                <tr key={request.id}>
                                    <td>{shortAddress(request.id)}</td>
                                    <td>{request.amountPolkaBTC} BTC</td>
                                    <td>{formatDateTime(request.creation)}</td>
                                    <td>{shortAddress(remove0x(request.vaultBTCAddress))}</td>
                                    <td>{shortTxId(request.btcTxId)}</td>
                                    <td>{request.confirmations}</td>
                                    <td>{request.completed ? <FaCheck></FaCheck> : <FaHourglass></FaHourglass>}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </div>
    )
}