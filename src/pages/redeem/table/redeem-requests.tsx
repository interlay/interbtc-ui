import React, { useEffect, useState, useCallback } from "react";
import { RedeemRequest } from "../../../common/types/redeem.types";
import { Table, Button } from "react-bootstrap";
import { shortAddress, parachainToUIRedeemRequest } from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { startTransactionWatcherRedeem } from "../../../common/utils/transaction-watcher";
import { 
    updateAllRedeemRequestsAction,
    cancelRedeemRequestAction,
    redeemExpiredAction
} from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import BitcoinTransaction from "../../../common/components/bitcoin-links/transaction";
import BitcoinAddress from "../../../common/components/bitcoin-links/address";
import { stripHexPrefix } from "@interlay/polkabtc";

export default function RedeemRequests() {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const address = useSelector((state: StoreType) => state.general.address);
    const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address);
    const transactionListeners = useSelector((state: StoreType) => state.redeem.transactionListeners);
    const [isRedeemExpirationSubscribed, setIsRedeemExpirationSubscribed] = useState(false);
    const dispatch = useDispatch();

    const cancelRedeemRequest = async (redeemId: string): Promise<void> => {
        const id = window.polkaBTC.api.createType("H256", redeemId);
        await window.polkaBTC.redeem.cancel(id);
        dispatch(cancelRedeemRequestAction(redeemId));
        toast.success("Request is canceled");
    }

    const redeemExpired = useCallback((redeemId: string) => {
        if (!redeemRequests || !redeemRequests.length) return;
        const requestToBeUpdate = redeemRequests.filter(request => request.id === redeemId)[0];

        if (requestToBeUpdate && !requestToBeUpdate.isExpired) {
            dispatch(redeemExpiredAction({...requestToBeUpdate, isExpired: true}));
        }
    },[redeemRequests, dispatch])

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            try {
                const accountId = window.polkaBTC.api.createType("AccountId", address);
                const redeemRequestMap = await window.polkaBTC.redeem.mapForUser(accountId);
                let updateStore = false;
                let allRequests = [];

                for (const [key, value] of redeemRequestMap) {
                    allRequests.push(parachainToUIRedeemRequest(key, value));
                    if (!redeemRequests) {
                        updateStore = true;
                        continue;
                    }
                    const inStore = redeemRequests.filter((req)=> req.id === stripHexPrefix(key.toString())).length;
                    if (!inStore) {
                        updateStore = true;
                    }
                }

                if (updateStore) {
                    dispatch(updateAllRedeemRequestsAction(allRequests));
                }

                if (!allRequests) return;
                allRequests.forEach(async (request: RedeemRequest) => {
                    // start watcher for new redeem requests
                    if (transactionListeners.indexOf(request.id) === -1 && polkaBtcLoaded) {
                        // the tx watcher updates the storage cache every 10s
                        startTransactionWatcherRedeem(request, dispatch);
                    }

                if(!isRedeemExpirationSubscribed) {
                    setIsRedeemExpirationSubscribed(true);
                    await window.polkaBTC.redeem.subscribeToRedeemExpiry(redeemExpired);
                }
                });
            } catch (error) {
                toast.error(error.toString());
            }
        };
        fetchData();
    }, [polkaBtcLoaded, transactionListeners, isRedeemExpirationSubscribed,
        dispatch, address, redeemExpired, redeemRequests]);

    return (
        <div>
            <Table hover responsive size={"md"}>
                <thead>
                    <tr>
                        <th>Redeem ID</th>
                        <th>Amount</th>
                        <th>Block Number</th>
                        <th>Output BTC Address</th>
                        <th>BTC Transaction</th>
                        <th>Confirmations</th>
                        <th>Completed</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {redeemRequests &&
                        redeemRequests.map((request) => {
                            return (
                                <tr key={request.id}>
                                    <td>{shortAddress(request.id)}</td>
                                    <td>{request.amountPolkaBTC} BTC</td>
                                    <td>{request.creation}</td>
                                    <td>
                                        <BitcoinAddress btcAddress={request.btcAddress} shorten />
                                    </td>
                                    <td>
                                        <BitcoinTransaction txId={request.btcTxId} shorten />
                                    </td>
                                    <td>{request.confirmations}</td>
                                    <td>{
                                        request.completed ? <FaCheck></FaCheck> : <FaHourglass></FaHourglass>}
                                    </td>
                                    <td>
                                        {!request.completed && request.isExpired &&
                                            <Button 
                                                variant="outline-dark"
                                                onClick={() => {cancelRedeemRequest(request.id)}}
                                            >Cancel</Button>
                                        }   
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
}
