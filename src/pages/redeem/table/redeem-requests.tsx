import React from "react";

import { Table } from "react-bootstrap";
import { formatDateTime, remove0x, shortAddress, shortTxId } from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

export default function RedeemRequests() {
    const address = useSelector((state: StoreType) => state.general.address);
    const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address);

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