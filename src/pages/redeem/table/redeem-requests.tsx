import React, { useEffect } from "react";
import { RedeemRequest } from "../../../common/types/redeem.types";
import { Table } from "react-bootstrap";
import { formatDateTime, remove0x, shortAddress, shortTxId } from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

export default function RedeemRequests() {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const address = useSelector((state: StoreType) => state.general.address);
    const cachedRedeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            const accountId = window.polkaBTC.api.createType("AccountId", address);
            const redeemRequests: RedeemRequest[] = [];
            const redeemRequestMap = await window.polkaBTC.redeem.mapForUser(accountId);
            for (const [key, value] of issueRequestMap) {
                const issueRequest = parachainToUIIssueRequest(key, value);
                issueRequests.push(issueRequest);
            }
            return issueRequests;

            redeemRequests.current = await getUserIssueRequests(address);
            if (!issueRequests) return;
            issueRequests.current.forEach(async (request: IssueRequest) => {
                // start watcher for new issue requests
                if (transactionListeners.indexOf(request.id) === -1 && polkaBtcLoaded) {
                    // the tx watcher updates the storage cache every 10s
                    startTransactionWatcherIssue(request, dispatch);
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
                    {redeemRequests &&
                        redeemRequests.map((request) => {
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