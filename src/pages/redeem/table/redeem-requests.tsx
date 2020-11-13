import React, { useEffect } from "react";
import { RedeemRequest } from "../../../common/types/redeem.types";
import { Table } from "react-bootstrap";
import { shortAddress, parachainToUIRedeemRequest } from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { startTransactionWatcherRedeem } from "../../../common/utils/transaction-watcher";
import { updateAllRedeemRequestsAction } from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import BitcoinTransaction from "../../../common/components/bitcoin-links/transaction";
import BitcoinAddress from "../../../common/components/bitcoin-links/address";

export default function RedeemRequests() {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const address = useSelector((state: StoreType) => state.general.address);
    const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address);
    const transactionListeners = useSelector((state: StoreType) => state.redeem.transactionListeners);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            try {
                const accountId = window.polkaBTC.api.createType("AccountId", address);
                const redeemRequestMap = await window.polkaBTC.redeem.mapForUser(accountId);
                let allRequests = [];

                for (const [key, value] of redeemRequestMap) {
                    allRequests.push(parachainToUIRedeemRequest(key, value));
                }

                dispatch(updateAllRedeemRequestsAction(allRequests));

                if (!allRequests) return;
                allRequests.forEach(async (request: RedeemRequest) => {
                    // start watcher for new redeem requests
                    if (transactionListeners.indexOf(request.id) === -1 && polkaBtcLoaded) {
                        // the tx watcher updates the storage cache every 10s
                        startTransactionWatcherRedeem(request, dispatch);
                    }
                });
            } catch (error) {
                toast.error(error.toString());
            }
        };
        fetchData();
    }, [polkaBtcLoaded, transactionListeners, dispatch, address]);

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
                    {redeemRequests &&
                        redeemRequests.map((request) => {
                            return (
                                <tr key={request.id}>
                                    <td>{shortAddress(request.id)}</td>
                                    <td>{request.amountPolkaBTC} BTC</td>
                                    <td>{request.creation}</td>
                                    <td>
                                        <BitcoinAddress btcAddress={request.vaultBTCAddress} shorten />
                                    </td>
                                    <td>
                                        <BitcoinTransaction txId={request.btcTxId} shorten />
                                    </td>
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
