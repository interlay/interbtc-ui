import React, { useEffect, useState } from "react";

import { Table } from "react-bootstrap";
import { dateToShortString, remove0x, shortAddress, shortTxId } from "../../../common/utils/utils";
import { FaCheck, FaHourglass } from "react-icons/fa";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { RedeemRequest } from "../../../common/types/redeem.types";

export default function RedeemRequests() {
    const [redeemRequests, setRedeemRequests] = useState<Array<RedeemRequest>>([]);
    const storage = useSelector((state: StoreType) => state.storage);

    useEffect(() => {
        const fetchData = async () => {
            if (!storage) return;
            const redeemRequests = storage.getRedeemRequests();
            setRedeemRequests(redeemRequests);
        }
        fetchData();
    }, [storage]);

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
                    {
                        redeemRequests.map((request) => {
                            return (
                                <tr>
                                    <td key={request.id}>{shortAddress(request.id)}</td>
                                    <td>{request.amountPolkaBTC} BTC</td>
                                    <td>{dateToShortString(request.creation)}</td>
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